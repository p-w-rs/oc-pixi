# [pixi](../index.md) [config](index.md) unset

Unset a configuration value

## Usage
```
pixi config unset [OPTIONS] <KEY>
```

## Arguments
- <a id="arg-KEY" href="#arg-KEY">`<KEY>`</a>
:  Configuration key to unset

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
Unset a configuration value

Example: `pixi config unset default-channels`

## Examples

```shell
pixi config unset default-channels
pixi config unset --global mirrors
pixi config unset repodata-config.disable-zstd --system
```
