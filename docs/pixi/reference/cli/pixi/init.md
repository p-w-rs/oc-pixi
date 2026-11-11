# [pixi](index.md) init

Creates a new workspace or script

!!! info "Importing an environment.yml"
    When importing an environment, the `pixi.toml` will be created with the dependencies from the environment file.
    The `pixi.lock` will be created when you install the environment.
    We don't support `git+` urls as dependencies for pip packages and for the `defaults` channel we use `main`, `r` and `msys2` as the default channels.

## Usage
```
pixi init [OPTIONS] [PATH]
```

## Arguments
- <a id="arg-PATH" href="#arg-PATH">`<PATH>`</a>
:  Where to place the workspace (defaults to the current path)

## Options
- <a id="arg---script" href="#arg---script">`--script (-s) <PATH>`</a>
:  Create a metadata block in a script instead of a workspace
- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNEL>`</a>
:  Channel to use in the workspace

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <NEW_PLATFORM>`</a>
:  Platforms that the workspace supports

- <a id="arg---import" href="#arg---import">`--import (-i) <ENVIRONMENT_FILE>`</a>
:  Environment.yml file to bootstrap the workspace
- <a id="arg---format" href="#arg---format">`--format <FORMAT>`</a>
:  The manifest format to create

- <a id="arg---scm" href="#arg---scm">`--scm <SCM>`</a>
:  Source Control Management used for this workspace

- <a id="arg---conda-pypi-map" href="#arg---conda-pypi-map">`--conda-pypi-map <CONDA_PYPI_MAP>`</a>
:  Set conda↔PyPI mapping configuration

## Description
Creates a new workspace or script

The positional path starts a workspace, while `--script` writes a metadata block into a single file: a PEP 723 block for a Python file, a `conda-script` block for every other known extension. `--format` overrides that default.

As pixi can both work with `pixi.toml` and `pyproject.toml` files, the user can choose which one to use with `--format`.

You can import an existing conda environment file with the `--import` flag.

## Examples

```shell
pixi init myproject  # (1)!
pixi init ~/myproject  # (2)!
pixi init  # (3)!
pixi init --channel conda-forge --channel bioconda myproject  # (4)!
pixi init --platform osx-64 --platform linux-64 myproject  # (5)!
pixi init --import environment.yml  # (6)!
pixi init --format pyproject  # (7)!
pixi init --format pixi --scm gitlab  # (8)!
```

1. Initializes a new project in the `myproject` directory, relative to the current directory.
2. Initializes a new project in the `~/myproject` directory, absolute path.
3. Initializes a new project in the current directory.
4. Initializes a new project with the specified channels.
5. Initializes a new project with the specified platforms.
6. Initializes a new project with the `dependencies` and `channels` from the `environment.yml` file.
7. Initializes a new project with the `pyproject.toml` format.
8. Initializes a new project with the `pixi.toml` format and the `gitlab` SCM.
