# [pixi](../../index.md) [workspace](../index.md) [export](index.md) conda-explicit-spec

Export workspace environment to a conda explicit specification file

## Usage
```
pixi workspace export conda-explicit-spec [OPTIONS] <OUTPUT_DIR>
```

## Arguments
- <a id="arg-OUTPUT_DIR" href="#arg-OUTPUT_DIR">`<OUTPUT_DIR>`</a>
:  Output directory for rendered explicit environment spec files

## Options
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environments to render. Can be repeated for multiple environments

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform to render. Can be repeated for multiple platforms. Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) selects every workspace platform built for that subdir. Defaults to all platforms available for selected environments

- <a id="arg---ignore-pypi-errors" href="#arg---ignore-pypi-errors">`--ignore-pypi-errors`</a>
:  PyPI dependencies are not supported in the conda explicit spec file

- <a id="arg---ignore-source-errors" href="#arg---ignore-source-errors">`--ignore-source-errors`</a>
:  Source dependencies are not supported in the conda explicit spec file

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

## Update Options
- <a id="arg---frozen" href="#arg---frozen">`--frozen`</a>
:  Install the environment as defined in the lock file, doesn't update lock file if it isn't up-to-date with the manifest file

- <a id="arg---locked" href="#arg---locked">`--locked`</a>
:  Check if lock file is up-to-date before installing the environment, aborts when lock file isn't up-to-date with the manifest file

- <a id="arg---no-install" href="#arg---no-install">`--no-install`</a>
:  Don't modify the environment, only modify the lock file

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace
- <a id="arg---script" href="#arg---script">`--script (-s) <SCRIPT>`</a>
:  The path to a script with an embedded manifest: a Python script containing PEP 723 metadata, or a file of any language containing a `/// conda-script` block
