---
name: pixi
description: Use Pixi (pixi.sh) for every environment — standalone scripts with inline dependencies (Python, and R/C/C++/Rust/shell via conda-script), Pixi workspaces for Python and non-Python projects (C/C++, Rust, Go, Node, R, CUDA, ROS), tasks, features and multiple environments, PyPI + conda-forge packages, PyTorch/CUDA, CI and Docker, converting from pip/uv/poetry/conda. Load before running Python, installing a package, or setting up any project's toolchain.
---

# Working with Pixi

Pixi gives every script and project its own locked, reproducible environment from conda-forge (and PyPI), without
touching the system. One tool replaces `pip`, `venv`, `uv`, `poetry`, `conda`/`mamba`, `pyenv` and most
Homebrew/apt installs of compilers and runtimes. Written for Pixi 0.81 (`pixi --version`); the full official
documentation for it is bundled: `pixi_docs query=…`. When this skill and the docs disagree, the docs win.

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
- Commit `pixi.toml`/`pyproject.toml` **and** `pixi.lock`; `.pixi/` stays out of git (`pixi init` writes
  `.gitignore` and `.gitattributes` for that).
- Reproduce exactly with `--locked` (fails if the lock is stale) or `--frozen` (uses the lock as is, never
  re-solves) — always one of them in CI and Docker.
- Existing projects on another tool (uv, poetry, requirements.txt, conda): don't convert unless the user asks;
  run them as documented, or with `pixi exec`. New scripts you write still use Pixi.
- Never install anything globally (`pixi global install`) unless the user asks.

## 1. Standalone scripts

Python (PEP 723 metadata, written by Pixi):

```sh
pixi init --script analyze.py              # adds the metadata block (works on an existing file too)
pixi add --script analyze.py pandas matplotlib   # conda-forge  (pixi remove --script … to drop)
pixi add --script analyze.py --pypi rich   # PyPI
pixi run --script analyze.py data.csv      # solves once, caches the environment, runs
```

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["rich"]                  # PyPI
#
# [tool.pixi.dependencies]
# pandas = "*"                             # conda-forge (the default channel)
# ///
```
`pixi init --script f.py -c <channel>` adds a `[tool.pixi.workspace] channels = […]` table for other channels.

- Executable: first line `#!/usr/bin/env -S pixi run --script`, then `chmod +x analyze.py`; `./analyze.py` works.
- `pixi lock --script f.py` writes `f.py.pixi.lock` next to it; later runs use it (`--locked`/`--frozen` work).
  To lock for other OSes too: `pixi workspace platform add --script f.py linux-64 osx-arm64` first.
- `pixi update --script f.py` refreshes versions (runs otherwise reuse the cached resolution);
  `pixi install --script f.py` installs without running (container builds, before going offline);
  `pixi tree --script f.py` shows why a package is there.
- A script that `uv run` could run already has PEP 723 metadata: `pixi run --script` runs it as-is (also from a
  URL or `-` for stdin; remote scripts execute with your permissions, so read them first).
- Arguments starting with `-` go after `--`: `pixi run --script f.py -- --verbose`.

Other languages, in one file (**conda-script**, experimental: pass `--experimental` to `pixi run` or set
`pixi config set experimental.conda-script true --global` once). `pixi init --script main.R` (or `.cpp`, `.c`,
`.sh`, `.f90`, …) writes a starter block from the extension; the block uses the file's line-comment syntax:

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

Run with `pixi run --experimental --script main.R`. `${SCRIPT}` is the file, `${CACHE}` a persistent per-script
build folder. The entrypoint runs in Pixi's own small shell: `&&`, quotes, `${VAR}` and `$(cmd)` work; pipes,
redirects, `;`, `||` and globs do not (put those in the script). Shell scripts: `pixi init --script` defaults to
the `brush` shell; for bash use `entrypoint = "bash ${SCRIPT}"` with `bash` and the tools it needs (`jq`, `ffmpeg`,
`gdal`) as dependencies. `pixi add --script main.R r-ggplot2` edits the block. More languages (C, Fortran, Mojo,
C#, Kotlin, TypeScript/Deno): `pixi_docs page=tutorials/conda_script.md`.

## 2. One-off commands

```sh
pixi exec --spec python=3.12 --spec numpy python -c "import numpy; print(numpy.__version__)"
pixi exec ruff check .                     # the package has the command's name
pixi exec --spec gdal ogrinfo --version    # name a different package with --spec
pixi exec --with pytest-cov pytest         # guessed package (pytest) plus extras
pixi exec --spec nodejs=24 node -e "console.log(1)"
```

## 3. Workspaces (projects in any language)

```sh
pixi init                                  # pixi.toml here; `pixi init --format pyproject` for Python packages
pixi add python=3.12 numpy pandas          # conda-forge, versions pinned in pixi.lock
pixi add --pypi some-package               # PyPI only
pixi add -f dev pytest ruff                # into feature `dev`;  -e test pytest → inline on environment `test`
pixi task add test "pytest -q" --depends-on build   # then: pixi run test
pixi task add lint "ruff check ." --description "Lint"
pixi run python main.py                    # any command inside the environment
pixi run --locked test                     # exact lock (CI)
pixi list / pixi tree <pkg>                # what is installed / why
pixi update [pkg]                          # newer versions within the constraints (lock only)
pixi upgrade [pkg]                         # bump the constraints in the manifest too
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
proj = { path = ".", editable = true }     # the project's own package (needs [build-system] in pyproject.toml)

[tasks]
build = "cmake --build build"
test = { cmd = "pytest -q", depends-on = ["build"] }
serve = { cmd = "python -m http.server $PORT", env = { PORT = "8000" } }

[environments.dev.dependencies]            # deps that belong to one environment: define them on it directly
pytest = "*"
ruff = "*"
```

Run in a named environment with `pixi run -e dev …`. Use **features** only for content shared by several
environments: `[feature.<name>.dependencies]` plus `[environments] <env> = ["<feature>", …]` (the default
feature, i.e. top-level `[dependencies]`, is always included unless `no-default-feature = true`). A feature can
only narrow what the default `[dependencies]` allow, never widen it (specs are combined, conflicts fail the
solve): for several Python versions keep `python = ">=3.11"` in `[dependencies]`, put `python = "3.11.*"` /
`"3.12.*"` in features `py311` / `py312`, and use `[environments] default = ["py312"]`, `py311 = ["py311"]`; then
`pixi run -e py311 test`. Environments that must share versions (prod vs test): same `solve-group`.

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
| CUDA | `cuda-nvcc cuda-cudart-dev` (or `cuda-toolkit`) + `cuda-version = "<major.minor>.*"` | declare CUDA on the platform; see below |

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

CUDA availability is declared **on the platform** (`[system-requirements]` is deprecated since the rich-platform
syntax; still parsed, but don't write it). Without it Pixi solves the CPU-only builds.

```toml
[workspace]
channels = ["conda-forge"]
platforms = [
  { name = "linux-64-cuda", platform = "linux-64", cuda = "12" },   # listed first: picked when a driver is present
  { name = "linux-64-cpu", platform = "linux-64" },
  "osx-arm64",
]

[dependencies]
python = "3.12.*"

[target.linux-64-cuda.dependencies]
pytorch-gpu = "*"

[target.linux-64-cpu.dependencies]
pytorch-cpu = "*"

[target.osx-arm64.dependencies]
pytorch = "*"                              # MPS
```

- `cuda = "12"` must not exceed what the driver supports (`nvidia-smi`). Pin `cuda-version = "12.9.*"` only if
  you must: an older pin silently selects much older PyTorch builds (check `pixi list pytorch` after locking;
  Nov 2026, driver 13.0: unpinned → 2.14.1 `cuda134`, `cuda-version = "13.0.*"` → 2.13.0 `cuda130`). Builds for a
  newer CUDA minor than the driver run, but PTX-JIT code may fail ("unsupported toolchain"). Blackwell sm_120 is included.
- `pixi add cuda-cudart-dev` writes the newest pin (`>=13.5.37,<14`), which conflicts with a feature that pins an
  older `cuda-version`; write `"*"` for CUDA packages and let `cuda-version` choose.
- `torch.compile` on the GPU also needs `cuda-cudart-dev` (Triton builds a helper against `cuda.h`) and a C compiler
  (system `gcc` or `c-compiler`); without it compile fails with `cuda.h: No such file or directory`.
- One environment, solved per platform; give both linux variants a name (a bare `linux-64` target would match
  the CUDA platform too). Try a variant: `pixi run --platform linux-64-cpu python -c "import torch"`.
- CLI: `pixi workspace platform add linux-64-cuda=linux-64 --cuda 12` (a name is required with virtual packages);
  `pixi workspace platform list` shows what this machine is detected as.
- Only a GPU environment, separate from the default: `[feature.gpu] platforms = ["linux-64-cuda"]` +
  `[environments] gpu = ["gpu"]`.
- Solving/installing on a machine without a GPU (CI): `CONDA_OVERRIDE_CUDA=12.8 pixi install --locked`.
- PyTorch wheels from download.pytorch.org instead: `torch = { version = "*", index = "https://download.pytorch.org/whl/cu128" }`
  in `[pypi-dependencies]`, and then torch-dependent packages from PyPI too. Details: `pixi_docs page=python/pytorch.md`.

## Converting (only when asked)

- `requirements.txt`: in a workspace, `pixi import --format pypi-txt -f reqs -e default requirements.txt`
  (as PyPI deps in feature `reqs`, added to the default environment); better: `pixi add` each package from
  conda-forge where it exists, `--pypi` for the rest.
- `environment.yml`: `pixi init --import environment.yml` (its `pip:` section becomes `[pypi-dependencies]`).
- uv / poetry projects: `pixi init --format pyproject` in the project keeps `[project]` dependencies, adds
  `[tool.pixi]` and turns dependency groups/extras into environments (`pixi run -e dev pytest`); see
  `pixi_docs page=switching_from/uv.md` (or `poetry.md`, `conda.md`).
- Replace `pip install -r … && python app.py` instructions with tasks (`pixi run start`).

## CI and Docker

- GitHub Actions: pin the action and Pixi exactly (both are pre-1.0; let Dependabot bump them):
  ```yaml
  - uses: prefix-dev/setup-pixi@v0.11.3      # check github.com/prefix-dev/setup-pixi/releases for the latest
    with:
      pixi-version: v0.81.0
      cache: true
      environments: default                  # several: "py311 py312"
  - run: pixi run --locked test
  ```
  The action runs `pixi install --locked` when `pixi.lock` exists.
- Docker: build stage `FROM ghcr.io/prefix-dev/pixi:0.81.0` (tags also `noble-cuda-13.0.0` etc.), then
  `pixi install --locked -e prod` and `pixi shell-hook -e prod -s bash > /shell-hook` turned into an entrypoint
  script; copy `/app/.pixi/envs/prod` to the **same path** in a plain runtime image (the prefix must not move).
  Full Dockerfile: `pixi_docs page=deployment/container.md`. Offline/air-gapped targets: `pixi-pack`
  (`pixi_docs page=deployment/pixi_pack.md`).

## Troubleshooting

- "lock file not up to date": `pixi install` (or `pixi lock`) and commit `pixi.lock`; `--locked` failed on purpose.
- Package not found: `pixi search <name>`; not on conda-forge → `pixi add --pypi <name>`.
- "unsupported platform" in the lock: `pixi workspace platform add <platform>`.
- Solve conflict in an environment: a feature (or `-e` content) asks for something the default `[dependencies]`
  exclude; loosen the default spec. `pixi tree -e <env> <pkg>` shows who wants what.
- A conda and a PyPI package clash: prefer the conda one; avoid installing the same library from both.
- Activation for a shell session: `eval "$(pixi shell-hook)"` (scripts/CI) or `pixi shell` (interactive).
- Disk: `pixi clean` (this workspace's environments), `pixi clean cache` (download cache).
