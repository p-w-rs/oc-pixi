# [pixi](../index.md) [upload](index.md) prefix

Options for uploading to a prefix.dev server. Authentication is used from the keychain / auth-file

## Usage
```
pixi upload prefix [OPTIONS] --channel <CHANNEL>
```

## Options
- <a id="arg---url" href="#arg---url">`--url (-u) <URL>`</a>
:  The URL to the prefix.dev server (only necessary for self-hosted instances)

- <a id="arg---channel" href="#arg---channel">`--channel (-c) <CHANNEL>`</a>
:  The channel to upload the package to

- <a id="arg---api-key" href="#arg---api-key">`--api-key (-a) <API_KEY>`</a>
:  The prefix.dev API key, if none is provided, the token is read from the keychain / auth-file

- <a id="arg---attestation" href="#arg---attestation">`--attestation <ATTESTATION>`</a>
:  Upload an attestation file alongside the package. Note: if you add an attestation, you can _only_ upload a single package. Mutually exclusive with --generate-attestation
- <a id="arg---generate-attestation" href="#arg---generate-attestation">`--generate-attestation`</a>
:  Automatically generate attestation using cosign in CI. Mutually exclusive with --attestation
- <a id="arg---store-github-attestation" href="#arg---store-github-attestation">`--store-github-attestation`</a>
:  Also store the generated attestation to GitHub's attestation API. Requires `GITHUB_TOKEN` environment variable and only works in GitHub Actions. The attestation will be associated with the current repository
- <a id="arg---skip-existing" href="#arg---skip-existing">`--skip-existing (-s)`</a>
:  Skip upload if package already exists
- <a id="arg---force" href="#arg---force">`--force`</a>
:  Force overwrite existing packages
