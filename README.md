# List who doesn't follow me

This is a hobby project, and I don't really care about “following back” 😂

## Usage

### Prerequisite

Run `corepack enable && pnpm i`.

### Twitter

1. [Obtain your own Twitter API token on Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api).
2. Place your API token in the environment variable: `TWITTER_BEARER_TOKEN`.
3. Run it: `pnpm start twitter:@byStarTW`
   - Or: `pnpm start twitter:https://twitter.com/byStarTW`
   - Or: `pnpm start twitter:945657976882212864`
4. You will see a well-formatted table shown who does not follow you.
   ![A `console.table` shown who does not follow you](docs/images/outputs.png)

## Contribute

This project welcomes for any contribution – including the adapters, the code style improvements, and typos & tweaks! 🙌

- This tool is very extendable – written your own adapter at [adapters folder](src/adapters) and reference it on [`index.ts`](src/index.ts).
- This project has some tests (though not really many 😞). To run the tests, execute `pnpm test`.
- Run `pnpm lint` and `pnpm fmt` before making a PR!

## License

[AGPL-3.0-only](./LICENSE)
