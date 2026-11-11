# [pixi](index.md) list

List the packages of the current workspace

## Usage
```
pixi list [OPTIONS] [REGEX]
```

## Arguments
- <a id="arg-REGEX" href="#arg-REGEX">`<REGEX>`</a>
:  List only packages matching a regular expression

## Options
- <a id="arg---platform" href="#arg---platform">`--platform <PLATFORM>`</a>
:  The platform to list packages for. Defaults to the platform best matching this machine. Accepts a workspace platform name; a bare conda subdir (e.g. `linux-64`) is also accepted
- <a id="arg---json" href="#arg---json">`--json`</a>
:  Whether to output in json format
- <a id="arg---sort-by" href="#arg---sort-by">`--sort-by <SORT_BY>`</a>
:  Sorting strategy

- <a id="arg---fields" href="#arg---fields">`--fields <FIELDS>`</a>
:  Select which fields to display and in what order (comma-separated)

- <a id="arg---environment" href="#arg---environment">`--environment (-e) <ENVIRONMENT>`</a>
:  The environment to list packages for. Defaults to the default environment
- <a id="arg---explicit" href="#arg---explicit">`--explicit (-x)`</a>
:  Only list packages that are explicitly defined in the workspace

## Config Options
- <a id="arg---no-config" href="#arg---no-config">`--no-config`</a>
:  Don't read system or user-level configuration files. Project-local `<project>/.pixi/config.toml` is still loaded

- <a id="arg---config-file" href="#arg---config-file">`--config-file <PATH>`</a>
:  Load configuration from this file instead of searching system and user-level paths. Project-local `<project>/.pixi/config.toml` is still merged on top

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

## Description
List the packages of the current workspace

Highlighted packages are explicit dependencies.

## Examples

```shell
pixi list
pixi list py
pixi list --json-pretty
pixi list --explicit
pixi list --sort-by size
pixi list --platform win-64
pixi list --environment cuda
pixi list --frozen
pixi list --locked
pixi list --no-install
```

Output will look like this, where `python` will be green as it is the package that was explicitly added to the [manifest file](../../pixi_manifest.md):

```shell
➜ pixi list
 Package           Version     Build               Size       Kind   Source
 _libgcc_mutex     0.1         conda_forge         2.5 KiB    conda  _libgcc_mutex-0.1-conda_forge.tar.bz2
 _openmp_mutex     4.5         2_gnu               23.1 KiB   conda  _openmp_mutex-4.5-2_gnu.tar.bz2
 bzip2             1.0.8       hd590300_5          248.3 KiB  conda  bzip2-1.0.8-hd590300_5.conda
 ca-certificates   2023.11.17  hbcca054_0          150.5 KiB  conda  ca-certificates-2023.11.17-hbcca054_0.conda
 ld_impl_linux-64  2.40        h41732ed_0          688.2 KiB  conda  ld_impl_linux-64-2.40-h41732ed_0.conda
 libexpat          2.5.0       hcb278e6_1          76.2 KiB   conda  libexpat-2.5.0-hcb278e6_1.conda
 libffi            3.4.2       h7f98852_5          56.9 KiB   conda  libffi-3.4.2-h7f98852_5.tar.bz2
 libgcc-ng         13.2.0      h807b86a_4          755.7 KiB  conda  libgcc-ng-13.2.0-h807b86a_4.conda
 libgomp           13.2.0      h807b86a_4          412.2 KiB  conda  libgomp-13.2.0-h807b86a_4.conda
 libnsl            2.0.1       hd590300_0          32.6 KiB   conda  libnsl-2.0.1-hd590300_0.conda
 libsqlite         3.44.2      h2797004_0          826 KiB    conda  libsqlite-3.44.2-h2797004_0.conda
 libuuid           2.38.1      h0b41bf4_0          32.8 KiB   conda  libuuid-2.38.1-h0b41bf4_0.conda
 libxcrypt         4.4.36      hd590300_1          98 KiB     conda  libxcrypt-4.4.36-hd590300_1.conda
 libzlib           1.2.13      hd590300_5          60.1 KiB   conda  libzlib-1.2.13-hd590300_5.conda
 ncurses           6.4         h59595ed_2          863.7 KiB  conda  ncurses-6.4-h59595ed_2.conda
 openssl           3.2.0       hd590300_1          2.7 MiB    conda  openssl-3.2.0-hd590300_1.conda
 python            3.12.1      hab00c5b_1_cpython  30.8 MiB   conda  python-3.12.1-hab00c5b_1_cpython.conda
 readline          8.2         h8228510_1          274.9 KiB  conda  readline-8.2-h8228510_1.conda
 tk                8.6.13      noxft_h4845f30_101  3.2 MiB    conda  tk-8.6.13-noxft_h4845f30_101.conda
 tzdata            2023d       h0c530f3_0          116.8 KiB  conda  tzdata-2023d-h0c530f3_0.conda
 xz                5.2.6       h166bdaf_0          408.6 KiB  conda  xz-5.2.6-h166bdaf_0.tar.bz2
```
