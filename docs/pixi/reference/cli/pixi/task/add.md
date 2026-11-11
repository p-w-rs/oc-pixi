# [pixi](../index.md) [task](index.md) add

Add a command to the workspace

## Usage
```
pixi task add [OPTIONS] <NAME> <COMMAND>...
```

## Arguments
- <a id="arg-NAME" href="#arg-NAME">`<NAME>`</a>
:  Task name

- <a id="arg-COMMAND" href="#arg-COMMAND">`<COMMAND>`</a>
:  One or more commands to actually execute

## Options
- <a id="arg---depends-on" href="#arg---depends-on">`--depends-on <TASK>`</a>
:  Depends on these other commands

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform for which the task should be added
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <FEATURE>`</a>
:  The feature for which the task should be added
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment for which the task should be added. The task is written to the tasks defined inline on the environment, creating the environment if it does not exist
- <a id="arg---cwd" href="#arg---cwd">`--cwd <CWD>`</a>
:  The working directory relative to the root of the workspace
- <a id="arg---env" href="#arg---env">`--env <ENV>`</a>
:  The environment variable to set, use --env key=value multiple times for more than one variable

- <a id="arg---default-environment" href="#arg---default-environment">`--default-environment <ENVIRONMENT>`</a>
:  Add a default environment for the task
- <a id="arg---description" href="#arg---description">`--description <DESCRIPTION>`</a>
:  A description of the task to be added
- <a id="arg---clean-env" href="#arg---clean-env">`--clean-env`</a>
:  Isolate the task from the shell environment, and only use the pixi environment to run the task
- <a id="arg---arg" href="#arg---arg">`--arg <ARGS>`</a>
:  The arguments to pass to the task

## Examples

```shell
pixi task add cow cowpy "Hello User"
pixi task add tls ls --cwd tests
pixi task add test cargo t --depends-on build
pixi task add build-osx "METAL=1 cargo build" --platform osx-64
pixi task add train python train.py --feature cuda
pixi task add serve "python serve.py" --environment dev
pixi task add publish-pypi "hatch publish --yes --repo main" --feature build --env HATCH_CONFIG=config/hatch.toml --description "Publish the package to pypi"
```

This adds the following to the [manifest file](../../../pixi_manifest.md):

```toml
[tasks]
cow = "cowpy \"Hello User\""
tls = { cmd = "ls", cwd = "tests" }
test = { cmd = "cargo t", depends-on = ["build"] }

[target.osx-64.tasks]
build-osx = "METAL=1 cargo build"

[feature.cuda.tasks]
train = "python train.py"

[environments.dev.tasks]
serve = "python serve.py"

[feature.build.tasks]
publish-pypi = { cmd = "hatch publish --yes --repo main", env = { HATCH_CONFIG = "config/hatch.toml" }, description = "Publish the package to pypi" }
```

Which you can then run with the `run` command:

```shell
pixi run cow
# Extra arguments will be passed to the tasks command.
pixi run test --test test1
```
