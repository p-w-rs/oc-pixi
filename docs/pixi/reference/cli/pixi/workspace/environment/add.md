# [pixi](../../index.md) [workspace](../index.md) [environment](index.md) add

Adds an environment to the manifest file

## Usage
```
pixi workspace environment add [OPTIONS] <NAME>
```

## Arguments
- <a id="arg-NAME" href="#arg-NAME">`<NAME>`</a>
:  The name of the environment to add

## Options
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  Features to add to the environment

- <a id="arg---solve-group" href="#arg---solve-group">`--solve-group <SOLVE_GROUP>`</a>
:  The solve-group to add the environment to
- <a id="arg---no-default-feature" href="#arg---no-default-feature">`--no-default-feature`</a>
:  Don't include the default feature in the environment

- <a id="arg---force" href="#arg---force">`--force`</a>
:  Update the manifest even if the environment already exists
