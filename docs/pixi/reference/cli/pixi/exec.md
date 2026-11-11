# [pixi](index.md) exec

Run a command and install it in a temporary environment

## Usage
```
pixi exec [OPTIONS] [COMMAND]...
```

## Arguments
- <a id="arg-COMMAND" href="#arg-COMMAND">`<COMMAND>`</a>
:  The executable to run, followed by any arguments

## Options
- <a id="arg---spec" href="#arg---spec">`--spec (-s) <SPEC>`</a>
:  Matchspecs of package to install. If this is not provided, the package is guessed from the command

- <a id="arg---with" href="#arg---with">`--with (-w) <WITH>`</a>
:  Matchspecs of package to install, while also guessing a package from the command

- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNEL>`</a>
:  The channels to consider as a name or a url. Multiple channels can be specified by using this field multiple times

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <SUBDIR>`</a>
:  The platform to create the environment for. Defaults to the current machine's subdir. Accepts a workspace platform name or a bare conda subdir (e.g. `linux-64`); `pixi exec` runs outside any workspace so the value resolves to a conda subdir either way
- <a id="arg---force-reinstall" href="#arg---force-reinstall">`--force-reinstall`</a>
:  If specified a new environment is always created even if one already exists
- <a id="arg---list" href="#arg---list">`--list=<LIST>`</a>
:  Before executing the command, list packages in the environment Specify `--list=some_regex` to filter the shown packages
- <a id="arg---no-modify-ps1" href="#arg---no-modify-ps1">`--no-modify-ps1`</a>
:  Disable modification of the PS1 prompt to indicate the temporary environment

## Config Options
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

## Description
Run a command and install it in a temporary environment.

Remove the temporary environments with `pixi clean cache --exec`.

## Examples

```shell
pixi exec python

# Run ipython and include the py-rattler and numpy packages in the environment
pixi exec --with py-rattler --with numpy ipython

# Specify the specs of the environment
pixi exec --spec python=3.9 --spec numpy python

# Install a specific conda package to temporary environment
pixi exec --spec "$(pwd)/numpy-2.3.4-py314h2b28147_0.conda" -- python
pixi exec --spec https://prefix.dev/conda-forge/noarch/polars-1.35.1-pyh6a1acc5_0.conda -- python

# Force reinstall to recreate the environment and get the latest package versions
pixi exec --force-reinstall --with py-rattler ipython
```
