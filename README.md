# Marvel Information Portal

A React application for browsing Marvel characters using the Marvel API.

## Features

- Shows a random character with links and related details
- Loads a character list and supports loading more entries
- Displays details for a selected character
- Handles API errors with error boundaries and loading states

## Technologies

- React 18
- React Router 6
- Sass
- Create React App (`react-scripts` 5)
- Marvel public API

## Run locally

```bash
npm ci
npm run build
npm start
```

Create a local `.env.local` file from `.env.example` and set your Marvel public API key before starting the app. The API key is required to load character data.

## API key configuration

The API key is read from `REACT_APP_MARVEL_API_KEY`. Do not commit `.env.local` or put private credentials in client-side code; values embedded in a browser app are public to its users.

## Demo status

[Open the GitHub Pages demo](https://goldlexx.github.io/marvel/). The page responded during verification, but character data did not load, so the live API-backed features could not be confirmed. No screenshot is included because the captured page showed the unavailable-data state.

## Verification

The production build completes. Character data could not be verified without a valid API key and API access. Header placeholder links were replaced with non-interactive labels because those sections do not have implemented routes.
