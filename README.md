# JSON Schema Lint

## Setup
```sh
npm install -g bower grunt-cli
npm install
bower install

# For "live reload" webpack dev server only
npm install -g webpack webpack-dev-server
```

## Preview

### Static express preview
```sh
node server.js
```

Open [http://localhost:3001/](http://localhost:3001/).

### "live reload" webpack dev server

```sh
webpack-dev-server --content-base www/ -d
```
Open [http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server).

## Building

### Production

```sh
grunt
```

### Development (with sourcemap)
```sh
webpack --progress --display-modules -d -v
```
