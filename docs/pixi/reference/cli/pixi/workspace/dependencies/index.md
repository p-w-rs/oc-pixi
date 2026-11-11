# [pixi](../../index.md) [workspace](../index.md) dependencies

Commands to manage the `[workspace.dependencies]` table

Use this command group to manage the shared `[workspace.dependencies]` pool from the command line. Entries in this pool can be reused from dependency tables with `{ workspace = true }`.

## Usage
```
pixi workspace dependencies [OPTIONS] <COMMAND>
```

## Subcommands
| Command | Description |
|---------|-------------|
| [`add`](add.md) | Add dependencies to the `[workspace.dependencies]` table |
| [`list`](list.md) | List dependencies in the `[workspace.dependencies]` table |
| [`remove`](remove.md) | Remove dependencies from the `[workspace.dependencies]` table |

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
pixi workspace dependencies add numpy
pixi workspace dependencies add "numpy=1.*" boltons
pixi workspace dependencies add shared-lib --path packages/shared-lib
pixi workspace dependencies add shared-lib --git https://github.com/org/shared-lib --tag v1.2.3
pixi workspace dependencies list
pixi workspace dependencies remove numpy
```
