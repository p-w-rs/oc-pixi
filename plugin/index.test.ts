import { after, test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { Plugin } from "@opencode/plugin"
import plugin, { createPlugin, parseOptions, PLUGIN_ID, projectNote } from "./index.js"

const dirs: string[] = []
after(async () => { await Promise.all(dirs.map(dir => rm(dir, { recursive: true, force: true }))) })
const scratch = async () => { const dir = await mkdtemp(join(tmpdir(), "ocp-")); dirs.push(dir); return dir }

async function host() {
  const data = await scratch(), project = await scratch()
  const tools = new Map<string, any>(), skills: any[] = [], hooks: Record<string, any[]> = {}
  const transforms: any[] = [], skillTransforms: any[] = []
  let rpc: any
  const rebuild = () => { tools.clear(); for (const t of transforms) t({ add: (tool: any) => tools.set(tool.name, tool) }) }
  const rebuildSkills = () => { skills.length = 0; for (const t of skillTransforms) t({ add: (skill: any) => skills.push(skill) }) }
  const hook = async (name: string, cb: any) => { (hooks[name] ??= []).push(cb); return { dispose: async () => {} } }
  const ctx = {
    options: { dataDirectory: data },
    session: { get: async () => ({ location: { directory: project } }), hook: (name: string, cb: any) => hook(`session.${name}`, cb) },
    tool: { transform: async (cb: any) => { transforms.push(cb); rebuild(); return { dispose: async () => {} } }, reload: async () => rebuild(), hook: (name: string, cb: any) => hook(`tool.${name}`, cb) },
    skill: { transform: async (cb: any) => { skillTransforms.push(cb); rebuildSkills(); return { dispose: async () => {} } }, reload: async () => rebuildSkills() },
    rpc: { register: async (_: unknown, handlers: any) => { rpc = handlers; return { dispose: async () => {} } } },
  }
  const cleanup = await createPlugin().setup(ctx as unknown as Plugin.Context) as () => Promise<void>
  const run = async (name: string, input: any) => { for (const cb of hooks[name] ?? []) await cb(input); return input }
  const system = async () => (await run("session.context", { sessionID: "s", system: [], messages: [] })).system.map((p: any) => p.text).join("\n---\n")
  const shell = async (command: string, content: unknown = "ok") => (await run("tool.execute.after", { tool: "shell", sessionID: "s", status: "completed", input: { command }, result: { content } })).result.content
  return { project, tools, skills, system, shell, cleanup, rpc: () => rpc }
}

test("identity and options", () => {
  assert.equal(plugin.id, PLUGIN_ID)
  assert.throws(() => parseOptions({ dataDirectory: "rel" }), /absolute/)
})

test("guide, skill, docs tool and hints are on by default and each can be turned off", async () => {
  const h = await host()
  assert.deepEqual([...h.tools.keys()], ["pixi_docs"])
  assert.equal(h.skills[0].id, "pixi")
  assert.match(h.skills[0].content, /full Pixi .* documentation is bundled/)
  assert.match(await h.system(), /Pixi \(oc-pixi\): use Pixi/)
  assert.deepEqual((await h.shell("pip install rich")).map((part: any) => part.text.slice(0, 40)), ["ok", "[oc-pixi] This command ran as given. Nex"])
  assert.equal(await h.shell("pixi run test"), "ok")
  assert.match(JSON.stringify(await h.shell("uv pip install x", [{ type: "text", text: "done" }])), /oc-pixi/)
  const state = await h.rpc().update({ guide: false, hints: false, docs: false })
  assert.deepEqual(state.settings, { guide: false, hints: false, docs: false })
  assert.equal(h.tools.size, 0)
  assert.equal(h.skills.length, 0)
  assert.equal(await h.system(), "")
  assert.equal(await h.shell("pip install rich"), "ok")
  assert.ok(state.docs.pages > 150)
  await h.cleanup()
})

test("pixi_docs searches and reads", async () => {
  const h = await host()
  const found = (await h.tools.get("pixi_docs").execute({ query: "standalone script inline dependencies" })).content
  assert.match(found, /python\/scripts\.md#/)
  const page = (await h.tools.get("pixi_docs").execute({ page: "switching_from/uv.md" })).content
  assert.match(page, /^# Pixi docs: switching_from\/uv\.md/)
  await assert.rejects(h.tools.get("pixi_docs").execute({}), /Give a query/)
  await h.cleanup()
})

test("project note: Pixi workspace with tasks and features; other tools are respected, not converted", async () => {
  const dir = await scratch()
  assert.equal(await projectNote(dir), undefined)
  await writeFile(join(dir, "pixi.toml"), '[workspace]\nname="x"\n\n[tasks]\ntest = "pytest"\nbuild = { cmd = "make" }\n\n[feature.cuda.dependencies]\npytorch-gpu = "*"\n')
  assert.match((await projectNote(dir))!, /Pixi workspace \(pixi\.toml\)\. Tasks: test, build .*Features: cuda/)
  const other = await scratch()
  await writeFile(join(other, "uv.lock"), "")
  await writeFile(join(other, "pyproject.toml"), "[project]\nname='y'\n")
  assert.match((await projectNote(other))!, /has uv\.lock, pyproject\.toml but no Pixi workspace\. Don't convert it unless the user asks/)
  const both = await scratch()
  await writeFile(join(both, "pyproject.toml"), "[project]\nname='z'\n\n[tool.pixi.workspace]\nchannels=['conda-forge']\n\n[tool.pixi.tasks]\nlint = 'ruff'\n")
  assert.match((await projectNote(both))!, /pyproject\.toml \[tool\.pixi\]\)\. Tasks: lint/)
})
