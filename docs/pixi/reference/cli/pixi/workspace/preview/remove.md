# [pixi](../../index.md) [workspace](../index.md) [preview](index.md) remove

Remove preview flag(s) from the workspace

## Usage
```
pixi workspace preview remove [OPTIONS] <PREVIEW_FLAG>...
```

## Arguments
- <a id="arg-PREVIEW_FLAG" href="#arg-PREVIEW_FLAG">`<PREVIEW_FLAG>`</a>
:  The preview flag(s) to add or remove, e.g. `pixi-build`

## Options
- <a id="arg---force" href="#arg---force">`--force`</a>
:  Remove the flag(s) even when the manifest no longer loads without them

## Description
Remove preview flag(s) from the workspace.

Example: `pixi workspace preview remove pixi-build`
