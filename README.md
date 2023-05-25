# AT Protocol OpenAPI Types

This repository contains OpenAPI types for the AT Protocol. They are generated according to the [AT Protocol Specification](https://atproto.com/specs/lexicon) by converting/translating the lexicon specs into OpenAPI types.

My hope is for this repository to serve as a live representation of the current state of the AT Protocol viewed through the lens of OpenAPI. This could enable the generation of client and server code for the AT Protocol in a variety of languages.

## How to use

### I just want the types

All you need is the `spec/api.json` file! You can reference it directly at this URL:

[`https://raw.githubusercontent.com/rdmurphy/atproto-openapi-types/main/spec/api.json`]()

This file is regenerated every six hours [via a GitHub Action](.github/workflows/convert.yaml) to keep it up to date with the latest changes to the AT Protocol. It sources the [`bluesky-social/atproto`](https://github.com/bluesky-social/atproto) repository directly.

### I want to generate code

You'll need to use the OpenAPI generator of your choice. I've had luck with [`openapi-typescript`](https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-typescript)!

### I want to generate the types locally

You'll need to clone this rerository and [make sure Deno is installed](https://deno.com/manual@v1.34.0/getting_started/installation). Then, run the following command:

```sh
deno task run
```

If you'd like to tweak the generator and see your changes live you can run the following command. It will watch for changes and re-run the script any time a file is updated:

```sh
deno task dev
```

## Existing implementations

- [Bluesky-OpenAPI](https://github.com/trozzelle/Bluesky-OpenAPI): Another AT Protocol to OpenAPI conversion by @trozzelle. It takes a slightly different approach to naming the schemas you may prefer!

## License

MIT
