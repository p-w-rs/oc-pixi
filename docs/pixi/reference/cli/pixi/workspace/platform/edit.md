# [pixi](../../index.md) [workspace](../index.md) [platform](index.md) edit

Edit an existing workspace platform's subdir and/or virtual packages

## Usage
```
pixi workspace platform edit [OPTIONS] <NAME> [__NAME[=VERSION[=BUILD]]]...
```

## Arguments
- <a id="arg-NAME" href="#arg-NAME">`<NAME>`</a>
:  Name of the platform to edit

- <a id="arg-__NAME[=VERSION[=BUILD]]" href="#arg-__NAME[=VERSION[=BUILD]]">`<__NAME[=VERSION[=BUILD]]>`</a>
:  Raw virtual-package specs (`__name[=version[=build_string]]`) to declare or update on this platform. Use the friendly flags (`--cuda`, `--archspec`, ...) for virtual packages that have one; this trailing positional list is the escape hatch for everything else, mirroring the `__name = "..."` raw keys accepted in pixi.toml

## Options
- <a id="arg---subdir" href="#arg---subdir">`--subdir <SUBDIR>`</a>
:  Set a new conda subdir for this platform
- <a id="arg---cuda" href="#arg---cuda">`--cuda <VERSION>`</a>
:  Declare a `__cuda` virtual package at the given version, e.g. `12.0`. Valid on any subdir
- <a id="arg---cuda-arch" href="#arg---cuda-arch">`--cuda-arch <VERSION>`</a>
:  Declare a `__cuda_arch` virtual package (GPU compute capability) at the given version, e.g. `8.6`. Requires `--cuda` (or an existing `__cuda`), matching the conda CEP coupling. Serialized as `cuda = { driver, arch }`
- <a id="arg---archspec" href="#arg---archspec">`--archspec <ARCH>`</a>
:  Declare a `__archspec` virtual package with the given microarchitecture string, e.g. `x86_64_v3`. Valid on any subdir
- <a id="arg---glibc" href="#arg---glibc">`--glibc <VERSION>`</a>
:  Declare a `__glibc` virtual package at the given version, e.g. `2.28`. Only valid on linux subdirs
- <a id="arg---linux" href="#arg---linux">`--linux <VERSION>`</a>
:  Declare a `__linux` virtual package at the given kernel version, e.g. `5.10`. Only valid on linux subdirs
- <a id="arg---macos" href="#arg---macos">`--macos <VERSION>`</a>
:  Declare a `__osx` virtual package at the given macOS version, e.g. `14.0`. Only valid on osx subdirs

- <a id="arg---windows" href="#arg---windows">`--windows <VERSION>`</a>
:  Declare a `__win` virtual package at the given Windows version, e.g. `10`. Only valid on win subdirs
- <a id="arg---remove-virtual-package" href="#arg---remove-virtual-package">`--remove-virtual-package <NAME>`</a>
:  Remove the named virtual package from this platform. Can be repeated

- <a id="arg---clear-virtual-packages" href="#arg---clear-virtual-packages">`--clear-virtual-packages`</a>
:  Clear all virtual packages before applying any add/upsert operations
- <a id="arg---no-install" href="#arg---no-install">`--no-install`</a>
:  Don't update the environment, only refresh the lock-file
