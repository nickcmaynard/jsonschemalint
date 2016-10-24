var express = require('express');
var compression = require('compression');

var app = express();

// Logging
var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true
});
winston.level = "silly"; // make this "silly" to see all output
var log = winston;

// Basic logging
app.use(function(req, res, next) {
    log.info('%s %s', req.method, req.url);
    next();
});

app.use(compression());

app.use('/', express.static(__dirname + "/www"));

app.listen(3001);
