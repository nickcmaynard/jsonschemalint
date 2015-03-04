if(!dojo._hasResource["com.ibm.developerworks.libproxy"]){
dojo._hasResource["com.ibm.developerworks.libproxy"]=true;
dojo.provide("com.ibm.developerworks.libproxy");
dojo.require("dojo.io.script");
dojo.require("dojo.DeferredList");
dojo.declare("com.ibm.developerworks.libproxy",[],{constructor:function(){
this._moduleDeferreds=[];
},modules:null,load:function(_1){
var F=this.declaredClass+".";
if(this._moduleDeferreds[_1]){
return this._moduleDeferreds[_1];
}
var _2=this._moduleDeferreds[_1]=new dojo.Deferred();
var _3=this.modules[_1];
if(_3){
_2.callback(_1);
if(_3.deps){
_2=_2.then(dojo.hitch(this,function(_4){
var _5=dojo.map(_4,dojo.hitch(this,"load"));
return new dojo.DeferredList(_5,false,true);
},_3.deps));
}
_2=_2.then(dojo.hitch(this,function(_6){
var _7=dojo.map(_6,dojo.hitch(dojo.io.script,"get"));
return new dojo.DeferredList(_7,false,true);
},_3.sources));
}else{
_2.errback("Unknown module reference.");
}
return _2;
}});
}
if(!dojo._hasResource["jsonschemavalidator.proxy.jsv"]){
dojo._hasResource["jsonschemavalidator.proxy.jsv"]=true;
dojo.provide("jsonschemavalidator.proxy.jsv");
dojo.declare("jsonschemavalidator.proxy.jsv",[com.ibm.developerworks.libproxy],{constructor:function(){
var _8=dojo.moduleUrl("jsonschemavalidator.proxy.lib","jsv").path;
this.modules={"_uri":{sources:[{url:_8+"/lib/uri/uri.js"}]},"base":{sources:[{url:_8+"/lib/jsv.js"}],deps:["_uri"]},"json-schema-draft-01":{sources:[{url:_8+"/lib/json-schema-draft-01.js"}],deps:["base"]},"json-schema-draft-02":{sources:[{url:_8+"/lib/json-schema-draft-02.js"}],deps:["base"]},"json-schema-draft-03":{sources:[{url:_8+"/lib/json-schema-draft-03.js"}],deps:["base"]}};
}});
}
if(!dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"]){
dojo._hasResource["jsonschemavalidator.widget.JSONTextBox"]=true;
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
dojo.declare("jsonschemavalidator.widget.JSONTextBox",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("jsonschemavalidator.widget","templates/JSONTextBox.html","<div class=\"JSONTextBox\">\n\t<h2><label dojoAttachPoint=\"titleNode\">${name}</label></h2>\n\t<!-- We use a border container because it handles some weird resize issues for textarea quite nicely -->\n\t<div dojoType=\"dijit.layout.BorderContainer\" design=\"headline\" dojoAttachPoint=\"bc\" gutters=\"false\">\n\t\t<div dojoType=\"dijit.MenuBar\" region=\"top\" dojoAttachPoint=\"menu\">\n\t\t\t<div dojoType=\"dijit.PopupMenuBarItem\">\n\t\t\t\t<span>Edit</span>\n\t\t\t\t<div dojoType=\"dijit.Menu\">\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_format\" iconClass=\"dijitEditorIcon dijitEditorIconIndent\">\n\t\t\t\t\tFormat JSON\n\t\t\t\t\t</div>\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_validate\">\n\t\t\t\t\tValidate JSON\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<textarea rows=\"19\" class=\"text\" spellcheck=\"false\" dojoType=\"dijit.form.SimpleTextarea\" region=\"center\" dojoAttachPoint=\"box\" title=\"${name}\" dojoAttachEvent=\"onChange:_onChange, onKeyPress:_onKeyPress\"></textarea>\n\t</div>\n\t<div class=\"errorContainer\" dojoType=\"dijit.layout.TabContainer\" region=\"bottom\">\n\t\t<table dojoType=\"dojox.grid.DataGrid\" title=\"Messages\" dojoAttachPoint=\"messageGrid\">\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th field=\"property\" width=\"30%\">Path</th>\n\t\t\t\t\t<th field=\"message\" width=\"60%\">Message</th>\n\t\t\t\t\t<th field=\"details\" width=\"10%\">Details</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t</table>\n\t</div>\n</div>\n"),widgetsInTemplate:true,name:"",state:"invalidJson",jsvEnvironmentId:"json-schema-draft-03",value:"",_stateMessages:{"invalidJson":"JSON is invalid.  Try http://jsonlint.com to fix it.","validJson":"JSON is valid, but does not validate against schema.","validatedJson":"JSON validates against schema.","schemaNotReady":"Schema not ready for validation."},constructor:function(){
this._jsv=new jsonschemavalidator.proxy.jsv();
},buildRendering:function(){
var F=this.declaredClass+".";
this.inherited(arguments);
dojo.attr(this.titleNode,"for",this.box.id);
},startup:function(){
this.inherited(arguments);
this.messageGrid.canSort=function(){
return false;
};
this._validate();
},_indentStr:"    ",_format:function(){
var F=this.declaredClass+".";
try{
var _9=this._parseValueAsJson();
this.box.set("value",this._toIndentedJson(_9));
focus(this.box.domNode);
}
catch(err){
}
},_toIndentedJson:function(_a){
var F=this.declaredClass+".";
var _b=dojo.toJsonIndentStr;
dojo.toJsonIndentStr=this._indentStr;
var _c=dojo.toJson(_a,true);
dojo.toJsonIndentStr=_b;
return _c;
},_onChange:function(){
var F=this.declaredClass+".";
this._validate();
},_validate:function(){
var F=this.declaredClass+".";
try{
var _d=this._parseValueAsJson();
this.set("state","validJson");
this.set("messages",[]);
dojo.when(this._validateAgainstSchema(_d),dojo.hitch(this,function(_e){
if(_e&&dojo.exists("errors",_e)){
if(_e.errors.length===0){
this.set("state","validatedJson");
this.set("messages",[{message:this._stateMessages.validatedJson}]);
}else{
var _f=dojo.map(_e.errors,function(_10){
var _11=(dojo.isArray(_10.details)?(_10.details.length>1?dojo.toJson(_10.details):_10.details[0]):_10.details);
return {property:_10.uri.substring(_10.uri.indexOf("#")+1),attribute:_10.attribute,message:_10.message,details:_11};
});
_f.unshift({message:this._stateMessages.validJson});
this.set("messages",_f);
}
}
}));
}
catch(err){
if(err.name==="SyntaxError"&&err.message==="Invalid JSON!"){
this.set("state","invalidJson");
this.set("messages",[{message:this._stateMessages.invalidJson}]);
}else{
if(err.name==="ReferenceError"&&err.message==="schema is not ready"){
this.set("messages",[{message:this._stateMessages.schemaNotReady}]);
}else{
throw err;
}
}
}
},_validateAgainstSchema:function(obj){
var F=this.declaredClass+".";
if(this.schema&&dojo.isObject(this.schema)){
return this._jsv.load(this.jsvEnvironmentId).then(dojo.hitch(this,function(){
var env=JSV.createEnvironment(this.jsvEnvironmentId);
return env.validate(obj,this.schema);
}));
}else{
throw new ReferenceError("schema is not ready");
}
},_parseValueAsJson:function(){
var F=this.declaredClass+".";
var obj;
try{
obj=dojo.fromJson(this.box.get("value"));
if(!obj){
throw new SyntaxError();
}
return obj;
}
catch(err){
switch(err.name){
case "SyntaxError":
case "ReferenceError":
throw new SyntaxError("Invalid JSON!");
default:
throw err;
}
}
},_setStateAttr:function(_12){
var F=this.declaredClass+".";
dojo.removeClass(this.domNode,this.state);
this.state=_12;
dojo.addClass(this.domNode,this.state);
this.box.set("title",this._stateMessages[_12]);
this.onStateChange(_12);
},onStateChange:function(_13){
},reset:function(){
this.box.set("value","");
},_getValueAttr:function(){
var F=this.declaredClass+".";
return this._parseValueAsJson();
},_setValueAttr:function(_14){
var F=this.declaredClass+".";
this.box.set("value",this._toIndentedJson(dojo.isString(_14)?dojo.fromJson(_14):_14));
},_setSchemaAttr:function(_15){
var F=this.declaredClass+".";
if(dojo.isObject(_15)){
this.schema=_15;
}else{
delete this.schema;
}
this._validate();
},_onKeyPress:function(key){
var F=this.declaredClass+".";
var _16=false;
if(key.ctrlKey&&key.shiftKey&&key.keyChar==="F"){
this._format();
_16=true;
}
if(key.ctrlKey&&key.shiftKey&&key.keyChar==="V"){
this._validate();
_16=true;
}
if(_16){
dojo.stopEvent(key);
}
},_setMessagesAttr:function(_17){
this.messageStore=new dojo.data.ItemFileReadStore({data:{items:_17}});
if(this._started){
this.messageGrid.setStore(this.messageStore);
}
},_setJsvEnvironmentIdAttr:function(id){
this.jsvEnvironmentId=id;
if(this.started){
this._validate();
}
}});
}
if(!dojo._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"]){
dojo._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"]=true;
dojo.provide("jsonschemavalidator.widget.JSONSchemaTextBox");
dojo.require("dojox.json.ref");
dojo.declare("jsonschemavalidator.widget.JSONSchemaTextBox",[jsonschemavalidator.widget.JSONTextBox],{_stateMessages:{"invalidJson":"Schema is invalid JSON.  Try http://jsonlint.com to fix it.","validJson":"Schema is valid JSON, but not a valid schema.","validatedJson":"Schema is valid JSON schema.","schemaNotReady":"Schema not ready for validation."},_setJsvEnvironmentIdAttr:function(id){
this.inherited(arguments);
this._jsv.load(this.jsvEnvironmentId).then(dojo.hitch(this,function(){
var env=JSV.createEnvironment(this.jsvEnvironmentId);
this.set("schema",env.getDefaultSchema());
}));
}});
}
if(!dojo._hasResource["jsonschemavalidator.layer"]){
dojo._hasResource["jsonschemavalidator.layer"]=true;
dojo.provide("jsonschemavalidator.layer");
}
