import { readFileSync, statSync } from "node:fs"
import { mkdir, rename, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

export const PLUGIN_ID = "oc-pixi"
export const VERSION = "1.0.1"

export const dataDirectory = (configured?: string) => configured ?? join(process.env.XDG_DATA_HOME || join(homedir(), ".local", "share"), PLUGIN_ID)

export interface Settings {
  /** A short Pixi rule in every request, and the pixi skill. */
  readonly guide: boolean
  /** A Pixi hint appended to the result of commands that use pip, uv, python, conda, venv or poetry directly. */
  readonly hints: boolean
  /** The pixi_docs tool: search and read the bundled Pixi documentation. */
  readonly docs: boolean
}

export const DEFAULTS: Settings = { guide: true, hints: true, docs: true }
const BOOLEANS = ["guide", "hints", "docs"] as const

export function normalizeSettings(raw: unknown, base: Settings = DEFAULTS): Settings {
  const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {}
  const result: Record<string, unknown> = { ...base }
  for (const key of BOOLEANS) if (typeof value[key] === "boolean") result[key] = value[key]
  return result as unknown as Settings
}

/** `<data>/settings.json`, shared by every OpenCode server on this computer. */
export class SettingsStore {
  #value: Settings = DEFAULTS
  #mtime = -1
  private constructor(readonly path: string) {}

  static async open(directory: string): Promise<SettingsStore> {
    await mkdir(directory, { recursive: true, mode: 0o700 })
    const store = new SettingsStore(join(directory, "settings.json"))
    store.current()
    return store
  }

  current(): Settings {
    let mtime = 0
    try { mtime = statSync(this.path).mtimeMs } catch {}
    if (mtime !== this.#mtime) {
      this.#mtime = mtime
      try { this.#value = mtime ? normalizeSettings(JSON.parse(readFileSync(this.path, "utf8"))) : DEFAULTS } catch { this.#value = DEFAULTS }
    }
    return this.#value
  }

  async update(patch: unknown): Promise<Settings> {
    const next = normalizeSettings(patch, this.current())
    const temporary = `${this.path}.${process.pid}.tmp`
    await writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600 })
    await rename(temporary, this.path)
    return this.current()
  }

  watch(listener: (settings: Settings) => void, intervalMs = 3000): () => void {
    let last = JSON.stringify(this.current())
    const timer = setInterval(() => { const now = JSON.stringify(this.current()); if (now !== last) { last = now; listener(this.current()) } }, intervalMs)
    timer.unref?.()
    return () => clearInterval(timer)
  }
}
