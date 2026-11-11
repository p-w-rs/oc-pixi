import { test } from "node:test"
import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import { excerpt, PixiDocs, splitSections } from "./docs.js"

const docs = new PixiDocs(fileURLToPath(new URL("../docs/pixi/", import.meta.url)))

test("sections split on headings, not inside code fences", () => {
  const sections = splitSections("a.md", "# Title\nintro\n```sh\n# not a heading\n```\n## Part\nbody")
  assert.deepEqual(sections.map(s => s.heading), ["Title", "Part"])
})

test("the bundled docs answer typical questions with the right page first", async () => {
  const top = async (query: string) => (await docs.search(query, 3)).map(r => r.section.page)
  assert.ok((await top("inline script dependencies pep 723")).includes("python/scripts.md"))
  assert.ok((await top("conda-script other languages entrypoint")).includes("tutorials/conda_script.md"))
  assert.ok((await top("pytorch cuda gpu")).some(page => page.startsWith("python/pytorch")))
  assert.ok((await top("switching from uv")).includes("switching_from/uv.md"))
  assert.match(await docs.read("python/scripts.md#Make a script self-contained"), /pixi init --script earthquakes\.py/)
  await assert.rejects(docs.read("nope.md"), /No page/)
  assert.ok((await docs.pages()).length > 150)
})

test("excerpts start near the match and keep code fences closed", () => {
  const text = "one\ntwo\nthree\n```sh\npixi add numpy\n" + "x\n".repeat(400)
  const out = excerpt(text, "numpy", 100)
  assert.match(out, /pixi add numpy/)
  assert.equal(out.match(/```/g)!.length % 2, 0)
})
