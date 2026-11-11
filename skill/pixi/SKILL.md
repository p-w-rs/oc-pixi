---
name: pixi
description: Use Pixi (pixi.sh) for every environment — standalone scripts with inline dependencies (Python, and R/C/C++/Rust/shell via conda-script), Pixi workspaces for Python and non-Python projects (C/C++, Rust, Go, Node, R, CUDA, ROS), tasks, features and multiple environments, PyPI + conda-forge packages, PyTorch/CUDA, CI and Docker, converting from pip/uv/poetry/conda. Load before running Python, installing a package, or setting up any project's toolchain.
---

# Working with Pixi

Pixi gives every script and project its own locked, reproducible environment from conda-forge (and PyPI), without
touching the system. One tool replaces `pip`, `venv`, `uv`, `poetry`, `conda`/`mamba`, `pyenv` and most
Homebrew/apt installs of compilers and runtimes. The full official documentation is bundled: `pixi_docs query=…`.

## Decide first: which of three cases?

| Situation | Use | Run with |
|---|---|---|
| One file (a quick analysis, a tool, a check) | **Script** with inline dependencies | `pixi run --script f.py` |
| A project (several files, tests, a team) | **Workspace** (`pixi.toml`, or `[tool.pixi]` in `pyproject.toml`) | `pixi run <task or cmd>` |
| A single command, nothing to keep | **exec** (temporary, cached environment) | `pixi exec --spec pkg cmd` |

If the folder already has `pixi.toml` / `[tool.pixi]`: it is a workspace; use its tasks (`pixi task list`) and
`pixi add` to it. Don't create a second environment next to it.

## Rules

- Never run `python`, `pip`, `uv`, `conda`, `python -m venv` or `poetry` directly; never `pixi run pip install`
  (bypasses the lock). Declare everything with `pixi add` so it is in the manifest and `pixi.lock`.
- Prefer conda-forge packages (`pixi add numpy`); use `--pypi` only for packages that are only on PyPI.
- Commit `pixi.toml`/`pyproject.toml` **and** `pixi.lock`; put `.pixi/` in `.gitignore` (`pixi init` does it).
- Reproduce exactly with `pixi run --locked …` (fails instead of re-solving) — always in CI.
- Existing projects on another tool (uv, poetry, requirements.txt, conda): don't convert unless the user asks;
  run them as documented, or with `pixi exec`. New scripts you write still use Pixi.
- Never install anything globally (`pixi global install`) unless the user asks.

## 1. Standalone scripts

Python (PEP 723 metadata, written by Pixi):

```sh
pixi init --script analyze.py              # adds the metadata block (works on an existing file too)
pixi add --script analyze.py pandas matplotlib   # conda-forge
pixi add --script analyze.py --pypi rich   # PyPI
pixi run --script analyze.py data.csv      # solves once, caches the environment, runs
```

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["rich"]                  # PyPI
#
# [tool.pixi.workspace]
# channels = ["conda-forge"]
#
# [tool.pixi.dependencies]
# pandas = "*"                             # conda-forge
# ///
```

- Executable: first line `#!/usr/bin/env -S pixi run --script`, then `chmod +x analyze.py`; `./analyze.py` works.
- `pixi lock --script f.py` writes `f.py.pixi.lock` next to it for exact reproducibility (optional).
- A script that `uv run` could run already has PEP 723 metadata: `pixi run --script` runs it as-is.

Other languages, in one file (**conda-script**, experimental: pass `--experimental` or set
`pixi config set experimental.conda-script true --global` once). The block uses the file's comment syntax:

```r
# /// conda-script
# channels = ["conda-forge"]
# entrypoint = "Rscript ${SCRIPT}"
#
# [dependencies]
# r-base = "*"
# r-jsonlite = "*"
# /// end-conda-script
```

```cpp
// /// conda-script
// channels = ["conda-forge"]
// entrypoint = "c++ -O2 -std=c++20 -o ${CACHE}/main ${SCRIPT} -lfmt && ${CACHE}/main"
//
// [dependencies]
// cxx-compiler = "*"
// fmt = "*"
// /// end-conda-script
```

Run with `pixi run --experimental --script main.R`. `${SCRIPT}` is the file, `${CACHE}` a per-script build folder.
Shell scripts: `entrypoint = "bash ${SCRIPT}"` with the tools they need (`jq`, `ffmpeg`, `gdal`) as dependencies.
More languages (C, Rust, Julia, Node): `pixi_docs page=tutorials/conda_script.md`.

## 2. One-off commands

```sh
pixi exec --spec python=3.12 --spec numpy python -c "import numpy; print(numpy.__version__)"
pixi exec ruff check .                     # the package has the command's name
pixi exec --spec gdal ogrinfo --version    # name a different package with --spec
pixi exec --spec nodejs=24 node -e "console.log(1)"
```

## 3. Workspaces (projects in any language)

```sh
pixi init                                  # pixi.toml here; `pixi init --format pyproject` for Python packages
pixi add python=3.12 numpy pandas          # conda-forge, versions pinned in pixi.lock
pixi add --pypi some-package               # PyPI only
pixi task add test "pytest -q"             # then: pixi run test
pixi task add lint "ruff check ." --description "Lint"
pixi run python main.py                    # any command inside the environment
pixi run --locked test                     # exact lock (CI)
pixi list / pixi tree <pkg>                # what is installed / why
pixi update [pkg]                          # newer versions within the constraints
pixi upgrade [pkg]                         # bump the constraints themselves
pixi workspace platform add linux-64 osx-arm64 linux-aarch64   # lock for every OS the team uses
```

`pixi.toml` you can edit directly (run `pixi install` or any `pixi run` afterwards; the lock updates):

```toml
[workspace]
name = "proj"
channels = ["conda-forge"]
platforms = ["osx-arm64", "linux-64"]

[dependencies]
python = "3.12.*"
numpy = ">=2"

[pypi-dependencies]
proj = { path = ".", editable = true }     # the project's own package

[tasks]
build = "cmake --build build"
test = { cmd = "pytest -q", depends-on = ["build"] }
serve = { cmd = "python -m http.server $PORT", env = { PORT = "8000" } }

[feature.dev.dependencies]
pytest = "*"
ruff = "*"

[environments]
default = ["dev"]
```

Several environments (CPU/GPU, Python versions, docs): put dependencies under `[feature.<name>.dependencies]`,
list `[environments] <env> = ["<feature>", …]`, run with `pixi run -e <env> …`. A feature can only narrow what the
default `[dependencies]` allow, never widen it: for several Python versions keep `python = ">=3.11"` in
`[dependencies]`, put `python = "3.11.*"` / `"3.12.*"` in features `py311` / `py312`, and use
`[environments] default = ["py312"]`, `py311 = ["py311"]`; then `pixi run -e py311 test`.

### Non-Python toolchains (all from conda-forge)

| Language | `pixi add` | Notes |
|---|---|---|
| C / C++ | `cxx-compiler c-compiler cmake ninja pkg-config` | libraries too: `fmt eigen boost opencv` |
| Rust | `rust` | `pixi run cargo build --release`; C deps (`openssl`, `pkg-config`) from conda-forge |
| Go | `go` | `pixi run go build ./...` |
| Node / TypeScript | `nodejs` (`pnpm`, `yarn`) | `pixi run npm ci`; npm keeps its own lock |
| R | `r-base r-tidyverse` | R packages are `r-<name>` |
| Julia | `julia` | packages via Julia's own Pkg |
| Java / Kotlin | `openjdk maven` / `gradle` | |
| Fortran | `fortran-compiler` | |
| CUDA | `cuda-nvcc cuda-cudart-dev` (or `cuda-toolkit`) | add `[system-requirements] cuda = "12"`; see PyTorch below |

C++ with CMake, as tasks:

```toml
[dependencies]
cxx-compiler = "*"
cmake = "*"
ninja = "*"
fmt = "*"

[tasks]
configure = "cmake -G Ninja -S . -B build -DCMAKE_BUILD_TYPE=Release"
build = { cmd = "cmake --build build", depends-on = ["configure"] }
start = { cmd = "./build/app", depends-on = ["build"] }
```

Inside `pixi run`, `$CONDA_PREFIX` is the environment, and CMake/pkg-config find its libraries automatically.

### PyTorch / CUDA

```toml
[workspace]
channels = ["conda-forge"]
platforms = ["linux-64", "osx-arm64"]

[system-requirements]
cuda = "12"                                # the driver must support this CUDA version

[dependencies]
python = "3.12.*"
pytorch-gpu = "*"                          # linux-64; use `pytorch` on macOS (MPS)

[target.osx-arm64.dependencies]
pytorch = "*"
```

CPU and GPU side by side: features `cpu` (`pytorch-cpu`) and `cuda` (`pytorch-gpu` + system-requirements), two
environments. Details: `pixi_docs page=python/pytorch.md`.

## Converting (only when asked)

- `requirements.txt`: `pixi init`, then `pixi add` each package (conda-forge names; `--pypi` for the rest), or
  `pixi init --format pyproject` if there is a `pyproject.toml` already.
- `environment.yml`: `pixi init --import environment.yml`.
- uv / poetry projects: `pixi init --format pyproject` keeps `[project]` dependencies and adds `[tool.pixi]`;
  see `pixi_docs page=switching_from/uv.md` (or `poetry.md`, `conda.md`).
- Replace `pip install -r … && python app.py` instructions with tasks (`pixi run start`).

## CI and Docker

- GitHub Actions: `prefix-dev/setup-pixi@v0` (with `cache: true`), then `pixi run --locked test`.
- Docker: base image `ghcr.io/prefix-dev/pixi`, `pixi install --locked` in a build stage, copy `.pixi/envs/default`
  into the runtime image. See `pixi_docs page=deployment/container.md`.

## Troubleshooting

- "lock file not up to date": `pixi install` (or `pixi lock`) and commit `pixi.lock`; `--locked` failed on purpose.
- Package not found: `pixi search <name>`; not on conda-forge → `pixi add --pypi <name>`.
- "unsupported platform" in the lock: `pixi workspace platform add <platform>`.
- A conda and a PyPI package clash: prefer the conda one; avoid installing the same library from both.
- Activation for a shell session: `eval "$(pixi shell-hook)"` (scripts/CI) or `pixi shell` (interactive).
- Disk: `pixi clean` (this workspace's environments), `pixi clean cache` (download cache).
