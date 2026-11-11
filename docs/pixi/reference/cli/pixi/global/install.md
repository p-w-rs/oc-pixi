# [pixi](../index.md) [global](index.md) install

Installs the defined packages in a globally accessible location and exposes their command line applications.

!!! tip "Need to specify build strings or hardware-specific packages?"
    For advanced package specifications including build strings, see the [Package Specifications](../../../../concepts/package_specifications.md) guide.

    Examples (both syntaxes work):
    ```shell
    # Equals syntax (compact)
    pixi global install "pytorch=*=*cuda*" --channel pytorch
    pixi global install "jax=*=*cuda*"

    # Bracket syntax (explicit)
    pixi global install "pytorch [build='*cuda*']" --channel pytorch
    pixi global install "jax [build='*cuda*']"
    ```

!!! tip
    Running `osx-64` on Apple Silicon will install the Intel binary but run it using [Rosetta](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)
    ```
    pixi global install --platform osx-64 ruff
    ```

!!! note
    When you pass `--path` with a local `.conda` archive, Pixi copies the file into `PIXI_HOME/conda-files` and installs from that managed copy.
    Supplying any other kind of path keeps the original location unchanged.

After using global install, you can use the package you installed anywhere on your system.

## Usage
```
pixi global install [OPTIONS] [PACKAGE]...
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

- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNEL>`</a>
:  The channels to consider as a name or a url. Multiple channels can be specified by using this field multiple times

- <a id="arg---platform" href="#arg---platform">`--platform (-p) <PLATFORM>`</a>
:  The platform to install the packages for
- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  Ensures that all packages will be installed in the same environment
- <a id="arg---expose" href="#arg---expose">`--expose <EXPOSE>`</a>
:  Add one or more mapping which describe which executables are exposed. The syntax is `exposed_name=executable_name`, so for example `python3.10=python`. Alternatively, you can input only an executable_name and `executable_name=executable_name` is assumed

- <a id="arg---with" href="#arg---with">`--with <WITH>`</a>
:  Add additional dependencies to the environment. Their executables will not be exposed

- <a id="arg---force-reinstall" href="#arg---force-reinstall">`--force-reinstall`</a>
:  Specifies that the environment should be reinstalled
- <a id="arg---no-shortcuts" href="#arg---no-shortcuts">`--no-shortcuts`</a>
:  Specifies that no shortcuts should be created for the installed packages

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
Installs the defined packages in a globally accessible location and exposes their command line applications.

Example:

- `pixi global install starship nushell ripgrep bat`
- `pixi global install jupyter --with polars`
- `pixi global install --expose python3.8=python python=3.8`
- `pixi global install --environment science --expose jupyter --expose ipython jupyter ipython polars`

## Examples

```shell
pixi global install ruff
# Multiple packages can be installed at once
pixi global install starship rattler-build
# Specify the channel(s)
pixi global install --channel conda-forge --channel bioconda trackplot

# Support full conda matchspec
pixi global install python=3.9.*
pixi global install "python [version='3.11.0', build_number=1]"
pixi global install "python [version='3.11.0', build=he550d4f_1_cpython]"
pixi global install python=3.11.0=h10a6764_1_cpython

# Install for a specific platform, only useful on osx-arm64
pixi global install --platform osx-64 ruff

# Install a package with all its executables exposed, together with additional packages that don't expose anything
pixi global install ipython --with numpy --with scipy

# Install into a specific environment name and expose all executables
pixi global install --environment data-science ipython jupyterlab numpy matplotlib

# Expose the binary under a different name
pixi global install --expose "py39=python3.9" "python=3.9.*"
```
