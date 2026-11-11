// The bundled Pixi documentation, split into sections and searched by keywords (BM25). Loaded lazily, kept in memory.
import { readdir, readFile } from "node:fs/promises"
import { join, relative } from "node:path"

export interface Section { readonly page: string; readonly heading: string; readonly text: string }

const STOP = new Set("a an and are as at be by can for from how i in is it of on or that the this to use with you your do does what when which".split(" "))
const words = (text: string) => text.toLowerCase().match(/[a-z0-9][a-z0-9_.+-]*[a-z0-9]|[a-z0-9]/g)?.filter(word => !STOP.has(word)) ?? []

export function splitSections(page: string, markdown: string): Section[] {
  const sections: Section[] = []
  let heading = (/^#\s+(.+)$/m.exec(markdown)?.[1] ?? page).trim()
  let lines: string[] = []
  let fence = false
  const flush = () => { const text = lines.join("\n").trim(); if (text) sections.push({ page, heading, text }); lines = [] }
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence
    const match = !fence && /^(#{1,3})\s+(.+)$/.exec(line)
    if (match) { flush(); heading = match[2]!.trim() }
    lines.push(line)
  }
  flush()
  return sections
}

export class PixiDocs {
  #sections?: Promise<{ sections: Section[]; terms: Map<string, number>[]; df: Map<string, number>; avg: number }>
  constructor(readonly directory: string) {}

  async #load() {
    return this.#sections ??= (async () => {
      const files: string[] = []
      const walk = async (dir: string) => {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
          const path = join(dir, entry.name)
          if (entry.isDirectory()) await walk(path)
          else if (entry.name.endsWith(".md")) files.push(path)
        }
      }
      await walk(this.directory)
      const sections = (await Promise.all(files.sort().map(async file => splitSections(relative(this.directory, file), await readFile(file, "utf8"))))).flat()
      const df = new Map<string, number>()
      const terms = sections.map(section => {
        const counts = new Map<string, number>()
        // The page path and heading count extra: they say what a section is about.
        for (const word of [...words(section.text), ...words(`${section.page.replace(/[/_.]/g, " ")} ${section.heading}`).flatMap(word => [word, word, word])]) counts.set(word, (counts.get(word) ?? 0) + 1)
        for (const word of counts.keys()) df.set(word, (df.get(word) ?? 0) + 1)
        return counts
      })
      const avg = terms.reduce((sum, counts) => sum + [...counts.values()].reduce((a, b) => a + b, 0), 0) / Math.max(1, terms.length)
      return { sections, terms, df, avg }
    })()
  }

  async search(query: string, limit = 6): Promise<{ section: Section; score: number }[]> {
    const { sections, terms, df, avg } = await this.#load()
    const wanted = [...new Set(words(query))]
    if (!wanted.length) return []
    const scored = sections.map((section, index) => {
      const counts = terms[index]!
      const length = [...counts.values()].reduce((a, b) => a + b, 0)
      let score = 0
      for (const word of wanted) {
        const tf = counts.get(word) ?? 0
        if (!tf) continue
        const idf = Math.log(1 + (sections.length - df.get(word)! + 0.5) / (df.get(word)! + 0.5))
        score += idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * length / avg))
      }
      return { section, score }
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)
    return scored.slice(0, limit)
  }

  /** A page, or one section of it (`page#heading`). */
  async read(ref: string): Promise<string> {
    const { sections } = await this.#load()
    const [page, heading] = ref.replace(/^docs\/pixi\//, "").split("#")
    const matches = sections.filter(section => section.page === page || section.page === `${page}.md`)
    if (!matches.length) {
      const pages = [...new Set(sections.map(section => section.page))].filter(name => name.includes(page!.replace(/\.md$/, "").split("/").pop()!))
      throw new Error(`No page ${JSON.stringify(page)} in the Pixi docs${pages.length ? `; did you mean: ${pages.slice(0, 5).join(", ")}` : " (search first)"}`)
    }
    if (heading) {
      const section = matches.find(item => item.heading.toLowerCase() === heading.toLowerCase()) ?? matches.find(item => item.heading.toLowerCase().includes(heading.toLowerCase()))
      if (section) return section.text
    }
    return matches.map(item => item.text).join("\n\n")
  }

  async pages(): Promise<string[]> { return [...new Set((await this.#load()).sections.map(section => section.page))] }
}

export function excerpt(text: string, query: string, max = 700): string {
  const wanted = words(query)
  const lines = text.split("\n")
  const hit = Math.max(0, lines.findIndex(line => wanted.some(word => line.toLowerCase().includes(word))))
  const start = Math.max(0, hit - 2)
  let out = lines.slice(start).join("\n")
  if (out.length > max) out = `${out.slice(0, max)}…`
  if (/```/.test(out) && (out.match(/```/g)!.length % 2)) out += "\n```"
  return (start ? "…\n" : "") + out
}
