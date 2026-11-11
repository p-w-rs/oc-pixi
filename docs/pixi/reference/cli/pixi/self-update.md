# [pixi](index.md) self-update

Update pixi to the latest version or a specific version

## Usage
```
pixi self-update [OPTIONS]
```

## Options
- <a id="arg---offline" href="#arg---offline">`--offline=<OFFLINE>`</a>
:  Run without network access. Updating always requires the network, so this makes `pixi self-update` fail fast instead of attempting to connect

- <a id="arg---version" href="#arg---version">`--version <VERSION>`</a>
:  The desired version (to downgrade or upgrade to)
- <a id="arg---dry-run" href="#arg---dry-run">`--dry-run`</a>
:  Only show release notes, do not modify the binary
- <a id="arg---force" href="#arg---force">`--force`</a>
:  Force download the desired version when not exactly same with the current. If no desired version, always replace with the latest version

- <a id="arg---no-release-note" href="#arg---no-release-note">`--no-release-note`</a>
:  Skip printing the release notes

- <a id="arg---from-url" href="#arg---from-url">`--from-url <FROM_URL>`</a>
:  The github releases URL, useful when behind a proxy, or using custom Pixi release

## Config Options
- <a id="arg---no-config" href="#arg---no-config">`--no-config`</a>
:  Don't read system or user-level configuration files. Project-local `<project>/.pixi/config.toml` is still loaded

- <a id="arg---config-file" href="#arg---config-file">`--config-file <PATH>`</a>
:  Load configuration from this file instead of searching system and user-level paths. Project-local `<project>/.pixi/config.toml` is still merged on top

## Examples

```shell
pixi self-update
pixi self-update --version 0.46.0
```
