# JSON Schema Lint

https://github.com/nickcmaynard/music-plumber/actions?query=workflow%3A%22Cross-platform+tests%22

[![Build container image](https://github.com/nickcmaynard/jsonschemalint/workflows/Build%20container%20image/badge.svg)](https://github.com/nickcmaynard/jsonschemalint/actions?query=workflow%3A%22Build+container+image%22)

## Setup

```sh
npm ci
```

## Run tests

```sh
# Unit tests
npm run test:unit

# End-to-end tests
npx playright install --with-deps
npm run test:e2e

# Run limited set of end-to-end tests on Chromium
npx playwright test --project chromium
```

## Preview

### "live reload" dev

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Built site (of dist/)

```sh
npm run build
npm run preview
```

Open [http://localhost:4173/](http://localhost:4173/).

## Building dist/

### Production

```sh
npm run build
```

### Development (with sourcemap)

```sh
npx vite build --sourcemap true
```
