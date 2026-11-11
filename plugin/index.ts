import type { Plugin } from "@opencode/plugin"
import { execFile } from "node:child_process"
import { readFileSync } from "node:fs"
import { readFile, stat } from "node:fs/promises"
import { homedir } from "node:os"
import { delimiter, isAbsolute, join } from "node:path"
import { fileURLToPath } from "node:url"
import { excerpt, PixiDocs } from "./docs.js"
import { detect, hintText } from "./hints.js"
import { PixiRpc, type StateView } from "./rpc.js"
import { dataDirectory, PLUGIN_ID, SettingsStore, VERSION } from "./settings.js"

export { PLUGIN_ID, VERSION }
export { detect, hintText } from "./hints.js"

export interface PixiOptions {
  /** Absolute path; default `$XDG_DATA_HOME/oc-pixi`. */
  readonly dataDirectory?: string
}

export function parseOptions(raw: unknown): PixiOptions {
  const options = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  if (options.dataDirectory !== undefined && (typeof options.dataDirectory !== "string" || !isAbsolute(options.dataDirectory))) throw new Error(`${PLUGIN_ID}: dataDirectory must be an absolute path`)
  return options.dataDirectory ? { dataDirectory: options.dataDirectory as string } : {}
}

const ROOT = fileURLToPath(new URL("../", import.meta.url))
const SKILL = join(ROOT, "skill", "pixi", "SKILL.md")
const DOCS = join(ROOT, "docs", "pixi")
const DOCS_INFO = (() => { try { return JSON.parse(readFileSync(join(ROOT, "docs", "pixi-docs.json"), "utf8")) as { version: string; pages: number } } catch { return { version: "unknown", pages: 0 } } })()

export const GUIDE = "Pixi (oc-pixi): use Pixi for every Python environment and, where possible, for other toolchains. A standalone script gets inline dependencies (`pixi init --script f.py`, `pixi add --script f.py numpy`, run with `pixi run --script f.py`); a project gets a workspace (`pixi init`, `pixi add`, `pixi run <cmd or task>`); a one-off command uses `pixi exec --spec <pkg> <cmd>`. Don't run python, pip, uv, conda, venv or poetry directly, and never `pixi run pip install`. Compilers, CMake, Rust, Go, Node, R and CUDA come from conda-forge too (`pixi add cxx-compiler cmake`). Load the pixi skill before setting up an environment; pixi_docs searches the full Pixi documentation."
const warn = (message: string, error?: unknown) => console.warn(`[${PLUGIN_ID}] ${message}${error ? `: ${error instanceof Error ? error.message : String(error)}` : ""}`)
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value)

/** What the project folder says about its environment: a Pixi workspace (with tasks) or another Python tool. */
export async function projectNote(directory: string): Promise<string | undefined> {
  const read = async (name: string) => { try { return await readFile(join(directory, name), "utf8") } catch { return undefined } }
  const exists = async (name: string) => { try { await stat(join(directory, name)); return true } catch { return false } }
  const pixiToml = await read("pixi.toml")
  const pyproject = await read("pyproject.toml")
  const manifest = pixiToml ?? (pyproject && /^\[tool\.pixi[.\]]/m.test(pyproject) ? pyproject : undefined)
  if (manifest) {
    const section = pixiToml ? /^\[tasks\]\s*$([\s\S]*?)(?=^\[)/m.exec(`${manifest}\n[`) : /^\[tool\.pixi\.tasks\]\s*$([\s\S]*?)(?=^\[)/m.exec(`${manifest}\n[`)
    const tasks = [...(section?.[1] ?? "").matchAll(/^([A-Za-z0-9_-]+)\s*=/gm)].map(match => match[1]!).slice(0, 20)
    const envs = [...manifest.matchAll(/^\[(?:tool\.pixi\.)?feature\.([A-Za-z0-9_-]+)/gm)].map(match => match[1]!)
    return `This project is a Pixi workspace (${pixiToml ? "pixi.toml" : "pyproject.toml [tool.pixi]"}${await exists("pixi.lock") ? ", pixi.lock" : ""}).${tasks.length ? ` Tasks: ${tasks.join(", ")} (run with \`pixi run <task>\`; see \`pixi task list\`).` : ""}${envs.length ? ` Features: ${[...new Set(envs)].join(", ")} (environments: \`pixi run -e <env> …\`).` : ""} Add dependencies with \`pixi add\`; use \`pixi run --locked\` to reproduce exactly.`
  }
  const others = [
    await exists("uv.lock") && "uv.lock", await exists("poetry.lock") && "poetry.lock", await exists("requirements.txt") && "requirements.txt",
    await exists("environment.yml") && "environment.yml", await exists("Pipfile") && "Pipfile", pyproject && "pyproject.toml",
  ].filter(Boolean) as string[]
  if (others.length) return `This project has ${others.join(", ")} but no Pixi workspace. Don't convert it unless the user asks (that would be \`pixi init${others.includes("environment.yml") ? " --import environment.yml" : pyproject ? " --format pyproject" : ""}\`, see the pixi skill); to run it now, \`pixi exec --spec python=3.12 …\` or ask the user which tool they use. Scripts you add still use \`pixi run --script\`.`
  return undefined
}

async function findPixi(): Promise<{ path: string; version: string } | undefined> {
  const candidates = [...(process.env.PATH ?? "").split(delimiter).filter(Boolean).map(dir => join(dir, "pixi")), join(homedir(), ".pixi", "bin", "pixi")]
  for (const path of candidates) {
    try { await stat(path) } catch { continue }
    const version = await new Promise<string | undefined>(resolve => execFile(path, ["--version"], { timeout: 5000 }, (error, stdout) => resolve(error ? undefined : stdout.trim().replace(/^pixi\s+/, ""))))
    if (version) return { path, version }
  }
  return undefined
}

// Hints given in this OpenCode process, shared by every plugin instance (one per project location).
const COUNTS = Symbol.for("oc-pixi.hinted.v1")
const hinted = ((globalThis as Record<symbol, unknown>)[COUNTS] ??= {}) as Record<string, number>

export function createPlugin(): Plugin.Plugin {
  return ({
    id: PLUGIN_ID,
    async setup(ctx) {
      const registrations: { dispose(): Promise<void> | void }[] = []
      const cleanup = async () => { await Promise.allSettled(registrations.splice(0).reverse().map(async item => item.dispose())) }
      try {
        const options = parseOptions(ctx.options)
        const data = dataDirectory(options.dataDirectory)
        const settings = await SettingsStore.open(data)
        const docs = new PixiDocs(DOCS)
        const text = (content: string, metadata: Record<string, unknown> = {}) => ({ content, metadata: { plugin: PLUGIN_ID, ...metadata } })
        const notes = new Map<string, { at: number; note?: string }>()
        const projectFor = async (sessionID: string) => {
          const directory = (await ctx.session.get({ sessionID: sessionID as never })).location.directory as string
          const cached = notes.get(directory)
          if (cached && Date.now() - cached.at < 30_000) return cached.note
          const note = await projectNote(directory).catch(() => undefined)
          notes.set(directory, { at: Date.now(), ...(note && { note }) })
          return note
        }

        registrations.push(await ctx.tool.transform(editor => {
          if (!settings.current().docs) return
          editor.add({
            name: "pixi_docs",
            description: `Search or read the official Pixi documentation (Pixi ${DOCS_INFO.version}, bundled, offline): manifests (pixi.toml, pyproject [tool.pixi]), tasks, features and environments, platforms, PyPI and conda dependencies, scripts with inline dependencies (Python and other languages), building packages (C++, Rust, Python), CUDA/PyTorch, CI and Docker, switching from conda/poetry/uv. query: search; page: read a page (path from the results, optionally #heading).`,
            input: {
              type: "object",
              properties: {
                query: { type: "string", maxLength: 300, description: "What you need, e.g. 'cuda feature environment' or 'task depends-on'" },
                page: { type: "string", maxLength: 300, description: "A page from the results, e.g. python/scripts.md or reference/pixi_manifest.md#tasks" },
              },
              additionalProperties: false,
            } as never,
            options: { codemode: false },
            execute: async (raw: unknown) => {
              const input = raw as { query?: string; page?: string }
              if (input.page) {
                const body = await docs.read(input.page)
                return text(`# Pixi docs: ${input.page}\n\n${body.length > 40_000 ? `${body.slice(0, 40_000)}\n… (cut; read a #section)` : body}`)
              }
              if (!input.query?.trim()) throw new Error("Give a query to search, or a page to read")
              const results = await docs.search(input.query, 6)
              if (!results.length) return text("No matches in the Pixi docs. Try other words (e.g. the command name) or read reference/cli/pixi/<command>.md.")
              return text(results.map((result, index) => `${index + 1}. ${result.section.page}#${result.section.heading}\n${excerpt(result.section.text, input.query!)}`).join("\n\n") + "\n\nRead more with pixi_docs page=<path>#<heading>.")
            },
          })
        }))

        let skillReady = false
        try {
          const content = await readFile(SKILL, "utf8")
          registrations.push(await ctx.skill.transform(editor => {
            if (!settings.current().guide) return
            editor.add({ id: "pixi" as never, name: "pixi" as never, description: /^description:\s*(.+)$/m.exec(content)?.[1] ?? "pixi", path: SKILL as never, content: `${content}\n\n---\nThe full Pixi ${DOCS_INFO.version} documentation is bundled: pixi_docs query=… / page=…; files in ${DOCS}\n` })
          }))
          skillReady = true
        } catch (error) { warn("skill not registered", error) }

        registrations.push(await ctx.session.hook("context", async input => {
          if (!settings.current().guide) return
          input.system.push({ type: "text", text: GUIDE } as never)
          try { const note = await projectFor(input.sessionID); if (note) input.system.push({ type: "text", text: note } as never) } catch {}
        }))

        registrations.push(await ctx.tool.hook("execute.after", async input => {
          if (!settings.current().hints || input.status !== "completed" || !/^(shell|bash)$/.test(input.tool)) return
          const command = record(input.input) && typeof input.input.command === "string" ? input.input.command : ""
          const hints = detect(command)
          if (!hints.length) return
          for (const hint of hints) hinted[hint.kind] = (hinted[hint.kind] ?? 0) + 1
          const note = hintText(hints)
          // Replace the result object (OpenCode reads the new one); keep its output and metadata.
          const result = input.result as { content?: unknown; output?: unknown }
          const content = typeof result.content === "string" ? [{ type: "text", text: result.content }] : Array.isArray(result.content) ? result.content : result.output !== undefined ? [{ type: "text", text: typeof result.output === "string" ? result.output : JSON.stringify(result.output) }] : []
          ;(input as { result: unknown }).result = { ...result, content: [...content, { type: "text", text: note.trimStart() }] }
        }))

        const reload = () => Promise.all([ctx.tool.reload(), skillReady ? ctx.skill.reload() : undefined]).catch(error => warn("reload failed", error))
        registrations.push({ dispose: settings.watch(() => void reload()) })

        const state = async (): Promise<StateView> => {
          const pixi = await findPixi()
          return { version: VERSION, settings: settings.current(), dataDirectory: data, ...(pixi && { pixi }), docs: DOCS_INFO, hinted: { ...hinted } }
        }
        registrations.push(await ctx.rpc.register(PixiRpc, {
          state: async () => state(),
          update: async (input: unknown) => { await settings.update(input); await reload(); return state() },
        } as never))
      } catch (error) {
        warn("disabled", error)
        await cleanup()
      }
      return cleanup
    },
  }) satisfies Plugin.Plugin
}

export default createPlugin()
