# [pixi](../../../index.md) [workspace](../../index.md) [activation](../index.md) [script](index.md) remove

Remove activation script(s) from `activation.scripts`

## Usage
```
pixi workspace activation script remove [OPTIONS] <SCRIPT>...
```

## Arguments
- <a id="arg-SCRIPT" href="#arg-SCRIPT">`<SCRIPT>`</a>
:  The activation script path(s), relative to the workspace root

## Options
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  The name of the feature to modify
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment to modify. The activation is written to the content defined inline on the environment
- <a id="arg---target" href="#arg---target">`--target (-t) <TARGET>`</a>
:  The target selector to modify, e.g. `linux-64`, `unix` or a glob like `cuda-*`
