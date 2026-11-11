# [pixi](../index.md) [config](index.md) set

Set a configuration value

## Usage
```
pixi config set [OPTIONS] <KEY> [VALUE]
```

## Arguments
- <a id="arg-KEY" href="#arg-KEY">`<KEY>`</a>
:  Configuration key to set

- <a id="arg-VALUE" href="#arg-VALUE">`<VALUE>`</a>
:  Configuration value to set (key will be unset if value not provided)

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
Set a configuration value

Example: `pixi config set default-channels '["conda-forge", "bioconda"]'`

## Examples

```shell
pixi config set default-channels '["conda-forge", "bioconda"]'
pixi config set --global mirrors '{"https://conda.anaconda.org/conda-forge": ["https://prefix.dev/conda-forge"]}'
pixi config set repodata-config.disable-zstd true --system
pixi config set --global detached-environments "/opt/pixi/envs"
pixi config set detached-environments false
pixi config set s3-options.my-bucket '{"endpoint-url": "http://localhost:9000", "force-path-style": true, "region": "auto"}'
```
