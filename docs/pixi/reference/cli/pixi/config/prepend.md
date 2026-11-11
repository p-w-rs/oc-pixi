# [pixi](../index.md) [config](index.md) prepend

Prepend a value to a list configuration key

## Usage
```
pixi config prepend [OPTIONS] <KEY> <VALUE>
```

## Arguments
- <a id="arg-KEY" href="#arg-KEY">`<KEY>`</a>
:  Configuration key to set

- <a id="arg-VALUE" href="#arg-VALUE">`<VALUE>`</a>
:  Configuration value to (pre|ap)pend

## Config Options
- <a id="arg---local" href="#arg---local">`--local (-l)`</a>
:  Operation on project-local configuration
- <a id="arg---global" href="#arg---global">`--global (-g)`</a>
:  Operation on global configuration
- <a id="arg---system" href="#arg---system">`--system (-s)`</a>
:  Operation on system configuration

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace

## Description
Prepend a value to a list configuration key

Example: `pixi config prepend default-channels bioconda`

## Examples

```shell
pixi config prepend default-channels conda-forge
```
