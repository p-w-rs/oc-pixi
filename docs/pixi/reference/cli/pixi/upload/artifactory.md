# [pixi](../index.md) [upload](index.md) artifactory

Options for uploading to an Artifactory channel

## Usage
```
pixi upload artifactory [OPTIONS] --url <URL> --channel <CHANNELS>
```

## Options
- <a id="arg---url" href="#arg---url">`--url (-u) <URL>`</a>
:  The URL to your Artifactory server

- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNELS>`</a>
:  The URL to your channel

- <a id="arg---username" href="#arg---username">`--username <USERNAME>`</a>
:  Your Artifactory username for HTTP basic authentication

- <a id="arg---password" href="#arg---password">`--password <PASSWORD>`</a>
:  Your Artifactory password for HTTP basic authentication

- <a id="arg---token" href="#arg---token">`--token (-t) <TOKEN>`</a>
:  Your Artifactory token for bearer authentication

## Description
Options for uploading to an Artifactory channel.

Authentication can be supplied directly with a bearer token or with an Artifactory username and password. If no credentials are supplied, they are read from the keychain / auth-file.
