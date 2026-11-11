# [pixi](../../index.md) [workspace](../index.md) [platform](index.md) remove

Remove platform(s) from the workspace file and updates the lock file

## Usage
```
pixi workspace platform remove [OPTIONS] <PLATFORM>...
```

## Arguments
- <a id="arg-PLATFORM" href="#arg-PLATFORM">`<PLATFORM>`</a>
:  The platform name(s) to remove

## Options
- <a id="arg---no-install" href="#arg---no-install">`--no-install`</a>
:  Don't update the environment, only remove the platform(s) from the lock file

- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  The name of the feature to remove the platform from
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment to remove the platform from. The platform is removed from the platforms defined inline on the environment
