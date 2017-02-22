# JSON Schema Lint

[![Build Status](https://travis-ci.org/nickcmaynard/jsonschemalint.svg?branch=master)](https://travis-ci.org/nickcmaynard/jsonschemalint)

## Setup
```sh
npm install
```

## Run tests

```sh
# Unit tests
npm run test

# End-to-end tests (build:dev is faster, but Travis uses build:production)
npm run build:production
npm run e2e

# Run limited set of end-to-end tests on Chrome only - 2 terminals required
npm run preview # terminal 1
npm run build:dev # terminal 2
npm run protractor -- --specs e2e-tests/smoke.spec.js --params.browsers="chrome" # terminal 2
```

## Preview

### "live reload" webpack dev server

```sh
npm run dev-server
```
Open [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server).

### Static express preview (of dist/)
```sh
npm run preview
```

Open [http://localhost:3001/](http://localhost:3001/).

## Building dist/

### Production

```sh
npm run build:production
```

### Development (with sourcemap)
```sh
npm run build:dev
```
