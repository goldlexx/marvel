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

Create a local `.env.local` file from `.env.example` and set your Marvel public API key before starting the app. The key must be authorized for the domain that serves the app in the Marvel developer account.

## API key configuration

The browser client reads a public key from `REACT_APP_MARVEL_API_KEY`. Any value included in a browser build is visible to its users, so never place a private credential there. For a server-side proxy, set `REACT_APP_MARVEL_API_BASE_URL` to a compatible endpoint and keep its private key in that server's secret store. The client accepts the Marvel public API response shape from that endpoint.

For the GitHub Pages workflow, configure the repository Actions variable `MARVEL_PUBLIC_API_KEY`. The workflow maps it to `REACT_APP_MARVEL_API_KEY` only during the build; it is not stored in the source tree.

## Demo status

[Open the GitHub Pages demo](https://goldlexx.github.io/marvel/). The app displays a configuration message when no public key or proxy URL is present. Character data still depends on an authorized key and the availability of the Marvel API.

## Verification

The production build completes. Character data could not be verified without a valid API key and API access. Header placeholder links were replaced with non-interactive labels because those sections do not have implemented routes.
