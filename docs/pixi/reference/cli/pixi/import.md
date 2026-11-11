# [pixi](index.md) import

Imports a file into an environment in an existing workspace.

## Usage
```
pixi import [OPTIONS] <FILE>
```

## Arguments
- <a id="arg-FILE" href="#arg-FILE">`<FILE>`</a>
:  File to import into the workspace

## Options
- <a id="arg---format" href="#arg---format">`--format <FORMAT>`</a>
:  Which format to interpret the file as

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platforms for the imported environment. Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) is also accepted. Names that aren't yet declared get auto-added as subdir platforms

- <a id="arg---environment" href="#arg---environment">`--environment (-e) <NEW_ENVIRONMENT>`</a>
:  A name for the created environment. Without `--feature` the imported content is written inline on the environment
- <a id="arg---feature" href="#arg---feature">`--feature (-f) <NEW_FEATURE>`</a>
:  A name for the created feature. The feature is added to the environment of the same name unless `--environment` is given

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
- <a id="arg---no-config" href="#arg---no-config">`--no-config`</a>
:  Don't read system or user-level configuration files. Project-local `<project>/.pixi/config.toml` is still loaded

- <a id="arg---config-file" href="#arg---config-file">`--config-file <PATH>`</a>
:  Load configuration from this file instead of searching system and user-level paths. Project-local `<project>/.pixi/config.toml` is still merged on top

## Global Options
- <a id="arg---manifest-path" href="#arg---manifest-path">`--manifest-path (-m) <MANIFEST_PATH>`</a>
:  The path to `pixi.toml`, `pyproject.toml`, or the workspace directory
- <a id="arg---workspace" href="#arg---workspace">`--workspace (-w) <WORKSPACE>`</a>
:  Name of the workspace

## Description
Imports a file into an environment in an existing workspace.

If `--format` isn't provided, `import` will try each format in turn
