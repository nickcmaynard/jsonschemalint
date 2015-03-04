
if(!dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"]){dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"]=true;dojo.provide("jsonschemavalidator.widget.JSONTextBox");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.TabContainer");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.MenuBar");dojo.require("dijit.MenuBarItem");dojo.require("dijit.PopupMenuBarItem");dojo.require("dijit.Menu");dojo.require("dijit.MenuItem");dojo.require("dijit.form.SimpleTextarea");dojo.require("dojox.json.schema");dojo.require("dojo.cache");dojo.require("jsonschemavalidator.proxy.jsv");dojo.require("dojox.grid.DataGrid");dojo.declare("jsonschemavalidator.widget.JSONTextBox",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("jsonschemavalidator.widget","templates/JSONTextBox.html","<div class=\"JSONTextBox\">\n\t<h2><label dojoAttachPoint=\"titleNode\">${name}</label></h2>\n\t<!-- We use a border container because it handles some weird resize issues for textarea quite nicely -->\n\t<div dojoType=\"dijit.layout.BorderContainer\" design=\"headline\" dojoAttachPoint=\"bc\" gutters=\"false\">\n\t\t<div dojoType=\"dijit.MenuBar\" region=\"top\" dojoAttachPoint=\"menu\">\n\t\t\t<div dojoType=\"dijit.PopupMenuBarItem\">\n\t\t\t\t<span>Edit</span>\n\t\t\t\t<div dojoType=\"dijit.Menu\">\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_format\" iconClass=\"dijitEditorIcon dijitEditorIconIndent\">\n\t\t\t\t\tFormat JSON\n\t\t\t\t\t</div>\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_validate\">\n\t\t\t\t\tValidate JSON\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<textarea rows=\"19\" class=\"text\" spellcheck=\"false\" dojoType=\"dijit.form.SimpleTextarea\" region=\"center\" dojoAttachPoint=\"box\" title=\"${name}\" dojoAttachEvent=\"onChange:_onChange, onKeyPress:_onKeyPress\"></textarea>\n\t</div>\n\t<div class=\"errorContainer\" dojoType=\"dijit.layout.TabContainer\" region=\"bottom\">\n\t\t<table dojoType=\"dojox.grid.DataGrid\" title=\"Messages\" dojoAttachPoint=\"messageGrid\">\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th field=\"property\" width=\"30%\">Path</th>\n\t\t\t\t\t<th field=\"message\" width=\"60%\">Message</th>\n\t\t\t\t\t<th field=\"details\" width=\"10%\">Details</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t</table>\n\t</div>\n</div>\n"),widgetsInTemplate:true,name:"",state:"invalidJson",jsvEnvironmentId:"json-schema-draft-03",value:"",_stateMessages:{"invalidJson":"JSON is invalid.  Try http://jsonlint.com to fix it.","validJson":"JSON is valid, but does not validate against schema.","validatedJson":"JSON validates against schema.","schemaNotReady":"Schema not ready for validation."},constructor:function(){this._jsv=new jsonschemavalidator.proxy.jsv();},buildRendering:function(){var F=this.declaredClass+".";this.inherited(arguments);dojo.attr(this.titleNode,"for",this.box.id);},startup:function(){this.inherited(arguments);this.messageGrid.canSort=function(){return false;};this._validate();},_indentStr:"    ",_format:function(){var F=this.declaredClass+".";try{var _1=this._parseValueAsJson();this.box.set("value",this._toIndentedJson(_1));focus(this.box.domNode);}catch(err){}},_toIndentedJson:function(_2){var F=this.declaredClass+".";var _3=dojo.toJsonIndentStr;dojo.toJsonIndentStr=this._indentStr;var _4=dojo.toJson(_2,true);dojo.toJsonIndentStr=_3;return _4;},_onChange:function(){var F=this.declaredClass+".";this._validate();},_validate:function(){var F=this.declaredClass+".";try{var _5=this._parseValueAsJson();this.set("state","validJson");this.set("messages",[]);dojo.when(this._validateAgainstSchema(_5),dojo.hitch(this,function(_6){if(_6&&dojo.exists("errors",_6)){if(_6.errors.length===0){this.set("state","validatedJson");this.set("messages",[{message:this._stateMessages.validatedJson}]);}else{var _7=dojo.map(_6.errors,function(_8){var _9=(dojo.isArray(_8.details)?(_8.details.length>1?dojo.toJson(_8.details):_8.details[0]):_8.details);return {property:_8.uri.substring(_8.uri.indexOf("#")+1),attribute:_8.attribute,message:_8.message,details:_9};});_7.unshift({message:this._stateMessages.validJson});this.set("messages",_7);}}}));}catch(err){if(err.name==="SyntaxError"&&err.message==="Invalid JSON!"){this.set("state","invalidJson");this.set("messages",[{message:this._stateMessages.invalidJson}]);}else{if(err.name==="ReferenceError"&&err.message==="schema is not ready"){this.set("messages",[{message:this._stateMessages.schemaNotReady}]);}else{throw err;}}}},_validateAgainstSchema:function(_a){var F=this.declaredClass+".";if(this.schema&&dojo.isObject(this.schema)){return this._jsv.load(this.jsvEnvironmentId).then(dojo.hitch(this,function(){var _b=JSV.createEnvironment(this.jsvEnvironmentId);return _b.validate(_a,this.schema);}));}else{throw new ReferenceError("schema is not ready");}},_parseValueAsJson:function(){var F=this.declaredClass+".";var _c;try{_c=dojo.fromJson(this.box.get("value"));if(!_c){throw new SyntaxError();}return _c;}catch(err){switch(err.name){case "SyntaxError":case "ReferenceError":throw new SyntaxError("Invalid JSON!");default:throw err;}}},_setStateAttr:function(_d){var F=this.declaredClass+".";dojo.removeClass(this.domNode,this.state);this.state=_d;dojo.addClass(this.domNode,this.state);this.box.set("title",this._stateMessages[_d]);this.onStateChange(_d);},onStateChange:function(_e){},reset:function(){this.box.set("value","");},_getValueAttr:function(){var F=this.declaredClass+".";return this._parseValueAsJson();},_setValueAttr:function(_f){var F=this.declaredClass+".";this.box.set("value",this._toIndentedJson(dojo.isString(_f)?dojo.fromJson(_f):_f));},_setSchemaAttr:function(_10){var F=this.declaredClass+".";if(dojo.isObject(_10)){this.schema=_10;}else{delete this.schema;}this._validate();},_onKeyPress:function(key){var F=this.declaredClass+".";var _11=false;if(key.ctrlKey&&key.shiftKey&&key.keyChar==="F"){this._format();_11=true;}if(key.ctrlKey&&key.shiftKey&&key.keyChar==="V"){this._validate();_11=true;}if(_11){dojo.stopEvent(key);}},_setMessagesAttr:function(_12){this.messageStore=new dojo.data.ItemFileReadStore({data:{items:_12}});if(this._started){this.messageGrid.setStore(this.messageStore);}},_setJsvEnvironmentIdAttr:function(id){this.jsvEnvironmentId=id;if(this.started){this._validate();}}});}