# [pixi](index.md) run

Runs task in the pixi environment

## Usage
```
pixi run [OPTIONS] [TASK]...
```

## Arguments
- <a id="arg-TASK" href="#arg-TASK">`<TASK>`</a>
:  The pixi task or a task shell command you want to run in the workspace's environment, which can be an executable in the environment's PATH

## Options
- <a id="arg---executable" href="#arg---executable">`--executable (-x)`</a>
:  Execute the command as an executable without resolving Pixi tasks
- <a id="arg---experimental" href="#arg---experimental">`--experimental`</a>
:  Enable experimental `--script` features; currently the `conda-script` block
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment to run the task in
- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  Install and run in the environment for the given platform; a warning is printed when it doesn't run on this machine. Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) is also accepted
- <a id="arg---clean-env" href="#arg---clean-env">`--clean-env`</a>
:  Use a clean environment to run the task
- <a id="arg---skip-deps" href="#arg---skip-deps">`--skip-deps`</a>
:  Don't run the dependencies of the task ('depends-on' field in the task definition)
- <a id="arg---templated" href="#arg---templated">`--templated`</a>
:  Enable template rendering for the command arguments
- <a id="arg---dry-run" href="#arg---dry-run">`--dry-run (-n)`</a>
:  Run the task in dry-run mode (only print the command that would run)
- <a id="arg---help" href="#arg---help">`--help`</a>
:

## Config Options
- <a id="arg---no-config" href="#arg---no-config">`--no-config`</a>
:  Don't read system or user-level configuration files. Project-local `<project>/.pixi/config.toml` is still loaded

- <a id="arg---config-file" href="#arg---config-file">`--config-file <PATH>`</a>
:  Load configuration from this file instead of searching system and user-level paths. Project-local `<project>/.pixi/config.toml` is still merged on top

- <a id="arg---auth-file" href="#arg---auth-file">`--auth-file <AUTH_FILE>`</a>
:  Path to the file containing the authentication token
- <a id="arg---concurrent-downloads" href="#arg---concurrent-downloads">`--concurrent-downloads <CONCURRENT_DOWNLOADS>`</a>
:  Max concurrent network requests, default is `50`
- <a id="arg---concurrent-solves" href="#arg---concurrent-solves">`--concurrent-solves <CONCURRENT_SOLVES>`</a>
:  Max concurrent solves, default is the number of CPUs
- <a id="arg---pinning-strategy" href="#arg---pinning-strategy">`--pinning-strategy <PINNING_STRATEGY>`</a>
:  Set pinning strategy

- <a id="arg---pypi-keyring-provider" href="#arg---pypi-keyring-provider">`--pypi-keyring-provider <PYPI_KEYRING_PROVIDER>`</a>
:  Specifies whether to use the keyring to look up credentials for PyPI

- <a id="arg---run-post-link-scripts" href="#arg---run-post-link-scripts">`--run-post-link-scripts`</a>
:  Run post-link scripts (insecure)
- <a id="arg---no-symbolic-links" href="#arg---no-symbolic-links">`--no-symbolic-links`</a>
:  Disallow symbolic links during package installation

- <a id="arg---no-hard-links" href="#arg---no-hard-links">`--no-hard-links`</a>
:  Disallow hard links during package installation

- <a id="arg---no-ref-links" href="#arg---no-ref-links">`--no-ref-links`</a>
:  Disallow ref links (copy-on-write) during package installation

- <a id="arg---tls-no-verify" href="#arg---tls-no-verify">`--tls-no-verify`</a>
:  Do not verify the TLS certificate of the server
- <a id="arg---offline" href="#arg---offline">`--offline=<OFFLINE>`</a>
:  Run without network access, using only cached data. Commands fail if data is missing from the cache. Pass `--offline=false` to override an `offline` setting from the configuration

- <a id="arg---tls-root-certs" href="#arg---tls-root-certs">`--tls-root-certs <TLS_ROOT_CERTS>`</a>
:  Which TLS root certificates to use: 'webpki' (bundled Mozilla roots) or 'system' (system store)

- <a id="arg---use-environment-activation-cache" href="#arg---use-environment-activation-cache">`--use-environment-activation-cache`</a>
:  Use environment activation cache (experimental)
- <a id="arg---force-activate" href="#arg---force-activate">`--force-activate`</a>
:  Do not use the environment activation cache. (default: true except in experimental mode)
- <a id="arg---no-completions" href="#arg---no-completions">`--no-completions`</a>
:  Do not source the autocompletion scripts from the environment

## Update Options
- <a id="arg---no-install" href="#arg---no-install">`--no-install`</a>
:  Don't modify the environment, only modify the lock file

- <a id="arg---frozen" href="#arg---frozen">`--frozen`</a>
:  Install the environment as defined in the lock file, doesn't update lock file if it isn't up-to-date with the manifest file

- <a id="arg---locked" href="#arg---locked">`--locked`</a>
:  Check if lock file is up-to-date before installing the environment, aborts when lock file isn't up-to-date with the manifest file

- <a id="arg---as-is" href="#arg---as-is">`--as-is`</a>
:  Shorthand for the combination of --no-install and --frozen

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace
- <a id="arg---script" href="#arg---script">`--script (-s) <SCRIPT>`</a>
:  The path to a script with an embedded manifest: a Python script containing PEP 723 metadata, or a file of any language containing a `/// conda-script` block

## Description
Runs task in the pixi environment.

This command is used to run tasks in the pixi environment. It will activate the environment and run the task in the environment. It is using the deno_task_shell to run the task.

`pixi run` will also update the lock file and install the environment if it is required.

## Examples

```shell
pixi run python
pixi run cowpy "Hey pixi user"
pixi run --manifest-path ~/myworkspace/pixi.toml python
pixi run --frozen python
pixi run --locked python
# If you have specified a custom task in the pixi.toml you can run it with run as well
pixi run build
# Extra arguments will be passed to the tasks command.
pixi run task argument1 argument2
# Use `--` to pass extra arguments directly to the underlying command,
# even when the task defines typed `args`.
pixi run task typed-arg-value -- --extra-flag --other=value
# Skip dependencies of the task
pixi run --skip-deps task
# Run in dry-run mode to see the commands that would be run
pixi run --dry-run task

# If you have multiple environments you can select the right one with the --environment flag.
pixi run --environment cuda python

# THIS DOESN'T WORK ON WINDOWS
# If you want to run a command in a clean environment you can use the --clean-env flag.
# The PATH should only contain the pixi environment here.
pixi run --clean-env "echo \$PATH"

# By default, CLI commands are not processed by the template engine.
# Use --templated to enable template rendering for ad-hoc commands.
pixi run --templated echo '{{ pixi.platform }}'

```

## Notes
!!! info
    In `pixi` the [`deno_task_shell`](https://deno.land/manual@v1.35.0/tools/task_runner#task-runner) is the underlying runner of the run command.
    Checkout their [documentation](https://deno.land/manual@v1.35.0/tools/task_runner#task-runner) for the syntax and available commands.
    This is done so that the run commands can be run across all platforms.

!!! tip "Cross environment tasks"
    If you're using the `depends-on` feature of the `tasks`, the tasks will be run in the order you specified them.
    The `depends-on` can be used cross environment, e.g. you have this `pixi.toml`:
    ??? "pixi.toml"
        ```toml
        [tasks]
        start = { cmd = "python start.py", depends-on = ["build"] }

        [feature.build.tasks]
        build = "cargo build"
        [feature.build.dependencies]
        rust = ">=1.74"

        [environments]
        build = ["build"]
        ```

        Then you're able to run the `build` from the `build` environment and `start` from the default environment.
        By only calling:
        ```shell
        pixi run start
        ```
