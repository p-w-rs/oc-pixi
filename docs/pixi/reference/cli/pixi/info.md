# [pixi](index.md) info

Information about the system, workspace and environments for the current machine

More information [here](../../../advanced/explain_info_command.md).

## Usage
```
pixi info [OPTIONS]
```

## Options
- <a id="arg---extended" href="#arg---extended">`--extended`</a>
:  Show cache and environment size
- <a id="arg---json" href="#arg---json">`--json`</a>
:  Whether to show the output as JSON or not

## Config Options
- <a id="arg---no-config" href="#arg---no-config">`--no-config`</a>
:  Don't read system or user-level configuration files. Project-local `<project>/.pixi/config.toml` is still loaded

- <a id="arg---config-file" href="#arg---config-file">`--config-file <PATH>`</a>
:  Load configuration from this file instead of searching system and user-level paths. Project-local `<project>/.pixi/config.toml` is still merged on top

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace

## Examples

```shell
pixi info
pixi info --json
pixi info --extended
```
