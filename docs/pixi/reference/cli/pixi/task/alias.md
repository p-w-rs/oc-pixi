# [pixi](../index.md) [task](index.md) alias

Alias another specific command

## Usage
```
pixi task alias [OPTIONS] <ALIAS> <DEPENDS_ON>...
```

## Arguments
- <a id="arg-ALIAS" href="#arg-ALIAS">`<ALIAS>`</a>
:  Alias name

- <a id="arg-DEPENDS_ON" href="#arg-DEPENDS_ON">`<DEPENDS_ON>`</a>
:  Depends on these tasks to execute

## Options
- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform for which the alias should be added
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment for which the alias should be added. The alias is written to the tasks defined inline on the environment, creating the environment if it does not exist
- <a id="arg---description" href="#arg---description">`--description <DESCRIPTION>`</a>
:  The description of the alias task

## Examples

```shell
pixi task alias test-all test-py test-cpp test-rust
pixi task alias --platform linux-64 test test-linux
pixi task alias moo cow
pixi task alias --environment dev moo cow
```
