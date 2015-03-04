dojo._xdResourceLoaded(function(_1,_2,_3){
return {depends:[["provide","com.ibm.developerworks.libproxy"],["provide","jsonschemavalidator.proxy.jsv"],["provide","jsonschemavalidator.widget.JSONTextBox"],["provide","jsonschemavalidator.widget.JSONSchemaTextBox"],["provide","jsonschemavalidator.layer"]],defineResource:function(_4,_5,_6){
if(!_4._hasResource["com.ibm.developerworks.libproxy"]){
_4._hasResource["com.ibm.developerworks.libproxy"]=true;
_4.provide("com.ibm.developerworks.libproxy");
_4.declare("com.ibm.developerworks.libproxy",[],{constructor:function(){
this._moduleDeferreds=[];
},modules:null,load:function(_7){
var F=this.declaredClass+".";
if(this._moduleDeferreds[_7]){
return this._moduleDeferreds[_7];
}
var _8=this._moduleDeferreds[_7]=new _4.Deferred();
var _9=this.modules[_7];
if(_9){
_8.callback(_7);
if(_9.deps){
_8=_8.then(_4.hitch(this,function(_a){
var _b=_4.map(_a,_4.hitch(this,"load"));
return new _4.DeferredList(_b,false,true);
},_9.deps));
}
_8=_8.then(_4.hitch(this,function(_c){
var _d=_4.map(_c,_4.hitch(_4.io.script,"get"));
return new _4.DeferredList(_d,false,true);
},_9.sources));
}else{
_8.errback("Unknown module reference.");
}
return _8;
}});
}
if(!_4._hasResource["jsonschemavalidator.proxy.jsv"]){
_4._hasResource["jsonschemavalidator.proxy.jsv"]=true;
_4.provide("jsonschemavalidator.proxy.jsv");
_4.declare("jsonschemavalidator.proxy.jsv",[com.ibm.developerworks.libproxy],{constructor:function(){
var _e=_4.moduleUrl("jsonschemavalidator.proxy.lib","jsv").path;
this.modules={"_uri":{sources:[{url:_e+"/lib/uri/uri.js"}]},"base":{sources:[{url:_e+"/lib/jsv.js"}],deps:["_uri"]},"json-schema-draft-01":{sources:[{url:_e+"/lib/json-schema-draft-01.js"}],deps:["base"]},"json-schema-draft-02":{sources:[{url:_e+"/lib/json-schema-draft-02.js"}],deps:["base"]},"json-schema-draft-03":{sources:[{url:_e+"/lib/json-schema-draft-03.js"}],deps:["base"]}};
}});
}
if(!_4._hasResource["jsonschemavalidator.widget.JSONTextBox"]){
_4._hasResource["jsonschemavalidator.widget.JSONTextBox"]=true;
_4.provide("jsonschemavalidator.widget.JSONTextBox");
_4.declare("jsonschemavalidator.widget.JSONTextBox",[_5._Widget,_5._Templated],{templateString:_4.cache("jsonschemavalidator.widget","templates/JSONTextBox.html","<div class=\"JSONTextBox\">\n\t<h2><label dojoAttachPoint=\"titleNode\">${name}</label></h2>\n\t<!-- We use a border container because it handles some weird resize issues for textarea quite nicely -->\n\t<div dojoType=\"dijit.layout.BorderContainer\" design=\"headline\" dojoAttachPoint=\"bc\" gutters=\"false\">\n\t\t<div dojoType=\"dijit.MenuBar\" region=\"top\" dojoAttachPoint=\"menu\">\n\t\t\t<div dojoType=\"dijit.PopupMenuBarItem\">\n\t\t\t\t<span>Edit</span>\n\t\t\t\t<div dojoType=\"dijit.Menu\">\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_format\" iconClass=\"dijitEditorIcon dijitEditorIconIndent\">\n\t\t\t\t\tFormat JSON\n\t\t\t\t\t</div>\n\t\t\t\t\t<div dojoType=\"dijit.MenuItem\" dojoAttachEvent=\"onClick:_validate\">\n\t\t\t\t\tValidate JSON\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<textarea rows=\"19\" class=\"text\" spellcheck=\"false\" dojoType=\"dijit.form.SimpleTextarea\" region=\"center\" dojoAttachPoint=\"box\" title=\"${name}\" dojoAttachEvent=\"onChange:_onChange, onKeyPress:_onKeyPress\"></textarea>\n\t</div>\n\t<div class=\"errorContainer\" dojoType=\"dijit.layout.TabContainer\" region=\"bottom\">\n\t\t<table dojoType=\"dojox.grid.DataGrid\" title=\"Messages\" dojoAttachPoint=\"messageGrid\">\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th field=\"property\" width=\"30%\">Path</th>\n\t\t\t\t\t<th field=\"message\" width=\"60%\">Message</th>\n\t\t\t\t\t<th field=\"details\" width=\"10%\">Details</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t</table>\n\t</div>\n</div>\n"),widgetsInTemplate:true,name:"",state:"invalidJson",jsvEnvironmentId:"json-schema-draft-03",value:"",_stateMessages:{"invalidJson":"JSON is invalid.  Try http://jsonlint.com to fix it.","validJson":"JSON is valid, but does not validate against schema.","validatedJson":"JSON validates against schema.","schemaNotReady":"Schema not ready for validation."},constructor:function(){
this._jsv=new jsonschemavalidator.proxy.jsv();
},buildRendering:function(){
var F=this.declaredClass+".";
this.inherited(arguments);
_4.attr(this.titleNode,"for",this.box.id);
},startup:function(){
this.inherited(arguments);
this.messageGrid.canSort=function(){
return false;
};
this._validate();
},_indentStr:"    ",_format:function(){
var F=this.declaredClass+".";
try{
var _f=this._parseValueAsJson();
this.box.set("value",this._toIndentedJson(_f));
focus(this.box.domNode);
}
catch(err){
}
},_toIndentedJson:function(obj){
var F=this.declaredClass+".";
var _10=_4.toJsonIndentStr;
_4.toJsonIndentStr=this._indentStr;
var _11=_4.toJson(obj,true);
_4.toJsonIndentStr=_10;
return _11;
},_onChange:function(){
var F=this.declaredClass+".";
this._validate();
},_validate:function(){
var F=this.declaredClass+".";
try{
var obj=this._parseValueAsJson();
this.set("state","validJson");
this.set("messages",[]);
_4.when(this._validateAgainstSchema(obj),_4.hitch(this,function(_12){
if(_12&&_4.exists("errors",_12)){
if(_12.errors.length===0){
this.set("state","validatedJson");
this.set("messages",[{message:this._stateMessages.validatedJson}]);
}else{
var _13=_4.map(_12.errors,function(_14){
var _15=(_4.isArray(_14.details)?(_14.details.length>1?_4.toJson(_14.details):_14.details[0]):_14.details);
return {property:_14.uri.substring(_14.uri.indexOf("#")+1),attribute:_14.attribute,message:_14.message,details:_15};
});
_13.unshift({message:this._stateMessages.validJson});
this.set("messages",_13);
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
if(this.schema&&_4.isObject(this.schema)){
return this._jsv.load(this.jsvEnvironmentId).then(_4.hitch(this,function(){
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
obj=_4.fromJson(this.box.get("value"));
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
},_setStateAttr:function(_16){
var F=this.declaredClass+".";
_4.removeClass(this.domNode,this.state);
this.state=_16;
_4.addClass(this.domNode,this.state);
this.box.set("title",this._stateMessages[_16]);
this.onStateChange(_16);
},onStateChange:function(_17){
},reset:function(){
this.box.set("value","");
},_getValueAttr:function(){
var F=this.declaredClass+".";
return this._parseValueAsJson();
},_setValueAttr:function(_18){
var F=this.declaredClass+".";
this.box.set("value",this._toIndentedJson(_4.isString(_18)?_4.fromJson(_18):_18));
},_setSchemaAttr:function(_19){
var F=this.declaredClass+".";
if(_4.isObject(_19)){
this.schema=_19;
}else{
delete this.schema;
}
this._validate();
},_onKeyPress:function(key){
var F=this.declaredClass+".";
var _1a=false;
if(key.ctrlKey&&key.shiftKey&&key.keyChar==="F"){
this._format();
_1a=true;
}
if(key.ctrlKey&&key.shiftKey&&key.keyChar==="V"){
this._validate();
_1a=true;
}
if(_1a){
_4.stopEvent(key);
}
},_setMessagesAttr:function(_1b){
this.messageStore=new _4.data.ItemFileReadStore({data:{items:_1b}});
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
if(!_4._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"]){
_4._hasResource["jsonschemavalidator.widget.JSONSchemaTextBox"]=true;
_4.provide("jsonschemavalidator.widget.JSONSchemaTextBox");
_4.declare("jsonschemavalidator.widget.JSONSchemaTextBox",[jsonschemavalidator.widget.JSONTextBox],{_stateMessages:{"invalidJson":"Schema is invalid JSON.  Try http://jsonlint.com to fix it.","validJson":"Schema is valid JSON, but not a valid schema.","validatedJson":"Schema is valid JSON schema.","schemaNotReady":"Schema not ready for validation."},_setJsvEnvironmentIdAttr:function(id){
this.inherited(arguments);
this._jsv.load(this.jsvEnvironmentId).then(_4.hitch(this,function(){
var env=JSV.createEnvironment(this.jsvEnvironmentId);
this.set("schema",env.getDefaultSchema());
}));
}});
}
if(!_4._hasResource["jsonschemavalidator.layer"]){
_4._hasResource["jsonschemavalidator.layer"]=true;
_4.provide("jsonschemavalidator.layer");
}
}};
});
