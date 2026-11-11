# [pixi](../index.md) [config](index.md) edit

Edit the configuration file

## Usage
```
pixi config edit [OPTIONS] [EDITOR]
```

## Arguments
- <a id="arg-EDITOR" href="#arg-EDITOR">`<EDITOR>`</a>
:  The editor to use, defaults to `EDITOR` environment variable or `nano` on Unix and `notepad` on Windows

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

## Examples

```shell
pixi config edit --system
pixi config edit --local
pixi config edit -g
pixi config edit --global code
pixi config edit --system vim
```
