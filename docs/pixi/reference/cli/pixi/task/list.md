# [pixi](../index.md) [task](index.md) list

List all tasks in the workspace

## Usage
```
pixi task list [OPTIONS]
```

## Options
- <a id="arg---summary" href="#arg---summary">`--summary (-s)`</a>
:  Tasks available for this machine per environment
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment the list should be generated for. If not specified, the default environment is used
- <a id="arg---json" href="#arg---json">`--json`</a>
:  List as json instead of a tree If not specified, the default environment is used

## Examples

```shell
pixi task list
pixi task list --environment cuda
pixi task list --summary
```
