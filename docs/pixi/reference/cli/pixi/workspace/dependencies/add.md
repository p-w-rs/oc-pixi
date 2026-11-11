# [pixi](../../index.md) [workspace](../index.md) [dependencies](index.md) add

Add dependencies to the `[workspace.dependencies]` table

## Usage
```
pixi workspace dependencies add [OPTIONS] <SPEC>...
```

## Arguments
- <a id="arg-SPEC" href="#arg-SPEC">`<SPEC>`</a>
:  The dependency as names or conda MatchSpecs

## Options
- <a id="arg---path" href="#arg---path">`--path <PATH>`</a>
:  The local path to use when adding a workspace path dependency

## Git Options
- <a id="arg---git" href="#arg---git">`--git (-g) <GIT>`</a>
:  The git url to use when adding a workspace git dependency
- <a id="arg---branch" href="#arg---branch">`--branch <BRANCH>`</a>
:  The git branch
- <a id="arg---tag" href="#arg---tag">`--tag <TAG>`</a>
:  The git tag
- <a id="arg---rev" href="#arg---rev">`--rev <REV>`</a>
:  The git revision
- <a id="arg---subdirectory" href="#arg---subdirectory">`--subdirectory <SUBDIRECTORY>`</a>
:  The subdirectory of the git repository to use

## Examples

```shell
pixi workspace dependencies add numpy # (1)!
pixi workspace dependencies add "numpy=1.*" boltons # (2)!
pixi workspace dependencies add shared-lib --path packages/shared-lib # (3)!
pixi workspace dependencies add shared-lib --path /absolute/path/to/shared-lib # (4)!
pixi workspace dependencies add shared-lib --git https://github.com/org/shared-lib # (5)!
pixi workspace dependencies add shared-lib --git https://github.com/org/shared-lib --branch main --subdirectory recipe # (6)!
pixi workspace dependencies add shared-lib --git https://github.com/org/shared-lib --tag v1.2.3 # (7)!
pixi workspace dependencies add shared-lib --git https://github.com/org/shared-lib --rev e50d4a1 # (8)!
```

1. Add `numpy` with the default spec.
2. Add multiple MatchSpecs to the workspace dependencies.
3. Add a local pixi-build package from a path stored relative to the workspace manifest.
4. Absolute input paths are also stored relative to the workspace manifest.
5. Add a pixi-build source package from a git repository.
6. Select a branch and package subdirectory within the repository.
7. Select a git tag.
8. Select a git revision.
