# Marvel Character Explorer

A React app for exploring Marvel Comics characters, their biographies, appearances, and power stats.

## Live demo

[Open the GitHub Pages app](https://goldlexx.github.io/marvel/).

The main list loads a curated set of SuperHero API character IDs and keeps only records whose publisher is `Marvel Comics`. Search uses the API's `/search/{name}` endpoint and applies the same publisher filter. Select a character to view its profile and stats.

## Demo mode

If the API is unavailable, open the published site with `?demo=true` (or set `VITE_MARVEL_DEMO_MODE=true` in `.env.local`) to use the original offline sample characters. Demo profiles are fictional, visibly labeled, and use an original local SVG portrait.

## Run locally

```sh
npm ci
npm start
```

Run the existing tests and production build:

```sh
npm test
npm run build
```

## API and token

This project uses the [SuperHero API](https://superheroapi.com/), which provides character ID lookup, name search, biographies, appearances, power stats, and image URLs.

The educational demo token is intentionally embedded in this frontend as requested. It is public in the source and browser bundle and must not be reused as a private credential. Do not add unrelated secrets to client-side code.

## Technologies

React 18, JavaScript, Sass, Vite, Vitest, and SuperHero API.
