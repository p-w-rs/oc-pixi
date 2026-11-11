# [pixi](../index.md) [auth](index.md) logout

Remove authentication information for a given host

## Usage
```
pixi auth logout [OPTIONS] [HOST]
```

## Arguments
- <a id="arg-HOST" href="#arg-HOST">`<HOST>`</a>
:  The host to remove authentication for. With `auth-interactive` enabled, omit this (and `--all`) to pick interactively

## Options
- <a id="arg---all" href="#arg---all">`--all`</a>
:  Remove every stored authentication entry (revoking OAuth tokens for each)

## Examples

```shell
pixi auth logout <HOST>
pixi auth logout repo.prefix.dev
pixi auth logout anaconda.org
pixi auth logout s3://my-bucket
```
