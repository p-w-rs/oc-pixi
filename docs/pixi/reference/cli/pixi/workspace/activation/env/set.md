# [pixi](../../../index.md) [workspace](../../index.md) [activation](../index.md) [env](index.md) set

Set (add or overwrite) activation environment variable(s)

## Usage
```
pixi workspace activation env set [OPTIONS] <KEY=VALUE>...
```

## Arguments
- <a id="arg-KEY=VALUE" href="#arg-KEY=VALUE">`<KEY=VALUE>`</a>
:  The environment variable(s) to set, as `KEY=VALUE` pairs

## Options
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  The name of the feature to modify
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment to modify. The activation is written to the content defined inline on the environment
- <a id="arg---target" href="#arg---target">`--target (-t) <TARGET>`</a>
:  The target selector to modify, e.g. `linux-64`, `unix` or a glob like `cuda-*`
