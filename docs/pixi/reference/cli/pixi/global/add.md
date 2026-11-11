# [pixi](../index.md) [global](index.md) add

Adds dependencies to an environment

## Usage
```
pixi global add [OPTIONS] --environment <ENVIRONMENT> [PACKAGE]...
```

## Arguments
- <a id="arg-PACKAGE" href="#arg-PACKAGE">`<PACKAGE>`</a>
:  The dependency as names, conda MatchSpecs

## Options
- <a id="arg---path" href="#arg---path">`--path <PATH>`</a>
:  The path to the local package
- <a id="arg---build-backend" href="#arg---build-backend">`--build-backend <BUILD_BACKEND>`</a>
:  The build backend to build the source with, when the source does not provide its own package manifest (or to override the one it has). Accepts a name with an optional version constraint, e.g. `pixi-build-rust` or `"pixi-build-rust>=0.3,<0.4"`
- <a id="arg---package" href="#arg---package">`--package <KEY=VALUE>`</a>
:  Additional fields of the inline package definition, as `DOTTED_KEY=TOML_VALUE` pairs that are recorded under the `package` key of the dependency, e.g. `host-dependencies.hatchling="*"` or `build.config.extra-args=["--all-features"]`

- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  Specifies the environment that the dependencies need to be added to

- <a id="arg---expose" href="#arg---expose">`--expose <EXPOSE>`</a>
:  Add one or more mapping which describe which executables are exposed. The syntax is `exposed_name=executable_name`, so for example `python3.10=python`. Alternatively, you can input only an executable_name and `executable_name=executable_name` is assumed

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

## Git Options
- <a id="arg---git" href="#arg---git">`--git <GIT>`</a>
:  The git url, e.g. `https://github.com/user/repo.git`
- <a id="arg---branch" href="#arg---branch">`--branch <BRANCH>`</a>
:  The git branch
- <a id="arg---tag" href="#arg---tag">`--tag <TAG>`</a>
:  The git tag
- <a id="arg---rev" href="#arg---rev">`--rev <REV>`</a>
:  The git revision
- <a id="arg---subdirectory" href="#arg---subdirectory">`--subdirectory <SUBDIRECTORY>`</a>
:  The subdirectory within the git repository

## Description
Adds dependencies to an environment

Example:

- `pixi global add --environment python numpy`
- `pixi global add --environment my_env pytest pytest-cov --expose pytest=pytest`

## Examples

```shell
pixi global add python=3.9.* --environment my-env
pixi global add python=3.9.* --expose py39=python3.9 --environment my-env
pixi global add numpy matplotlib --environment my-env
pixi global add numpy matplotlib --expose np=python3.9 --environment my-env
```
