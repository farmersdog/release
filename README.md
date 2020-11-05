# release

[![code style:
prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Test](https://github.com/farmersdog/clubhouse-pr/workflows/Test/badge.svg)

## Inputs

### `tag`

**Required** github tag

### `prerelease`

**Default** true

## Outputs

### `releaseNotes`

Release notes.

## Development

Run `yarn tdd` to watch Jest tests as you make your changes.

Run `yarn lint:watch` to watch for ESLint errors/warnings.

## Example usage

```
on:
  pull_request:
    types: [opened]
```

```
uses: actions/release@v1
with:
  tag: "v1.0.0"
  prerelease: false # default is true
```
