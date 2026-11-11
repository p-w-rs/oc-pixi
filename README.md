# oc-pixi

Helps OpenCode agents use [Pixi](https://pixi.sh) for every environment: standalone scripts with their dependencies
inside the file (Python, and R, C/C++, Rust or shell scripts), Pixi workspaces for projects in any language, and
one-off commands, instead of `pip`, `uv`, `venv`, `conda` or system installs. Nothing is ever blocked; each part can be
turned off in **Settings → Pixi**. macOS and Linux; OpenCode 2.2.6+ and Pixi.

| Part | What it does |
|---|---|
| **Pixi first** | A short rule in every request, plus what the project has: a Pixi workspace and its tasks and environments, or another tool (uv, poetry, requirements.txt) that agents should respect instead of converting unasked. A `pixi` skill with tested recipes: scripts, `pixi exec`, workspaces, C++/CMake, Rust, Go, Node, R, CUDA and PyTorch, CI and Docker, converting projects, troubleshooting. |
| **Hints when agents bypass Pixi** | When an agent runs `pip install`, `uv`, `python`, `conda`, `python -m venv`, `poetry` or `pixi run pip install`, the command runs as usual and the agent gets the Pixi equivalent with the result, at the moment it matters. |
| **Pixi documentation** | `pixi_docs`: agents search and read the full official Pixi documentation (209 pages, Pixi 0.81), bundled and offline. |

## Install

```sh
git clone https://github.com/p-w-rs/oc-pixi.git && cd oc-pixi
pixi run --locked install          # runs the tests, then installs a verified snapshot into your OpenCode config
```

Or install every plugin at once with [oc-plugins](https://github.com/p-w-rs/oc-plugins). `install-status`,
`rollback` and `uninstall` work as in the other oc-* plugins. Updating: `git pull && pixi run --locked install`.

## Development

```sh
pixi run --locked test             # type check and unit tests (hints, docs search, plugin, installer)
pixi run --locked smoke-host       # end to end on the real OpenCode CLI with a scripted model
pixi run bundle-docs <pixi-src>    # re-bundle the docs from a prefix-dev/pixi checkout (git clone --branch v<version>)
```

Layout: `plugin/index.ts` (server plugin), `plugin/hints.ts` (command detection), `plugin/docs.ts` (docs search),
`plugin/gui.tsx` (Settings page), `skill/pixi/SKILL.md`, `docs/pixi` (bundled documentation).

The bundled documentation is © 2023 prefix.dev GmbH, BSD 3-Clause License (`docs/LICENSE-pixi`); it is included
unchanged except that snippet includes are resolved and images removed. The rest of this repository is UNLICENSED,
like the other oc-* plugins.
