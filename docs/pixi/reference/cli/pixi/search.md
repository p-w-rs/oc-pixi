# [pixi](index.md) search

Search a conda package

### Channel selection

When no `--channel` option is provided, the channels depend on whether Pixi discovers a workspace:

- Inside a workspace, Pixi uses the effective channels of the workspace's default environment.
  These are normally the workspace channels, but can also reflect channels configured through features of a customized
  default environment.
- Outside a workspace, Pixi uses the [`default-channels`](../../pixi_configuration.md#default-channels) from the
  configuration.
  If they are not configured, `conda-forge` is used.

Providing one or more `--channel` options replaces these defaults for the search.

## Usage
```
pixi search [OPTIONS] <PACKAGE>
```

## Arguments
- <a id="arg-PACKAGE" href="#arg-PACKAGE">`<PACKAGE>`</a>
:  MatchSpec of a package to search

## Options
- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNEL>`</a>
:  The channels to consider as a name or a url. Multiple channels can be specified by using this field multiple times

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform to search packages for. By default, searches all platforms from the manifest (or all known platforms if no manifest is found). Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) is also accepted
- <a id="arg---limit" href="#arg---limit">`--limit (-l) <LIMIT>`</a>
:  Limit the number of versions shown per package, -1 for no limit

- <a id="arg---limit-packages" href="#arg---limit-packages">`--limit-packages (-n) <LIMIT_PACKAGES>`</a>
:  Limit the number of packages shown, -1 for no limit

- <a id="arg---json" href="#arg---json">`--json`</a>
:  Output in JSON format

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

## Description
Search a conda package

Its output will list the latest version of package.

## Examples

```shell
pixi search pixi
# no package is named exactly `ros`, so this falls back to `ros*`
pixi search ros
pixi search --limit 30 "py*"
# search in a different channel and for a specific platform
pixi search -c robostack --platform linux-64 "*plotjuggler*"
# search for a specific version of a package
pixi search "rattler-build<=0.35.4"
pixi search "rattler-build[build_number=h2d22210_0]" --platform linux-64
```
