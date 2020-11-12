# release

[![code style:
prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Test](https://github.com/farmersdog/clubhouse-pr/workflows/Test/badge.svg)

## Inputs

### `ghToken`

_Required_ Github token

### `createChangelog`

_Default_ true

Would you like to generate a changelog for this release?

### `chStoryUrl`

Clubhouse story URL (ie. https://app.clubhouse.io/org/story)

### `previousTag`

Github tag of latest release (if prerelease)

### `prerelease`

**Default** true

## Development

Run `yarn tdd` to watch Jest tests as you make your changes.

Run `yarn lint:watch` to watch for ESLint errors/warnings.

## Example usage

### Prerelease

```
on:
  push:
    tags:
      - '*'
...

uses: actions/release@v1
with:
  ghToken: ${{ secrets.GITHUB_TOKEN }}
  chStoryUrl: 'https://app.clubhouse.io/org/story'
  tag: "v1.0.0"
  ## prerelease: false # default is true
  previousTag: "v0.0.9" # is required if you're generating a changelog
```

### Release

```
on: repository_dispatch
...

uses: actions/release@v1
with:
  ghToken: ${{ secrets.GITHUB_TOKEN }}
  tag: ${{ github.event.release.tag_name }}
  prerelease: false
  createChangelog: false
```
