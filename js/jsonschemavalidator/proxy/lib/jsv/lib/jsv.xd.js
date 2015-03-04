
dojo._xdResourceLoaded(function(_1,_2,_3){return {defineResource:function(_4,_5,_6){var _7=_7||this,_8=_8||function(){return _7;};(function(){var _9=_8("./uri/uri").URI,O={},_a="0123456789abcdef".split(""),_b,_c,_d,_e;function _f(o){return o===undefined?"undefined":(o===null?"null":Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());};function F(){};function _10(_11){F.prototype=_11||{};return new F();};function _12(obj,_13,_14){var _15={},key;for(key in obj){if(obj[key]!==O[key]){_15[key]=_13.call(_14,obj[key],key,obj);}}return _15;};_b=function(arr,_16,_17){var x=0,xl=arr.length,_18=new Array(xl);for(;x<xl;++x){_18[x]=_16.call(_17,arr[x],x,arr);}return _18;};if(Array.prototype.map){_b=function(arr,_19,_1a){return Array.prototype.map.call(arr,_19,_1a);};}_c=function(arr,_1b,_1c){var x=0,xl=arr.length,_1d=[];for(;x<xl;++x){if(_1b.call(_1c,arr[x],x,arr)){_1d[_1d.length]=arr[x];}}return _1d;};if(Array.prototype.filter){_c=function(arr,_1e,_1f){return Array.prototype.filter.call(arr,_1e,_1f);};}_d=function(arr,o){var x=0,xl=arr.length;for(;x<xl;++x){if(arr[x]===o){return x;}}return -1;};if(Array.prototype.indexOf){_d=function(arr,o){return Array.prototype.indexOf.call(arr,o);};}function _20(o){return o!==undefined&&o!==null?(o instanceof Array&&!o.callee?o:(typeof o.length!=="number"||o.split||o.setInterval||o.call?[o]:Array.prototype.slice.call(o))):[];};function _21(o){var _22=[],key;switch(_f(o)){case "object":for(key in o){if(o[key]!==O[key]){_22[_22.length]=key;}}break;case "array":for(key=o.length-1;key>=0;--key){_22[key]=key;}break;}return _22;};function _23(arr,o){if(_d(arr,o)===-1){arr.push(o);}return arr;};function _24(arr,o){var _25=_d(arr,o);if(_25>-1){arr.splice(_25,1);}return arr;};function _26(){return [_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],"-",_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],"-4",_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],"-",_a[(Math.floor(Math.random()*16)&3)|8],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],"-",_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)],_a[Math.floor(Math.random()*16)]].join("");};function _27(str){return encodeURIComponent(str).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A");};function _28(uri){if(typeof uri==="string"&&uri.indexOf("#")===-1){uri+="#";}return uri;};function _29(){this.errors=[];this.validated={};};_29.prototype.addError=function(_2a,_2b,_2c,_2d,_2e){this.errors.push({uri:_2a instanceof _2f?_2a.getURI():_2a,schemaUri:_2b instanceof _2f?_2b.getURI():_2b,attribute:_2c,message:_2d,details:_2e});};_29.prototype.registerValidation=function(uri,_30){if(!this.validated[uri]){this.validated[uri]=[_30];}else{this.validated[uri].push(_30);}};_29.prototype.isValidatedBy=function(uri,_31){return !!this.validated[uri]&&_d(this.validated[uri],_31)!==-1;};function _2f(env,_32,uri,fd){if(_32 instanceof _2f){if(typeof fd!=="string"){fd=_32._fd;}if(typeof uri!=="string"){uri=_32._uri;}_32=_32._value;}if(typeof uri!=="string"){uri="urn:uuid:"+_26()+"#";}else{if(uri.indexOf(":")===-1){uri=_28(_9.resolve("urn:uuid:"+_26()+"#",uri));}}this._env=env;this._value=_32;this._uri=uri;this._fd=fd||this._env._options["defaultFragmentDelimiter"];};_2f.prototype.getEnvironment=function(){return this._env;};_2f.prototype.getType=function(){return _f(this._value);};_2f.prototype.getValue=function(){return this._value;};_2f.prototype.getURI=function(){return this._uri;};_2f.prototype.resolveURI=function(uri){return _28(_9.resolve(this._uri,uri));};_2f.prototype.getPropertyNames=function(){return _21(this._value);};_2f.prototype.getProperty=function(key){var _33=this._value?this._value[key]:undefined;if(_33 instanceof _2f){return _33;}return new _2f(this._env,_33,this._uri+this._fd+_27(key),this._fd);};_2f.prototype.getProperties=function(){var _34=_f(this._value),_35=this;if(_34==="object"){return _12(this._value,function(_36,key){if(_36 instanceof _2f){return _36;}return new _2f(_35._env,_36,_35._uri+_35._fd+_27(key),_35._fd);});}else{if(_34==="array"){return _b(this._value,function(_37,key){if(_37 instanceof _2f){return _37;}return new _2f(_35._env,_37,_35._uri+_35._fd+_27(key),_35._fd);});}}};_2f.prototype.getValueOfProperty=function(key){if(this._value){if(this._value[key] instanceof _2f){return this._value[key]._value;}return this._value[key];}};_2f.prototype.equals=function(_38){if(_38 instanceof _2f){return this._value===_38._value;}return this._value===_38;};function _39(obj,_3a){var _3b,x;if(obj instanceof _2f){obj=obj.getValue();}switch(_f(obj)){case "object":if(_3a){_3b={};for(x in obj){if(obj[x]!==O[x]){_3b[x]=_39(obj[x],_3a);}}return _3b;}else{return _10(obj);}break;case "array":if(_3a){_3b=new Array(obj.length);x=obj.length;while(--x>=0){_3b[x]=_39(obj[x],_3a);}return _3b;}else{return Array.prototype.slice.call(obj);}break;default:return obj;}};function _3c(env,_3d,uri,_3e){var fr;_2f.call(this,env,_3d,uri);if(_3e===true){this._schema=this;}else{if(_3d instanceof _3c&&!(_3e instanceof _3c)){this._schema=_3d._schema;}else{this._schema=_3e instanceof _3c?_3e:this._env.getDefaultSchema()||_3c.createEmptySchema(this._env);}}fr=this._schema.getValueOfProperty("fragmentResolution");if(fr==="dot-delimited"){this._fd=".";}else{if(fr==="slash-delimited"){this._fd="/";}}};_3c.prototype=_10(_2f.prototype);_3c.createEmptySchema=function(env){var _3f=_10(_3c.prototype);_2f.call(_3f,env,{},undefined,undefined);_3f._schema=_3f;return _3f;};_3c.prototype.getSchema=function(){return this._schema;};_3c.prototype.getAttribute=function(key,arg){var _40,_41,_42,_43;if(!arg&&this._attributes&&this._attributes.hasOwnProperty(key)){return this._attributes[key];}_40=this._schema.getProperty("properties").getProperty(key);_41=_40.getValueOfProperty("parser");_42=this.getProperty(key);if(typeof _41==="function"){_43=_41(_42,_40,arg);if(!arg&&this._attributes){this._attributes[key]=_43;}return _43;}return _42.getValue();};_3c.prototype.getAttributes=function(){var _44,_45,key,_46,_47;if(!this._attributes&&this.getType()==="object"){_44=this.getProperties();_45=this._schema.getProperty("properties");this._attributes={};for(key in _44){if(_44[key]!==O[key]){_46=_45&&_45.getProperty(key);_47=_46&&_46.getValueOfProperty("parser");if(typeof _47==="function"){this._attributes[key]=_47(_44[key],_46);}else{this._attributes[key]=_44[key].getValue();}}}}return _39(this._attributes,false);};_3c.prototype.getLink=function(rel,_48){var _49=this.getAttribute("links",[rel,_48]);if(_49&&_49.length&&_49[_49.length-1]){return _49[_49.length-1];}};_3c.prototype.validate=function(_4a,_4b,_4c,_4d,_4e){var _4f=this._schema.getValueOfProperty("validator");if(!(_4a instanceof _2f)){_4a=this.getEnvironment().createInstance(_4a);}if(!(_4b instanceof _29)){_4b=new _29();}if(typeof _4f==="function"&&!_4b.isValidatedBy(_4a.getURI(),this.getURI())){_4b.registerValidation(_4a.getURI(),this.getURI());_4f(_4a,this,this._schema,_4b,_4c,_4d,_4e);}return _4b;};function _50(_51,_52,_53){var _54=_f(_51),_55=_f(_52),_56,x;if(_55==="undefined"){return _39(_51,true);}else{if(_54==="undefined"||_55!==_54){return _39(_52,true);}else{if(_55==="object"){if(_51 instanceof _3c){_51=_51.getAttributes();}if(_52 instanceof _3c){_52=_52.getAttributes();if(_52["extends"]&&_53&&_52["extends"] instanceof _3c){_52["extends"]=[_52["extends"]];}}_56=_39(_51,true);for(x in _52){if(_52[x]!==O[x]){_56[x]=_50(_51[x],_52[x],_53);}}return _56;}else{return _39(_52,true);}}}};function _57(){this._id=_26();this._schemas={};this._options={};};_57.prototype.clone=function(){var env=new _57();env._schemas=_10(this._schemas);env._options=_10(this._options);return env;};_57.prototype.createInstance=function(_58,uri){var _59;uri=_28(uri);if(_58 instanceof _2f&&(!uri||_58.getURI()===uri)){return _58;}_59=new _2f(this,_58,uri);return _59;};_57.prototype.createSchema=function(_5a,_5b,uri){var _5c,_5d;uri=_28(uri);if(_5a instanceof _3c&&(!uri||_5a._uri===uri)&&(!_5b||_5a._schema.equals(_5b))){return _5a;}_5c=new _3c(this,_5a,uri,_5b);_5d=_5c.getSchema().getValueOfProperty("initializer");if(typeof _5d==="function"){_5c=_5d(_5c);}this._schemas[_5c._uri]=_5c;this._schemas[uri]=_5c;_5c.getAttributes();return _5c;};_57.prototype.createEmptySchema=function(){var _5e=_3c.createEmptySchema(this);this._schemas[_5e._uri]=_5e;return _5e;};_57.prototype.findSchema=function(uri){return this._schemas[_28(uri)];};_57.prototype.setOption=function(_5f,_60){this._options[_5f]=_60;};_57.prototype.getOption=function(_61){return this._options[_61];};_57.prototype.setDefaultFragmentDelimiter=function(fd){if(typeof fd==="string"&&fd.length>0){this._options["defaultFragmentDelimiter"]=fd;}};_57.prototype.getDefaultFragmentDelimiter=function(){return this._options["defaultFragmentDelimiter"];};_57.prototype.setDefaultSchemaURI=function(uri){if(typeof uri==="string"){this._options["defaultSchemaURI"]=_28(uri);}};_57.prototype.getDefaultSchema=function(){return this.findSchema(this._options["defaultSchemaURI"]);};_57.prototype.validate=function(_62,_63){var _64,_65,_66,_67=new _29();try{_64=this.createInstance(_62);_67.instance=_64;}catch(e){_67.addError(e.uri,e.schemaUri,e.attribute,e.message,e.details);}try{_65=this.createSchema(_63);_67.schema=_65;_66=_65.getSchema();_67.schemaSchema=_66;}catch(e){_67.addError(e.uri,e.schemaUri,e.attribute,e.message,e.details);}if(_66){_66.validate(_65,_67);}if(_67.errors.length){return _67;}return _65.validate(_64,_67);};_57.prototype._checkForInvalidInstances=function(_68,_69){var _6a=[],_6b=[[_69,this._schemas[_69]]],_6c=0,_6d,uri,_6e,_6f,_70,key;while(_6c++<_68&&_6b.length){_6d=_6b.shift();uri=_6d[0];_6e=_6d[1];if(_6e instanceof _3c){if(this._schemas[_6e._uri]!==_6e){_6a.push("Instance "+uri+" does not match "+_6e._uri);}else{_70=_6e.getAttributes();for(key in _70){if(_70[key]!==O[key]){_6b.push([uri+"/"+_27(key),_70[key]]);}}}}else{if(_f(_6e)==="object"){_70=_6e;for(key in _70){if(_70.hasOwnProperty(key)){_6b.push([uri+"/"+_27(key),_70[key]]);}}}else{if(_f(_6e)==="array"){_70=_6e;for(key=0;key<_70.length;++key){_6b.push([uri+"/"+_27(key),_70[key]]);}}}}}return _6a.length?_6a:_6c;};_e={_environments:{},_defaultEnvironmentID:"",isJSONInstance:function(o){return o instanceof _2f;},isJSONSchema:function(o){return o instanceof _3c;},createEnvironment:function(id){id=id||this._defaultEnvironmentID;if(!this._environments[id]){throw new Error("Unknown Environment ID");}return this._environments[id].clone();},Environment:_57,registerEnvironment:function(id,env){id=id||(env||0)._id;if(id&&!this._environments[id]&&env instanceof _57){env._id=id;this._environments[id]=env;}},setDefaultEnvironmentID:function(id){if(typeof id==="string"){if(!this._environments[id]){throw new Error("Unknown Environment ID");}this._defaultEnvironmentID=id;}},getDefaultEnvironmentID:function(){return this._defaultEnvironmentID;},typeOf:_f,createObject:_10,mapObject:_12,mapArray:_b,filterArray:_c,searchArray:_d,toArray:_20,keys:_21,pushUnique:_23,popFirst:_24,clone:_39,randomUUID:_26,escapeURIComponent:_27,formatURI:_28,inherits:_50};this.JSV=_e;_7.JSV=_e;_8("./environments");}());}};});