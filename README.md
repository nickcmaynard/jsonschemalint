# JSON Schema Lint

[![Build Status](https://travis-ci.org/nickcmaynard/jsonschemalint.svg?branch=master)](https://travis-ci.org/nickcmaynard/jsonschemalint)

## Setup
```sh
npm install -g grunt-cli
npm install
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
grunt build:production
```

### Development (with sourcemap)
```sh
grunt build:dev
```
