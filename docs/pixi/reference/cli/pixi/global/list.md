# [pixi](../index.md) [global](index.md) list

Lists global environments with their dependencies and exposed commands. Can also display all packages within a specific global environment when using the --environment flag.

## Usage
```
pixi global list [OPTIONS] [REGEX]
```

## Arguments
- <a id="arg-REGEX" href="#arg-REGEX">`<REGEX>`</a>
:  List only packages matching a regular expression. Without regex syntax it acts like a `contains` filter

## Options
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  Allows listing all the packages installed in a specific environment, with an output similar to `pixi list`
- <a id="arg---sort-by" href="#arg---sort-by">`--sort-by <SORT_BY>`</a>
:  Sorting strategy for the package table of an environment

- <a id="arg---json" href="#arg---json">`--json`</a>
:  Whether to output in JSON format

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
Lists global environments with their dependencies and exposed commands. Can also display all packages within a specific global environment when using the --environment flag.

All environments:

- Magenta: the name of the environment.
- Green: the packages that are explicit dependencies of the environment.
- Yellow: the binaries that are exposed.
- Dim: the version of the installed package.

Per environment:

- Green: packages that are explicitly installed.

## Examples

Every environment gets a block: its name, the version of the package it is named
after, and a row per part of the manifest that has something to show.
Environments holding more than one package list them under `dependencies`
instead of in the header.

```
pixi global list
```
Results in:
```
bat 0.26.1
└── exposed       bat

demo
├── dependencies  bat 0.26.1, ripgrep 15.2.0
└── exposed       demo-cli -> bat

python 3.14.6
└── exposed       idle3
                  idle3.14
                  pydoc
                  pydoc3
                  pydoc3.14
                  python
                  python3
                  python3-config
                  python3.1
                  python3.14
                  python3.14-config
```

Here is an example of list of a single environment, which adds the channels, the
size the environment takes up on disk, and the full package table:
```
pixi global list --environment demo
```
Results in:
```
demo
├── dependencies  bat 0.26.1, ripgrep 15.2.0
├── exposed       demo-cli -> bat
├── channels      conda-forge
└── size          6.2 MiB

Package        Version  Build       Size
_openmp_mutex  4.5      20_gnu      28.3 KiB
bat            0.26.1   hdab8a38_0  2.8 MiB
libgcc         16.1.0   ha9f2e26_1  1 MiB
libgomp        16.1.0   he0feb66_1  625.4 KiB
ripgrep        15.2.0   hf19af3b_1  1.8 MiB
```
