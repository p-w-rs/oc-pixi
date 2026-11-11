# [pixi](../index.md) [upload](index.md) anaconda

Options for uploading to a Anaconda.org server

## Usage
```
pixi upload anaconda [OPTIONS] --owner <OWNER>
```

## Options
- <a id="arg---owner" href="#arg---owner">`--owner (-o) <OWNER>`</a>
:  The owner of the distribution (e.g. conda-forge or your username)

- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNELS>`</a>
:  The channel / label to upload the package to (e.g. main / rc)

- <a id="arg---api-key" href="#arg---api-key">`--api-key (-a) <API_KEY>`</a>
:  The Anaconda API key, if none is provided, the token is read from the keychain / auth-file

- <a id="arg---url" href="#arg---url">`--url (-u) <URL>`</a>
:  The URL to the Anaconda server

- <a id="arg---force" href="#arg---force">`--force (-f)`</a>
:  Replace files on conflict
