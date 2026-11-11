# [pixi](../../index.md) [workspace](../index.md) [dependencies](index.md) remove

Remove dependencies from the `[workspace.dependencies]` table

## Usage
```
pixi workspace dependencies remove <PACKAGE>...
```

## Arguments
- <a id="arg-PACKAGE" href="#arg-PACKAGE">`<PACKAGE>`</a>
:  The dependency names to remove from `[workspace.dependencies]`

## Examples

```shell
pixi workspace dependencies remove numpy
pixi workspace dependencies rm numpy boltons
```
