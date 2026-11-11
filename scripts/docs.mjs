// Bundles Pixi's documentation (BSD-3-Clause, prefix.dev GmbH) for agents: every Markdown page of a pixi release with
// its snippet includes (`--8<-- "file"`, `"file:section"`, `"file:start:end"`) resolved inline, images and site-only
// markup removed. Run when updating to a new Pixi version:
//   git clone --depth 1 --branch v<version> https://github.com/prefix-dev/pixi.git <dir>
//   pixi run bundle-docs <dir>
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const source = resolve(process.argv[2] ?? "")
const out = join(root, "docs", "pixi")
const SKIP = /^(partials|overrides|javascripts|stylesheets|assets|source_files)\//

const read = async path => { try { return await readFile(join(source, path), "utf8") } catch { return undefined } }
const MARK = /--8<--\s*\[(start|end):[^\]]*\]/

async function include(spec, depth) {
  const [path, a, b] = spec.split(":")
  const text = await read(path)
  if (text === undefined) return /_extender$/.test(path) ? "" : `(missing include: ${spec})`
  let lines = text.split("\n")
  if (a && /^\d+$/.test(a)) lines = lines.slice(Number(a) - 1, b && /^\d+$/.test(b) ? Number(b) : undefined)
  else if (a) {
    const start = lines.findIndex(line => line.includes(`[start:${a}]`)), end = lines.findIndex(line => line.includes(`[end:${a}]`))
    if (start < 0) return /_extender$/.test(path) ? "" : `(missing section ${a} in ${path})`
    lines = lines.slice(start + 1, end > start ? end : undefined)
  }
  return expand(lines.filter(line => !MARK.test(line)).join("\n"), depth + 1)
}

async function expand(text, depth = 0) {
  if (depth > 5) return text
  const lines = []
  for (const line of text.split("\n")) {
    const match = /^(\s*)--8\s*<\s*--\s*"([^"]+)"\s*$/.exec(line)
    if (!match) { lines.push(line); continue }
    for (const part of (await include(match[2], depth)).replace(/\n+$/, "").split("\n")) lines.push(part ? match[1] + part : "")
  }
  return lines.join("\n")
}

const clean = text => text
  .replace(/^---\n[\s\S]*?\n---\n/, "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/!\[[^\]]*\]\([^)]*\)(\{[^}]*\})?/g, "")
  .replace(/^\s*<(img|video|source|iframe|div|\/div|figure|\/figure|p align|\/p|br)\b[^\n]*$/gm, "")
  .replace(/\{\s*(\.|#)[^}]*\}/g, "")
  .replace(/\n{3,}/g, "\n\n")
  .trim() + "\n"

async function walk(directory) {
  const files = []
  for (const entry of await readdir(join(source, directory), { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (entry.name.endsWith(".md")) files.push(path)
  }
  return files
}

if (!process.argv[2] || (await read("docs/index.md")) === undefined) throw new Error("Usage: pixi run bundle-docs <pixi source checkout>")
const version = /^v?(\d+\.\d+\.\d+)/.exec((await read("pixi.toml") ?? await read("Cargo.toml") ?? "").match(/version\s*=\s*"([^"]+)"/)?.[1] ?? process.argv[3] ?? "")?.[1] ?? process.argv[3] ?? "unknown"
await rm(out, { recursive: true, force: true })
let pages = 0, bytes = 0
for (const file of (await walk("docs")).sort()) {
  const path = relative("docs", file)
  if (SKIP.test(path) || /(^|\/)(__README|README)\.md$/.test(path) && path.startsWith("reference/cli/")) continue
  const text = clean(await expand(await read(file)))
  if (text.length < 40) continue
  await mkdir(dirname(join(out, path)), { recursive: true })
  await writeFile(join(out, path), text)
  pages++; bytes += text.length
}
await writeFile(join(root, "docs", "LICENSE-pixi"), await read("LICENSE"))
await writeFile(join(root, "docs", "pixi-docs.json"), JSON.stringify({ version, pages, source: "https://github.com/prefix-dev/pixi/tree/main/docs", license: "BSD-3-Clause, Copyright (c) 2023, prefix.dev GmbH (docs/LICENSE-pixi)" }, null, 2) + "\n")
console.log(`Bundled ${pages} pages (${Math.round(bytes / 1024)} KB) of the Pixi ${version} docs into docs/pixi.`)
