
dojo._xdResourceLoaded(function(_1,_2,_3){return {defineResource:function(_4,_5,_6){if(typeof exports==="undefined"){exports={};}if(typeof require!=="function"){require=function(id){return exports;};}(function(){var _7=function(_8){var _9=arguments[0],x=1,_a=arguments[x];while(_a){_9=_9.slice(0,-1)+_a.slice(1);_a=arguments[++x];}return _9;},_b=function(_c){return "(?:"+_c+")";},_d="[A-Za-z]",_e="[\\x0D]",_f="[0-9]",_10="[\\x22]",_11=_7(_f,"[A-Fa-f]"),_12="[\\x0A]",_13="[\\x20]",_14=_b("%"+_11+_11),_15="[\\:\\/\\?\\#\\[\\]\\@]",_16="[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",_17=_7(_15,_16),_18=_7(_d,_f,"[\\-\\.\\_\\~]"),_19=_b(_d+_7(_d,_f,"[\\+\\-\\.]")+"*"),_1a=_b(_b(_14+"|"+_7(_18,_16,"[\\:]"))+"*"),_1b=_b(_b("25[0-5]")+"|"+_b("2[0-4]"+_f)+"|"+_b("1"+_f+_f)+"|"+_b("[1-9]"+_f)+"|"+_f),_1c=_b(_1b+"\\."+_1b+"\\."+_1b+"\\."+_1b),_1d=_b(_11+"{1,4}"),_1e=_b(_b(_1d+"\\:"+_1d)+"|"+_1c),_1f=_b(_7(_18,_16,"[\\:]")+"+"),_20=_b("v"+_11+"+\\."+_7(_18,_16,"[\\:]")+"+"),_21=_b("\\["+_b(_1f+"|"+_20)+"\\]"),_22=_b(_b(_14+"|"+_7(_18,_16))+"*"),_23=_b(_21+"|"+_1c+"|"+_22),_24=_b(_f+"*"),_25=_b(_b(_1a+"@")+"?"+_23+_b("\\:"+_24)+"?"),_26=_b(_14+"|"+_7(_18,_16,"[\\:\\@]")),_27=_b(_26+"*"),_28=_b(_26+"+"),_29=_b(_b(_14+"|"+_7(_18,_16,"[\\@]"))+"+"),_2a=_b(_b("\\/"+_27)+"*"),_2b=_b("\\/"+_b(_28+_2a)+"?"),_2c=_b(_29+_2a),_2d=_b(_28+_2a),_2e=_b(""),_2f=_b(_2a+"|"+_2b+"|"+_2c+"|"+_2d+"|"+_2e),_30=_b(_b(_26+"|[\\/\\?]")+"*"),_31=_b(_b(_26+"|[\\/\\?]")+"*"),_32=_b(_b("\\/\\/"+_25+_2a)+"|"+_2b+"|"+_2d+"|"+_2e),_33=_b(_19+"\\:"+_32+_b("\\?"+_30)+"?"+_b("\\#"+_31)+"?"),_34=_b(_b("\\/\\/"+_25+_2a)+"|"+_2b+"|"+_2c+"|"+_2e),_35=_b(_34+_b("\\?"+_30)+"?"+_b("\\#"+_31)+"?"),_36=_b(_33+"|"+_35),_37=_b(_19+"\\:"+_32+_b("\\?"+_30)+"?"),_38=new RegExp("^"+_b("("+_33+")|("+_35+")")+"$"),_39=new RegExp("^("+_19+")\\:"+_b(_b("\\/\\/("+_b("("+_1a+")@")+"?("+_23+")"+_b("\\:("+_24+")")+"?)")+"?("+_2a+"|"+_2b+"|"+_2d+"|"+_2e+")")+_b("\\?("+_30+")")+"?"+_b("\\#("+_31+")")+"?$"),_3a=new RegExp("^(){0}"+_b(_b("\\/\\/("+_b("("+_1a+")@")+"?("+_23+")"+_b("\\:("+_24+")")+"?)")+"?("+_2a+"|"+_2b+"|"+_2c+"|"+_2e+")")+_b("\\?("+_30+")")+"?"+_b("\\#("+_31+")")+"?$"),_3b=new RegExp("^("+_19+")\\:"+_b(_b("\\/\\/("+_b("("+_1a+")@")+"?("+_23+")"+_b("\\:("+_24+")")+"?)")+"?("+_2a+"|"+_2b+"|"+_2d+"|"+_2e+")")+_b("\\?("+_30+")")+"?$"),_3c=new RegExp("^"+_b("\\#("+_31+")")+"?$"),_3d=new RegExp("^"+_b("("+_1a+")@")+"?("+_23+")"+_b("\\:("+_24+")")+"?$"),_3e=new RegExp(_7("[^]",_d,_f,"[\\+\\-\\.]"),"g"),_3f=new RegExp(_7("[^\\%\\:]",_18,_16),"g"),_40=new RegExp(_7("[^\\%]",_18,_16),"g"),_41=new RegExp(_7("[^\\%\\/\\:\\@]",_18,_16),"g"),_42=new RegExp(_7("[^\\%\\/\\@]",_18,_16),"g"),_43=new RegExp(_7("[^\\%]",_18,_16,"[\\:\\@\\/\\?]"),"g"),_44=_43,_45=new RegExp(_7("[^]",_18,_16),"g"),_46=new RegExp(_18,"g"),_47=new RegExp(_7("[^\\%]",_18,_17),"g"),_48=new RegExp(_14+"+","g"),_49=/^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?([^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/i,_4a=/^\.\.?\//,_4b=/^\/\.(\/|$)/,_4c=/^\/\.\.(\/|$)/,_4d=/^\.\.?$/,_4e=/^\/?.*?(?=\/|$)/,_4f=("").match(/(){0}/)[1]===undefined,_50=function(chr){var c=chr.charCodeAt(0);if(c<128){return "%"+c.toString(16).toUpperCase();}else{if((c>127)&&(c<2048)){return "%"+((c>>6)|192).toString(16).toUpperCase()+"%"+((c&63)|128).toString(16).toUpperCase();}else{return "%"+((c>>12)|224).toString(16).toUpperCase()+"%"+(((c>>6)&63)|128).toString(16).toUpperCase()+"%"+((c&63)|128).toString(16).toUpperCase();}}},_51=function(str){var _52="",i=0,c,s;while(i<str.length){c=parseInt(str.substr(i+1,2),16);if(c<128){s=String.fromCharCode(c);if(s.match(_46)){_52+=s;}else{_52+=str.substr(i,3);}i+=3;}else{if((c>191)&&(c<224)){_52+=str.substr(i,6);i+=6;}else{_52+=str.substr(i,9);i+=9;}}}return _52;},_53=function(str){var _54="",i=0,c,c2,c3;while(i<str.length){c=parseInt(str.substr(i+1,2),16);if(c<128){_54+=String.fromCharCode(c);i+=3;}else{if((c>191)&&(c<224)){c2=parseInt(str.substr(i+4,2),16);_54+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=6;}else{c2=parseInt(str.substr(i+4,2),16);c3=parseInt(str.substr(i+7,2),16);_54+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=9;}}}return _54;},_55=function(o){return o===undefined?"undefined":(o===null?"null":Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());},_56=function(){this.errors=[];},URI={};_56.prototype={scheme:undefined,authority:undefined,userinfo:undefined,host:undefined,port:undefined,path:undefined,query:undefined,fragment:undefined,reference:undefined,errors:undefined};URI.SCHEMES={};URI.parse=function(_57,_58){var _59,_5a=new _56(),_5b;_57=_57?_57.toString():"";_58=_58||{};if(_58.reference==="suffix"){_57=(_58.scheme?_58.scheme+":":"")+"//"+_57;}_59=_57.match(_38);if(_59){if(_59[1]){_59=_57.match(_39);}else{_59=_57.match(_3a);}}if(!_59){if(!_58.tolerant){_5a.errors.push("URI is not strictly valid.");}_59=_57.match(_49);}if(_59){if(_4f){_5a.scheme=_59[1];_5a.authority=_59[2];_5a.userinfo=_59[3];_5a.host=_59[4];_5a.port=parseInt(_59[5],10);_5a.path=_59[6]||"";_5a.query=_59[7];_5a.fragment=_59[8];if(isNaN(_5a.port)){_5a.port=_59[5];}}else{_5a.scheme=_59[1]||undefined;_5a.authority=(_57.indexOf("//")!==-1?_59[2]:undefined);_5a.userinfo=(_57.indexOf("@")!==-1?_59[3]:undefined);_5a.host=(_57.indexOf("//")!==-1?_59[4]:undefined);_5a.port=parseInt(_59[5],10);_5a.path=_59[6]||"";_5a.query=(_57.indexOf("?")!==-1?_59[7]:undefined);_5a.fragment=(_57.indexOf("#")!==-1?_59[8]:undefined);if(isNaN(_5a.port)){_5a.port=(_57.match(/\/\/.*\:(?:\/|\?|\#|$)/)?_59[4]:undefined);}}if(!_5a.scheme&&!_5a.authority&&!_5a.path&&!_5a.query){_5a.reference="same-document";}else{if(!_5a.scheme){_5a.reference="relative";}else{if(!_5a.fragment){_5a.reference="absolute";}else{_5a.reference="uri";}}}if(_58.reference&&_58.reference!=="suffix"&&_58.reference!==_5a.reference){_5a.errors.push("URI is not a "+_58.reference+" reference.");}_5b=URI.SCHEMES[_5a.scheme||_58.scheme];if(_5b&&_5b.parse){_5b.parse(_5a,_58);}}else{_5a.errors.push("URI can not be parsed.");}return _5a;};URI._recomposeAuthority=function(_5c){var _5d=[];if(_5c.userinfo!==undefined||_5c.host!==undefined||typeof _5c.port==="number"){if(_5c.userinfo!==undefined){_5d.push(_5c.userinfo.toString().replace(_3f,_50));_5d.push("@");}if(_5c.host!==undefined){_5d.push(_5c.host.toString().toLowerCase().replace(_40,_50));}if(typeof _5c.port==="number"){_5d.push(":");_5d.push(_5c.port.toString(10));}}return _5d.length?_5d.join(""):undefined;};URI.removeDotSegments=function(_5e){var _5f=[],s;while(_5e.length){if(_5e.match(_4a)){_5e=_5e.replace(_4a,"");}else{if(_5e.match(_4b)){_5e=_5e.replace(_4b,"/");}else{if(_5e.match(_4c)){_5e=_5e.replace(_4c,"/");_5f.pop();}else{if(_5e==="."||_5e===".."){_5e="";}else{s=_5e.match(_4e)[0];_5e=_5e.slice(s.length);_5f.push(s);}}}}}return _5f.join("");};URI.serialize=function(_60,_61){var _62=[],_63,s;_61=_61||{};_63=URI.SCHEMES[_60.scheme||_61.scheme];if(_63&&_63.serialize){_63.serialize(_60,_61);}if(_61.reference!=="suffix"&&_60.scheme){_62.push(_60.scheme.toString().toLowerCase().replace(_3e,""));_62.push(":");}_60.authority=URI._recomposeAuthority(_60);if(_60.authority!==undefined){if(_61.reference!=="suffix"){_62.push("//");}_62.push(_60.authority);if(_60.path&&_60.path.charAt(0)!=="/"){_62.push("/");}}if(_60.path){s=URI.removeDotSegments(_60.path.toString().replace(/%2E/ig,"."));if(_60.scheme){s=s.replace(_41,_50);}else{s=s.replace(_42,_50);}if(_60.authority===undefined){s=s.replace(/^\/\//,"/%2F");}_62.push(s);}if(_60.query){_62.push("?");_62.push(_60.query.toString().replace(_43,_50));}if(_60.fragment){_62.push("#");_62.push(_60.fragment.toString().replace(_44,_50));}return _62.join("").replace(_48,_51).replace(/%[0-9A-Fa-f]{2}/g,function(str){return str.toUpperCase();});};URI.resolveComponents=function(_64,_65,_66,_67){var _68=new _56();if(!_67){_64=URI.parse(URI.serialize(_64,_66),_66);_65=URI.parse(URI.serialize(_65,_66),_66);}_66=_66||{};if(!_66.tolerant&&_65.scheme){_68.scheme=_65.scheme;_68.authority=_65.authority;_68.userinfo=_65.userinfo;_68.host=_65.host;_68.port=_65.port;_68.path=URI.removeDotSegments(_65.path);_68.query=_65.query;}else{if(_65.authority!==undefined){_68.authority=_65.authority;_68.userinfo=_65.userinfo;_68.host=_65.host;_68.port=_65.port;_68.path=URI.removeDotSegments(_65.path);_68.query=_65.query;}else{if(!_65.path){_68.path=_64.path;if(_65.query!==undefined){_68.query=_65.query;}else{_68.query=_64.query;}}else{if(_65.path.charAt(0)==="/"){_68.path=URI.removeDotSegments(_65.path);}else{if(_64.authority!==undefined&&!_64.path){_68.path="/"+_65.path;}else{if(!_64.path){_68.path=_65.path;}else{_68.path=_64.path.slice(0,_64.path.lastIndexOf("/")+1)+_65.path;}}_68.path=URI.removeDotSegments(_68.path);}_68.query=_65.query;}_68.authority=_64.authority;_68.userinfo=_64.userinfo;_68.host=_64.host;_68.port=_64.port;}_68.scheme=_64.scheme;}_68.fragment=_65.fragment;return _68;};URI.resolve=function(_69,_6a,_6b){return URI.serialize(URI.resolveComponents(URI.parse(_69,_6b),URI.parse(_6a,_6b),_6b,true),_6b);};URI.normalize=function(uri,_6c){if(typeof uri==="string"){return URI.serialize(URI.parse(uri,_6c),_6c);}else{if(_55(uri)==="object"){return URI.parse(URI.serialize(uri,_6c),_6c);}}return uri;};URI.equal=function(_6d,_6e,_6f){if(typeof _6d==="string"){_6d=URI.serialize(URI.parse(_6d,_6f),_6f);}else{if(_55(_6d)==="object"){_6d=URI.serialize(_6d,_6f);}}if(typeof _6e==="string"){_6e=URI.serialize(URI.parse(_6e,_6f),_6f);}else{if(_55(_6e)==="object"){_6e=URI.serialize(_6e,_6f);}}return _6d===_6e;};URI.escapeComponent=function(str){return str&&str.toString().replace(_45,_50);};URI.unescapeComponent=function(str){return str&&str.toString().replace(_48,_53);};exports.Components=_56;exports.URI=URI;exports["URI"]={"SCHEMES":URI.SCHEMES,"parse":URI.parse,"removeDotSegments":URI.removeDotSegments,"serialize":URI.serialize,"resolveComponents":URI.resolveComponents,"resolve":URI.resolve,"normalize":URI.normalize,"equal":URI.equal,"escapeComponent":URI.escapeComponent,"unescapeComponent":URI.unescapeComponent};}());}};});