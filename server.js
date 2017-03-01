var express = require('express');
var compression = require('compression');

var app = express();

// Logging
var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true
});
winston.level = "info"; // make this "silly" to see all output
var log = winston;

// Basic logging
app.use(function(req, res, next) {
    log.debug('%s %s', req.method, req.url);
    next();
});

app.use(compression());

app.use('/', express.static(__dirname + "/dist", {
  maxAge: "1h"
}));

app.listen(3001);
