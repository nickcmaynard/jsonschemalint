if(!dojo._hasResource["com.ibm.developerworks.libproxy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["com.ibm.developerworks.libproxy"] = true;
dojo.provide("com.ibm.developerworks.libproxy");

dojo.require("dojo.io.script");
dojo.require("dojo.DeferredList");

/**
 * Do not directly use this class; instead, extend it and redefine the
 * modules field in the constructor
 */
dojo.declare("com.ibm.developerworks.libproxy", [], {

	constructor : function() {
		this._moduleDeferreds = [];
	},

	/**
	 * Holds the modules of the library (and optional references to their
	 * dependencies).
	 * 
	 * NB: 'sources' and 'deps' arrays will be loaded in parallel. If you need
	 * to serialise this, add another module layer. ie. uri.js MUST be loaded
	 * before jsv.js below
	 * 
	 * The 'sources' array holds objects that are passed in their entirety to
	 * dojo.io.script.get()
	 * 
	 * Example, { 'module1Ref': { sources: [{ url: "module1.js" }] },
	 * 'module2Ref': { sources: [{ url: "module2.js" }], deps: ['module1'] } };
	 */
	modules : null,

	/**
	 * Returns a dojo.Deferred object whose callback/errback fires when the
	 * module is ready for use. Callback chain will contain the module
	 * reference.
	 * 
	 * Example usage: load('module2').then(function() {});
	 */
	load : function(/* String */moduleRef) {
		var F = this.declaredClass + ".";
		console.debug(F + "load()", arguments);

		// Check cache - have we loaded this library module before?
		if (this._moduleDeferreds[moduleRef]) {
			return this._moduleDeferreds[moduleRef];
		}

		// Create a new deferred and cache it
		var deferred = this._moduleDeferreds[moduleRef] = new dojo.Deferred();

		var module = this.modules[moduleRef];
		if (module) {
			deferred.callback(moduleRef);
			if (module.deps) {
				// Load dependencies in parallel
				deferred = deferred.then(dojo.hitch(this,
						function(/* Array */dependencies) {
							var defs = dojo.map(dependencies, dojo.hitch(this,
									'load'));
							return new dojo.DeferredList(defs, false, true);
						}, module.deps));
			}
			// Load sources in parallel
			deferred = deferred.then(dojo.hitch(this,
					function(/* Array */sources) {
						var defs = dojo.map(sources, dojo.hitch(dojo.io.script,
								'get'));
						return new dojo.DeferredList(defs, false, true);
					}, module.sources));
		} else {
			deferred.errback("Unknown module reference.");
		}

		return deferred;
	}
});

}

if(!dojo._hasResource["jsonschemavalidator.proxy.jsv"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["jsonschemavalidator.proxy.jsv"] = true;
dojo.provide("jsonschemavalidator.proxy.jsv");



dojo.declare("jsonschemavalidator.proxy.jsv", [com.ibm.developerworks.libproxy], {

	constructor : function() {
		var jsvRoot = dojo.moduleUrl("jsonschemavalidator.proxy.lib", "jsv").path;
		
		this.modules = {
			'_uri' : { 
				sources : [{url : jsvRoot + "/lib/uri/uri.js"}]
			},
			'base' : { 
				sources : [{url : jsvRoot + "/lib/jsv.js"}], 
				deps : ['_uri']
			},
			'json-schema-draft-01' : { 
				sources : [{url : jsvRoot + "/lib/json-schema-draft-01.js"}], 
				deps: ['base']
			},
			'json-schema-draft-02' : { 
				sources : [{url : jsvRoot + "/lib/json-schema-draft-02.js"}], 
				deps: ['base'] 
			},
			'json-schema-draft-03' : { 
				sources : [{url : jsvRoot + "/lib/json-schema-draft-03.js"}], 
				deps: ['base'] 
			}
		};
	}

});

}

if(!dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"] = true;
dojo.provide("jsonschemavalidator.widget.JSONTextBox");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.form.SimpleTextarea");
dojo.require("dojox.json.schema");

dojo.require("dojo.cache");



dojo.require("dojox.grid.DataGrid");

dojo.declare("jsonschemavalidator.widget.JSONTextBox", [dijit._Widget, dijit._Templated], {
	
	templateString: dojo.cache("jsonschemavalidator.widget", "templates/JSONTextBox.html", "<div class=\"JSONTextBox\">\n\t<h2><label dojoAttachPoint=\"titleNode\">${name}</label></h2>\n\t<!-- We use a border container because it handles some weird resize issues for textarea quite nicely -->\n\t<div dojoType=\"dijit.layout.BorderContainer\" design=\"headline\" dojoAttachPoint=\"bc\" gutters=\"false\">\n\t\t<div dojoType=\"dijit.MenuBar\" region=\"top\" dojoAttachPoint=\"menu\">\n\t\t\t<div dojoType=\"dijit.PopupMenuBarItem\">\n\t\t\t\t<span>Edit</span>\n\t\t\t\t<div dojoType=\"dijit.Menu\">\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_format\" iconClass=\"dijitEditorIcon dijitEditorIconIndent\">\n\t\t\t\t\tFormat JSON\n\t\t\t\t\t</div>\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_validate\">\n\t\t\t\t\tValidate JSON\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<textarea rows=\"19\" class=\"text\" spellcheck=\"false\" dojoType=\"dijit.form.SimpleTextarea\" region=\"center\" dojoAttachPoint=\"box\" title=\"${name}\" dojoAttachEvent=\"onChange:_onChange, onKeyPress:_onKeyPress\"></textarea>\n\t</div>\n\t<div class=\"errorContainer\" dojoType=\"dijit.layout.TabContainer\" region=\"bottom\">\n\t\t<table dojoType=\"dojox.grid.DataGrid\" title=\"Messages\" dojoAttachPoint=\"messageGrid\">\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th field=\"property\" width=\"30%\">Path</th>\n\t\t\t\t\t<th field=\"message\" width=\"60%\">Message</th>\n\t\t\t\t\t<th field=\"details\" width=\"10%\">Details</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t</table>\n\t</div>\n</div>\n"),

	widgetsInTemplate: true,
	
	name : "",
	
	state : "invalidJson",
	
	jsvEnvironmentId : "json-schema-draft-03",
	
	value: "",
	
	_stateMessages : {
		'invalidJson' : 'JSON is invalid.  Try http://jsonlint.com to fix it.',
		'validJson' : 'JSON is valid, but does not validate against schema.',
		'validatedJson' : 'JSON validates against schema.',
		'schemaNotReady' : 'Schema not ready for validation.'
	},
	
	constructor : function() {
		this._jsv = new jsonschemavalidator.proxy.jsv();
	},
	
	buildRendering: function() {
		var F = this.declaredClass + ".";
		console.debug(F + "buildRendering()", arguments);
		
		this.inherited(arguments);
		dojo.attr(this.titleNode, 'for', this.box.id);
	},
	
	startup: function() {
		this.inherited(arguments);
		this.messageGrid.canSort=function(){return false;};
		this._validate();
	},
	
	_indentStr : "    ",
		
	/**
	 * Format the box's content as indented JSON 
	 */
	_format : function() {
		var F = this.declaredClass + ".";
		console.debug(F + "_format()", arguments);
		
		try {
			var obj = this._parseValueAsJson();
			this.box.set('value', this._toIndentedJson(obj));
			focus(this.box.domNode);
			// TODO: scroll to top and set cursor position to top
		} catch (/* Error */ err) {
			// Do nothing
		}
	},
	
	_toIndentedJson : function(/* Object */ obj) {
		var F = this.declaredClass + ".";
		console.debug(F + "_toIndentedJson()", arguments);
		
		// Save and restore the default dojo JSON indent string
		var oldIndent = dojo.toJsonIndentStr;
		dojo.toJsonIndentStr = this._indentStr;
		var result = dojo.toJson(obj, true);
		dojo.toJsonIndentStr = oldIndent;
		return result;
	},
		
	_onChange: function() {
		var F = this.declaredClass + ".";
		console.debug(F + "_onChange()", arguments);
		
		this._validate();
	},
	
	_validate : function() {
		var F = this.declaredClass + ".";
		console.debug(F + "_validate()", arguments);
		
		try {
			var obj = this._parseValueAsJson();
			// It's valid JSON
			this.set('state', 'validJson');
			this.set('messages', []);
			// Validate it against a schema
			dojo.when(this._validateAgainstSchema(obj), dojo.hitch(this, function(results) {
				if (results && dojo.exists("errors", results)) {
					if (results.errors.length === 0) {
						this.set('state', 'validatedJson');
						this.set('messages', [{ message: this._stateMessages.validatedJson}]);
					} else {
						var messages = dojo.map(results.errors, function(error) {
							var details = (dojo.isArray(error.details) ? (error.details.length > 1 ? dojo.toJson(error.details) : error.details[0]) : error.details);
							return {
								property : error.uri.substring(error.uri.indexOf("#") + 1),
								attribute : error.attribute,								
								message : error.message,
								details : details
							};
						});
						messages.unshift({ message: this._stateMessages.validJson});
						this.set('messages', messages);
					}
				}
			}));
		} catch (/* Error */ err) {
			// Error case - bad JSON
			if (err.name === "SyntaxError" && err.message === "Invalid JSON!") {
				this.set('state', 'invalidJson');
				this.set('messages', [{ message: this._stateMessages.invalidJson}]);
			} else if (err.name === "ReferenceError" && err.message === "schema is not ready") {
				this.set('messages', [{ message : this._stateMessages.schemaNotReady}]);
			} else {
				throw err;
			}
		}
	},
	
	/**
	 * Validates an object against the schema
	 * @param obj
	 * @returns dojo.Deferred, callback containing results
	 */
	_validateAgainstSchema : function(obj) {
		var F = this.declaredClass + ".";
		console.debug(F + "_validateAgainstSchema()", arguments);
		
		if (this.schema && dojo.isObject(this.schema)) {
			return this._jsv.load(this.jsvEnvironmentId).then(dojo.hitch(this, function() {
				var env = JSV.createEnvironment(this.jsvEnvironmentId);
				return env.validate(obj, this.schema);
			}));
		} else {
			throw new ReferenceError("schema is not ready");
		}
	},
	
	_parseValueAsJson: function() {
		var F = this.declaredClass + ".";
		console.debug(F + "_parseValueAsJson()", arguments);
		
		var obj;
		try {
			obj = dojo.fromJson(this.box.get('value'));
			if (!obj) {
				// Should never happen but catch the case
				throw new SyntaxError();
			}
			return obj;
		} catch(/* Error */ err) {
			switch (err.name) {
			case "SyntaxError":
			case "ReferenceError":
				// Could not parse the JSON string
				throw new SyntaxError("Invalid JSON!");
			default:
				// Something else went wrong, probably fairly serious
				throw err;
			}
		}
	},
	
	_setStateAttr: function(/* String */ state) {
		var F = this.declaredClass + ".";
		console.debug(F + "_setStateAttr()", arguments);
		
		dojo.removeClass(this.domNode, this.state);
		this.state = state;
		dojo.addClass(this.domNode, this.state);
		
		this.box.set('title', this._stateMessages[state]);
		
		this.onStateChange(state);
	},
	
	onStateChange: function(/* String */ state) {
		// EVENT FOR WIRING
	},
	
	reset: function() {
		this.box.set('value','');
	},
	
	_getValueAttr: function() {
		var F = this.declaredClass + ".";
		console.debug(F + "_getValueAttr()", arguments);
		
		return this._parseValueAsJson();
	},
	
	_setValueAttr: function(pValue) {
		var F = this.declaredClass + ".";
		console.debug(F + "_setValueAttr()", arguments);
				
		this.box.set('value', this._toIndentedJson(dojo.isString(pValue) ? dojo.fromJson(pValue) : pValue));
	},
	
	_setSchemaAttr: function(/* Object */ schema) {
		var F = this.declaredClass + ".";
		console.debug(F + "_setSchemaAttr()", arguments);
		
		if (dojo.isObject(schema)) {
			this.schema = schema;
		} else {
			delete this.schema;
		}
		this._validate();
	},
	
	_onKeyPress: function(key) {
		var F = this.declaredClass + ".";
		console.debug(F + "_onKeyPress()", arguments);
		
		var caught = false;
		if (key.ctrlKey && key.shiftKey && key.keyChar === "F") {
			this._format();
			caught = true;
		}
		if (key.ctrlKey && key.shiftKey && key.keyChar === "V") {
			this._validate();
			caught = true;
		}
		
		if (caught) dojo.stopEvent(key);
	},
	
	_setMessagesAttr: function(/* Array */ messages) {
		this.messageStore = new dojo.data.ItemFileReadStore({ data: { items : messages } });
		if (this._started) {
			this.messageGrid.setStore(this.messageStore);
		}
	},
	
	_setJsvEnvironmentIdAttr : function(id) {
		this.jsvEnvironmentId = id;
		if (this.started) {
			this._validate();
		}
	}
});

}

if(!dojo._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"] = true;
dojo.provide("jsonschemavalidator.widget.JSONSchemaTextBox");


dojo.require("dojox.json.ref");

/**
 * A JSON text box that contains a JSON Schema
 */
dojo.declare("jsonschemavalidator.widget.JSONSchemaTextBox", [jsonschemavalidator.widget.JSONTextBox], {
	
	_stateMessages : {
		'invalidJson' : 'Schema is invalid JSON.  Try http://jsonlint.com to fix it.',
		'validJson' : 'Schema is valid JSON, but not a valid schema.',
		'validatedJson' : 'Schema is valid JSON schema.',
		'schemaNotReady' : 'Schema not ready for validation.'
	},
		
	_setJsvEnvironmentIdAttr : function(id) {
		this.inherited(arguments);

		this._jsv.load(this.jsvEnvironmentId).then(dojo.hitch(this, function() {
			var env = JSV.createEnvironment(this.jsvEnvironmentId);
			this.set('schema', env.getDefaultSchema());
		}));
	}
	
});

}

if(!dojo._hasResource["jsonschemavalidator.layer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["jsonschemavalidator.layer"] = true;
dojo.provide("jsonschemavalidator.layer");




}

