# [pixi](../index.md) [task](index.md) remove

Remove a command from the workspace

## Usage
```
pixi task remove [OPTIONS] [TASK_NAME]...
```

## Arguments
- <a id="arg-TASK_NAME" href="#arg-TASK_NAME">`<TASK_NAME>`</a>
:  Task name to remove

## Options
- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform for which the task should be removed
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  The feature for which the task should be removed
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment for which the task should be removed. The task is removed from the tasks defined inline on the environment

## Examples

```shell
pixi task remove cow
pixi task remove --platform linux-64 test
pixi task remove --feature cuda task
```
