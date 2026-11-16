# Character Explorer

A React character browser with two clearly separated data sources: the Marvel public API when a public API key or compatible proxy is configured, and an original offline demo dataset when it is not.

## Demo mode

[Open the GitHub Pages app](https://goldlexx.github.io/marvel/). Without API configuration, the app displays eight fictional sample profiles with a locally created SVG portrait. The page labels this mode and makes no claim that the samples come from Marvel. The character list supports filtering, selection, details, and a random profile without sending API requests.

Set `VITE_MARVEL_DEMO_MODE=true` in `.env.local` to force demo mode while developing.

## Run locally

```sh
npm ci
npm start
```

Run tests and create a production build:

```sh
npm test
npm run build
```

## Connect the Marvel API

Sign in to the [Marvel Developer account](https://developer.marvel.com/account) to obtain your own public API key. Create a local `.env.local` file and set `VITE_MARVEL_API_KEY` to that key. Alternatively, set `VITE_MARVEL_API_BASE_URL` to a compatible proxy endpoint. The key included in a frontend build is public; never put a private key in this app or commit `.env.local`. The Marvel Developer account must authorize the app's domain.

For GitHub Pages builds, configure the repository Actions variable `MARVEL_PUBLIC_API_KEY`. If no key or proxy URL is configured, the published app stays in demo mode.

## Technologies

- React 18
- JavaScript
- Sass
- Vite and Vitest
- Marvel public API integration
