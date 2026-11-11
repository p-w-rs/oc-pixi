# [pixi](../index.md) global

Subcommand for global package management actions

All commands in this section are used to manage global installations of packages and environments through the global manifest.
More info on the global manifest can be found [here](../../../../global_tools/introduction.md).

!!! tip
    Binaries and environments installed globally are stored in `~/.pixi`
    by default, this can be changed by setting the `PIXI_HOME` environment
    variable.

## Usage
```
pixi global <COMMAND>
```

## Subcommands
| Command | Description |
|---------|-------------|
| [`add`](add.md) | Adds dependencies to an environment |
| [`edit`](edit.md) | Edit the global manifest file |
| [`install`](install.md) | Installs the defined packages in a globally accessible location and exposes their command line applications. |
| [`uninstall`](uninstall.md) | Uninstalls environments from the global environment. |
| [`remove`](remove.md) | Removes dependencies from an environment |
| [`list`](list.md) | Lists global environments with their dependencies and exposed commands. Can also display all packages within a specific global environment when using the --environment flag. |
| [`sync`](sync.md) | Sync global manifest with installed environments |
| [`expose`](expose/index.md) | Interact with the exposure of binaries in the global environment |
| [`shortcut`](shortcut/index.md) | Interact with the shortcuts on your machine |
| [`update`](update.md) | Updates environments in the global environment |
| [`tree`](tree.md) | Show a tree of dependencies for a specific global environment |

## Description
Subcommand for global package management actions.

Install packages on the user level. Into to the `$PIXI_HOME` directory, which defaults to `~/.pixi`.
