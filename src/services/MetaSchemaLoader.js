'use strict';

var version4 = require('../../node_modules/ajv/lib/refs/json-schema-draft-04.json');
// This was the unnoficial meta-schema for the draft-05 that never was. 
var version5 = require('../../node_modules/ajv/lib/refs/json-schema-v5.json'); 

exports.draft4 = version4;
exports.v5 = version5;
