# [pixi](../index.md) [upload](index.md) cloudsmith

Options for uploading to a Cloudsmith repository. Authentication is used from the keychain / auth-file

## Usage
```
pixi upload cloudsmith [OPTIONS] --owner <OWNER> --repo <REPO>
```

## Options
- <a id="arg---owner" href="#arg---owner">`--owner (-o) <OWNER>`</a>
:  The owner (namespace) of the Cloudsmith repository

- <a id="arg---repo" href="#arg---repo">`--repo (-r) <REPO>`</a>
:  The Cloudsmith repository name

- <a id="arg---api-key" href="#arg---api-key">`--api-key (-a) <API_KEY>`</a>
:  The Cloudsmith API key, if none is provided, the token is read from the keychain / auth-file

- <a id="arg---url" href="#arg---url">`--url (-u) <URL>`</a>
:  The URL to the Cloudsmith API server
