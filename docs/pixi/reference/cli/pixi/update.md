# [pixi](index.md) update

Updates dependencies to newer compatible versions

## Usage
```
pixi update [OPTIONS] [PACKAGES]...
```

## Arguments
- <a id="arg-PACKAGES" href="#arg-PACKAGES">`<PACKAGES>`</a>
:  The packages to update, space separated. If no packages are provided, all packages will be updated

## Options
- <a id="arg---no-install" href="#arg---no-install">`--no-install`</a>
:  Don't install the (solve) environments needed for pypi-dependencies solving

- <a id="arg---dry-run" href="#arg---dry-run">`--dry-run (-n)`</a>
:  Don't write the updated resolution or update any environment
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environments to update. If none is specified, all environments are updated

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platforms to update. If none is specified, all platforms are updated. Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) is also accepted so users don't have to declare a platform before targeting it

- <a id="arg---json" href="#arg---json">`--json`</a>
:  Output the changes in JSON format

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

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace
- <a id="arg---script" href="#arg---script">`--script (-s) <SCRIPT>`</a>
:  The path to a script with an embedded manifest: a Python script containing PEP 723 metadata, or a file of any language containing a `/// conda-script` block

## Description
Updates dependencies to newer compatible versions.

Projects and scripts with an adjacent lock file write that lock file. A script without one writes its cached resolution.

## Examples

```shell
pixi update numpy # (1)!
pixi update numpy pandas # (2)!
pixi update --manifest-path ~/myworkspace/pixi.toml numpy # (3)!
pixi update --environment lint python # (4)!
pixi update -e lint -e schema -e docs pre-commit # (5)!
pixi update --platform osx-arm64 mlx # (6)!
pixi update -p linux-64 -p osx-64 numpy  # (7)!
pixi update --dry-run numpy # (8)!
pixi update --no-install boto3 # (9)!
```

1. This will update the `numpy` package to the latest version that fits the requirement.
2. This will update the `numpy` and `pandas` packages to the latest version that fits the requirement.
3. This will update the `numpy` package to the latest version in the manifest file at the given path.
4. This will update the `python` package in the `lint` environment.
5. This will update the `pre-commit` package in the `lint`, `schema`, and `docs` environments.
6. This will update the `mlx` package in the `osx-arm64` platform.
7. This will update the `numpy` package in the `linux-64` and `osx-64` platforms.
8. This will show the packages that would be updated without actually updating them in the lock file
9. This will update the `boto3` package in the manifest and lock file, without installing it in an environment.
