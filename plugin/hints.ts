// Just-in-time Pixi hints: when an agent runs Python tooling directly (pip, uv, python, conda, venv, poetry), the
// command still runs unchanged; a short note with the Pixi way is appended to its result. Pure functions, no I/O.

export interface Hint { readonly kind: string; readonly text: string }

/** Shell words, roughly: splits on whitespace and command separators, drops quotes. Good enough for detection. */
const segments = (command: string) => command
  .replace(/\\\n/g, " ")
  .split(/&&|\|\||;|\||\n|\$\(|`/)
  .map(part => part.trim().replace(/^(?:\(|\{|!|then\b|do\b|else\b|exec\b|time\b|nohup\b|sudo\b(?:\s+-\S+)*|env\b(?:\s+\w+=\S*)*|(?:\w+=\S*\s+)+)\s*/g, "").trim())
  .filter(Boolean)

const first = (segment: string) => (/^(\S+)/.exec(segment)?.[1] ?? "").replace(/^["']|["']$/g, "").replace(/^.*\//, "")

/** Commands already going through Pixi, or inside a Pixi environment, are fine. */
const VIA_PIXI = /(^|\s|\/)pixi\s+(run|exec|x|r|shell|shell-hook|global|add|init|install|lock|update|upgrade|remove|task|list|tree|search|info|clean|workspace|import)\b|\.pixi\/envs\//

export function detect(command: string): Hint[] {
  if (!command || VIA_PIXI.test(command) && !/\bpixi\s+run\s+(?:python\s+-m\s+)?pip3?\s+install\b/.test(command)) return []
  const hints = new Map<string, Hint>()
  const add = (kind: string, text: string) => { if (!hints.has(kind)) hints.set(kind, { kind, text }) }
  if (/\bpixi\s+run\s+(?:python3?\s+-m\s+)?pip3?\s+install\b/.test(command)) add("pip-in-pixi", "`pixi run pip install` bypasses the lock file: use `pixi add <pkg>` (conda-forge) or `pixi add --pypi <pkg>` instead.")
  for (const segment of segments(command)) {
    const tool = first(segment)
    const rest = segment.slice(segment.indexOf(tool) + tool.length).trim()
    if (/^pip3?$/.test(tool) || /^python[\d.]*$/.test(tool) && /^-m\s+pip\b/.test(rest)) {
      if (/\binstall\b/.test(rest)) add("pip", "Instead of pip install: in a project `pixi add <pkg>` (conda-forge) or `pixi add --pypi <pkg>` (PyPI only), then `pixi run …`; for one script, put the dependencies in it: `pixi add --script file.py <pkg>` and `pixi run --script file.py`; for a quick one-off: `pixi exec --spec <pkg> --spec python …`.")
      else if (/\b(freeze|list|show)\b/.test(rest)) add("pip-list", "To see what is installed: `pixi list` (or `pixi tree <pkg>` for why).")
    } else if (tool === "uv" || tool === "uvx") {
      if (/^(run)\b/.test(rest) && /--script|\.py\b/.test(rest)) add("uv-script", "Instead of uv run for a script: `pixi run --script file.py` (PEP 723 inline dependencies work as-is; add conda packages with `pixi add --script file.py <pkg>`).")
      else if (/^(add|pip|sync|lock|venv|init)\b/.test(rest)) add("uv", "Instead of uv: `pixi init` (or `pixi init --format pyproject` for an existing pyproject.toml), `pixi add <pkg>` / `pixi add --pypi <pkg>`, `pixi run <cmd>`, `pixi lock`. An existing uv project: see docs switching_from/uv.md (pixi_docs).")
      else if (tool === "uvx" || /^tool\b/.test(rest)) add("uvx", "Instead of uvx: `pixi exec <tool> …` runs a tool in a temporary environment (`pixi exec --spec ruff ruff check .`).")
      else add("uv", "Prefer Pixi over uv here: `pixi run <cmd>` in a workspace, `pixi run --script file.py` for a single file.")
    } else if (/^(conda|mamba|micromamba)$/.test(tool)) {
      add("conda", "Instead of conda environments: `pixi init` + `pixi add <pkg>` (same conda-forge packages, locked per project), `pixi run <cmd>`; `pixi init --import environment.yml` converts an existing file.")
    } else if (tool === "poetry" || tool === "pipenv" || tool === "pipx" || tool === "virtualenv" || tool === "pyenv") {
      add(tool, tool === "pipx" ? "Instead of pipx: `pixi global install <tool>` (only when the user wants a tool installed globally) or `pixi exec <tool>` for a one-off." : `Instead of ${tool}: a Pixi workspace (\`pixi init\`, \`pixi add\`, \`pixi run\`); Pixi manages the Python version too (\`pixi add python=3.12\`).`)
    } else if (/^python[\d.]*$/.test(tool)) {
      if (/^-m\s+venv\b/.test(rest)) add("venv", "No virtual environments needed: `pixi init` then `pixi add python=3.12 <pkgs>`; Pixi keeps the environment in .pixi/ and `pixi run …` uses it.")
      else if (/(^|\s)-[cV]\b|--version/.test(rest) && !/import\s+\w/.test(rest)) add("python-c", "System Python may differ between machines: `pixi exec --spec python=3.12 python -c …` (add `--spec <pkg>` for imports) or `pixi run python …` in a workspace.")
      else add("python", "Run Python through Pixi so the interpreter and packages are pinned: `pixi run python …` in a workspace (pixi.toml / [tool.pixi]), or `pixi run --script file.py` for a standalone script with inline dependencies (`pixi init --script file.py`).")
    } else if (/^(brew|apt|apt-get|port)$/.test(tool) && /\binstall\b/.test(rest)) {
      add("system", "For a project's toolchain, prefer `pixi add <pkg>` (conda-forge has compilers, cmake, node, go, rust, R, …) over system packages, so it builds the same on every machine. Only install system packages if the user asks.")
    }
  }
  return [...hints.values()]
}

/** The note appended to the command's result. */
export const hintText = (hints: readonly Hint[]) => hints.length ? `\n\n[oc-pixi] This command ran as given. Next time: ${hints.map(hint => hint.text).join(" ")} (Load the pixi skill for details.)` : ""
