
dojo._xdResourceLoaded(function(_1,_2,_3){return {defineResource:function(_4,_5,_6){(function(){var O={},_7=require("./jsv").JSV,_8,_9,_a,_b,_c;_9={"string":function(_d,_e){return _d.getType()==="string";},"number":function(_f,_10){return _f.getType()==="number";},"integer":function(_11,_12){return _11.getType()==="number"&&_11.getValue()%1===0;},"boolean":function(_13,_14){return _13.getType()==="boolean";},"object":function(_15,_16){return _15.getType()==="object";},"array":function(_17,_18){return _17.getType()==="array";},"null":function(_19,_1a){return _19.getType()==="null";},"any":function(_1b,_1c){return true;}};_8=new _7.Environment();_8.setOption("defaultFragmentDelimiter",".");_8.setOption("defaultSchemaURI","http://json-schema.org/schema#");_a=_8.createSchema({"$schema":"http://json-schema.org/hyper-schema#","id":"http://json-schema.org/schema#","type":"object","properties":{"type":{"type":["string","array"],"items":{"type":["string",{"$ref":"#"}]},"optional":true,"uniqueItems":true,"default":"any","parser":function(_1d,_1e){var _1f;if(_1d.getType()==="string"){return _1d.getValue();}else{if(_1d.getType()==="object"){return _1d.getEnvironment().createSchema(_1d,_1e.getEnvironment().findSchema(_1e.resolveURI("#")));}else{if(_1d.getType()==="array"){_1f=_1e.getValueOfProperty("parser");return _7.mapArray(_1d.getProperties(),function(_20){return _1f(_20,_1e);});}}}return "any";},"validator":function(_21,_22,_23,_24,_25,_26,_27){var _28=_7.toArray(_22.getAttribute("type")),x,xl,_29,_2a,_2b;if(_21.getType()!=="undefined"&&_28&&_28.length){_2b=_23.getValueOfProperty("typeValidators")||{};for(x=0,xl=_28.length;x<xl;++x){_29=_28[x];if(_7.isJSONSchema(_29)){_2a=_7.createObject(_24);_2a.errors=[];_2a.validated=_7.clone(_24.validated);if(_29.validate(_21,_2a,_25,_26,_27).errors.length===0){return true;}}else{if(_2b[_29]!==O[_29]&&typeof _2b[_29]==="function"){if(_2b[_29](_21,_24)){return true;}}else{return true;}}}_24.addError(_21,_22,"type","Instance is not a required type",_28);return false;}return true;},"typeValidators":_9},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"optional":true,"default":{},"parser":function(_2c,_2d,arg){var env=_2c.getEnvironment(),_2e=_2d.getEnvironment();if(_2c.getType()==="object"){if(arg){return env.createSchema(_2c.getProperty(arg),_2e.findSchema(_2d.resolveURI("#")));}else{return _7.mapObject(_2c.getProperties(),function(_2f){return env.createSchema(_2f,_2e.findSchema(_2d.resolveURI("#")));});}}return {};},"validator":function(_30,_31,_32,_33,_34,_35,_36){var _37,key;if(_30.getType()==="object"){_37=_31.getAttribute("properties");for(key in _37){if(_37[key]!==O[key]&&_37[key]){_37[key].validate(_30.getProperty(key),_33,_30,_31,key);}}}}},"items":{"type":[{"$ref":"#"},"array"],"items":{"$ref":"#"},"optional":true,"default":{},"parser":function(_38,_39){if(_38.getType()==="object"){return _38.getEnvironment().createSchema(_38,_39.getEnvironment().findSchema(_39.resolveURI("#")));}else{if(_38.getType()==="array"){return _7.mapArray(_38.getProperties(),function(_3a){return _3a.getEnvironment().createSchema(_3a,_39.getEnvironment().findSchema(_39.resolveURI("#")));});}}return _38.getEnvironment().createEmptySchema();},"validator":function(_3b,_3c,_3d,_3e,_3f,_40,_41){var _42,_43,x,xl,_44,_45;if(_3b.getType()==="array"){_42=_3b.getProperties();_43=_3c.getAttribute("items");_45=_3c.getAttribute("additionalProperties");if(_7.typeOf(_43)==="array"){for(x=0,xl=_42.length;x<xl;++x){_44=_43[x]||_45;if(_44!==false){_44.validate(_42[x],_3e,_3b,_3c,x);}else{_3e.addError(_3b,_3c,"additionalProperties","Additional items are not allowed",_44);}}}else{_44=_43||_45;for(x=0,xl=_42.length;x<xl;++x){_44.validate(_42[x],_3e,_3b,_3c,x);}}}}},"optional":{"type":"boolean","optional":true,"default":false,"parser":function(_46,_47){return !!_46.getValue();},"validator":function(_48,_49,_4a,_4b,_4c,_4d,_4e){if(_48.getType()==="undefined"&&!_49.getAttribute("optional")){_4b.addError(_48,_49,"optional","Property is required",false);}},"validationRequired":true},"additionalProperties":{"type":[{"$ref":"#"},"boolean"],"optional":true,"default":{},"parser":function(_4f,_50){if(_4f.getType()==="object"){return _4f.getEnvironment().createSchema(_4f,_50.getEnvironment().findSchema(_50.resolveURI("#")));}else{if(_4f.getType()==="boolean"&&_4f.getValue()===false){return false;}}return _4f.getEnvironment().createEmptySchema();},"validator":function(_51,_52,_53,_54,_55,_56,_57){var _58,_59,_5a,key;if(_51.getType()==="object"){_58=_52.getAttribute("additionalProperties");_59=_52.getAttribute("properties")||{};_5a=_51.getProperties();for(key in _5a){if(_5a[key]!==O[key]&&_5a[key]&&!_59[key]){if(_7.isJSONSchema(_58)){_58.validate(_5a[key],_54,_51,_52,key);}else{if(_58===false){_54.addError(_51,_52,"additionalProperties","Additional properties are not allowed",_58);}}}}}}},"requires":{"type":["string",{"$ref":"#"}],"optional":true,"parser":function(_5b,_5c){if(_5b.getType()==="string"){return _5b.getValue();}else{if(_5b.getType()==="object"){return _5b.getEnvironment().createSchema(_5b,_5c.getEnvironment().findSchema(_5c.resolveURI("#")));}}},"validator":function(_5d,_5e,_5f,_60,_61,_62,_63){var _64;if(_5d.getType()!=="undefined"&&_61&&_61.getType()!=="undefined"){_64=_5e.getAttribute("requires");if(typeof _64==="string"){if(_61.getProperty(_64).getType()==="undefined"){_60.addError(_5d,_5e,"requires","Property requires sibling property \""+_64+"\"",_64);}}else{if(_7.isJSONSchema(_64)){_64.validate(_61,_60);}}}}},"minimum":{"type":"number","optional":true,"parser":function(_65,_66){if(_65.getType()==="number"){return _65.getValue();}},"validator":function(_67,_68,_69,_6a,_6b,_6c,_6d){var _6e,_6f;if(_67.getType()==="number"){_6e=_68.getAttribute("minimum");_6f=_68.getAttribute("minimumCanEqual");if(typeof _6e==="number"&&(_67.getValue()<_6e||(_6f===false&&_67.getValue()===_6e))){_6a.addError(_67,_68,"minimum","Number is less then the required minimum value",_6e);}}}},"maximum":{"type":"number","optional":true,"parser":function(_70,_71){if(_70.getType()==="number"){return _70.getValue();}},"validator":function(_72,_73,_74,_75,_76,_77,_78){var _79,_7a;if(_72.getType()==="number"){_79=_73.getAttribute("maximum");_7a=_73.getAttribute("maximumCanEqual");if(typeof _79==="number"&&(_72.getValue()>_79||(_7a===false&&_72.getValue()===_79))){_75.addError(_72,_73,"maximum","Number is greater then the required maximum value",_79);}}}},"minimumCanEqual":{"type":"boolean","optional":true,"requires":"minimum","default":true,"parser":function(_7b,_7c){if(_7b.getType()==="boolean"){return _7b.getValue();}return true;}},"maximumCanEqual":{"type":"boolean","optional":true,"requires":"maximum","default":true,"parser":function(_7d,_7e){if(_7d.getType()==="boolean"){return _7d.getValue();}return true;}},"minItems":{"type":"integer","optional":true,"minimum":0,"default":0,"parser":function(_7f,_80){if(_7f.getType()==="number"){return _7f.getValue();}return 0;},"validator":function(_81,_82,_83,_84,_85,_86,_87){var _88;if(_81.getType()==="array"){_88=_82.getAttribute("minItems");if(typeof _88==="number"&&_81.getProperties().length<_88){_84.addError(_81,_82,"minItems","The number of items is less then the required minimum",_88);}}}},"maxItems":{"type":"integer","optional":true,"minimum":0,"parser":function(_89,_8a){if(_89.getType()==="number"){return _89.getValue();}},"validator":function(_8b,_8c,_8d,_8e,_8f,_90,_91){var _92;if(_8b.getType()==="array"){_92=_8c.getAttribute("maxItems");if(typeof _92==="number"&&_8b.getProperties().length>_92){_8e.addError(_8b,_8c,"maxItems","The number of items is greater then the required maximum",_92);}}}},"pattern":{"type":"string","optional":true,"format":"regex","parser":function(_93,_94){if(_93.getType()==="string"){try{return new RegExp(_93.getValue());}catch(e){return e;}}},"validator":function(_95,_96,_97,_98,_99,_9a,_9b){var _9c;try{_9c=_96.getAttribute("pattern");if(_9c instanceof Error){_98.addError(_95,_96,"pattern","Invalid pattern",_9c);}else{if(_95.getType()==="string"&&_9c&&!_9c.test(_95.getValue())){_98.addError(_95,_96,"pattern","String does not match pattern",_9c.toString());}}}catch(e){_98.addError(_95,_96,"pattern","Invalid pattern",e);}}},"minLength":{"type":"integer","optional":true,"minimum":0,"default":0,"parser":function(_9d,_9e){if(_9d.getType()==="number"){return _9d.getValue();}return 0;},"validator":function(_9f,_a0,_a1,_a2,_a3,_a4,_a5){var _a6;if(_9f.getType()==="string"){_a6=_a0.getAttribute("minLength");if(typeof _a6==="number"&&_9f.getValue().length<_a6){_a2.addError(_9f,_a0,"minLength","String is less then the required minimum length",_a6);}}}},"maxLength":{"type":"integer","optional":true,"parser":function(_a7,_a8){if(_a7.getType()==="number"){return _a7.getValue();}},"validator":function(_a9,_aa,_ab,_ac,_ad,_ae,_af){var _b0;if(_a9.getType()==="string"){_b0=_aa.getAttribute("maxLength");if(typeof _b0==="number"&&_a9.getValue().length>_b0){_ac.addError(_a9,_aa,"maxLength","String is greater then the required maximum length",_b0);}}}},"enum":{"type":"array","optional":true,"minItems":1,"uniqueItems":true,"parser":function(_b1,_b2){if(_b1.getType()==="array"){return _b1.getValue();}},"validator":function(_b3,_b4,_b5,_b6,_b7,_b8,_b9){var _ba,x,xl;if(_b3.getType()!=="undefined"){_ba=_b4.getAttribute("enum");if(_ba){for(x=0,xl=_ba.length;x<xl;++x){if(_b3.equals(_ba[x])){return true;}}_b6.addError(_b3,_b4,"enum","Instance is not one of the possible values",_ba);}}}},"title":{"type":"string","optional":true},"description":{"type":"string","optional":true},"format":{"type":"string","optional":true,"parser":function(_bb,_bc){if(_bb.getType()==="string"){return _bb.getValue();}},"validator":function(_bd,_be,_bf,_c0,_c1,_c2,_c3){var _c4,_c5;if(_bd.getType()==="string"){_c4=_be.getAttribute("format");_c5=_bf.getValueOfProperty("formatValidators");if(typeof _c4==="string"&&_c5[_c4]!==O[_c4]&&typeof _c5[_c4]==="function"&&!_c5[_c4].call(this,_bd,_c0)){_c0.addError(_bd,_be,"format","String is not in the required format",_c4);}}},"formatValidators":{}},"contentEncoding":{"type":"string","optional":true},"default":{"type":"any","optional":true},"maxDecimal":{"type":"integer","optional":true,"minimum":0,"parser":function(_c6,_c7){if(_c6.getType()==="number"){return _c6.getValue();}},"validator":function(_c8,_c9,_ca,_cb,_cc,_cd,_ce){var _cf,_d0;if(_c8.getType()==="number"){_cf=_c9.getAttribute("maxDecimal");if(typeof _cf==="number"){_d0=_c8.getValue().toString(10).split(".")[1];if(_d0&&_d0.length>_cf){_cb.addError(_c8,_c9,"maxDecimal","The number of decimal places is greater then the allowed maximum",_cf);}}}}},"disallow":{"type":["string","array"],"items":{"type":"string"},"optional":true,"uniqueItems":true,"parser":function(_d1,_d2){if(_d1.getType()==="string"||_d1.getType()==="array"){return _d1.getValue();}},"validator":function(_d3,_d4,_d5,_d6,_d7,_d8,_d9){var _da=_7.toArray(_d4.getAttribute("disallow")),x,xl,key,_db;if(_d3.getType()!=="undefined"&&_da&&_da.length){_db=_d5.getValueOfProperty("typeValidators")||{};for(x=0,xl=_da.length;x<xl;++x){key=_da[x];if(_db[key]!==O[key]&&typeof _db[key]==="function"){if(_db[key](_d3,_d6)){_d6.addError(_d3,_d4,"disallow","Instance is a disallowed type",_da);return false;}}}return true;}return true;},"typeValidators":_9},"extends":{"type":[{"$ref":"#"},"array"],"items":{"$ref":"#"},"optional":true,"default":{},"parser":function(_dc,_dd){if(_dc.getType()==="object"){return _dc.getEnvironment().createSchema(_dc,_dd.getEnvironment().findSchema(_dd.resolveURI("#")));}else{if(_dc.getType()==="array"){return _7.mapArray(_dc.getProperties(),function(_de){return _de.getEnvironment().createSchema(_de,_dd.getEnvironment().findSchema(_dd.resolveURI("#")));});}}},"validator":function(_df,_e0,_e1,_e2,_e3,_e4,_e5){var _e6=_e0.getAttribute("extends"),x,xl;if(_e6){if(_7.isJSONSchema(_e6)){_e6.validate(_df,_e2,_e3,_e4,_e5);}else{if(_7.typeOf(_e6)==="array"){for(x=0,xl=_e6.length;x<xl;++x){_e6[x].validate(_df,_e2,_e3,_e4,_e5);}}}}}}},"optional":true,"default":{},"fragmentResolution":"dot-delimited","parser":function(_e7,_e8){if(_e7.getType()==="object"){return _e7.getEnvironment().createSchema(_e7,_e8);}},"validator":function(_e9,_ea,_eb,_ec,_ed,_ee,_ef){var _f0=_ea.getPropertyNames(),x,xl,_f1=_eb.getAttribute("properties"),_f2;for(x in _f1){if(_f1[x]!==O[x]&&_f1[x].getValueOfProperty("validationRequired")){_7.pushUnique(_f0,x);}}for(x=0,xl=_f0.length;x<xl;++x){if(_f1[_f0[x]]!==O[_f0[x]]){_f2=_f1[_f0[x]].getValueOfProperty("validator");if(typeof _f2==="function"){_f2(_e9,_ea,_f1[_f0[x]],_ec,_ed,_ee,_ef);}}}},"initializer":function(_f3){var _f4,_f5,_f6;do{_f4=_f3._schema.getLink("full",_f3);if(_f4&&_f3._uri!==_f4&&_f3._env._schemas[_f4]){_f3=_f3._env._schemas[_f4];return _f3;}_f4=_f3._schema.getLink("describedby",_f3);if(_f4&&_f3._schema._uri!==_f4&&_f3._env._schemas[_f4]){_f3._schema=_f3._env._schemas[_f4];continue;}_f5=_f3.getAttribute("extends");if(_7.isJSONSchema(_f5)){_f6=_7.inherits(_f5,_f3,true);_f3=_f3._env.createSchema(_f6,_f3._schema,_f3._uri);}break;}while(true);_f4=_f3._schema.getLink("self",_f3);if(_f4){_f3._uri=_f4;}return _f3;}},true,"http://json-schema.org/schema#");_b=_8.createSchema(_7.inherits(_a,_8.createSchema({"$schema":"http://json-schema.org/hyper-schema#","id":"http://json-schema.org/hyper-schema#","properties":{"links":{"type":"array","items":{"$ref":"links#"},"optional":true,"parser":function(_f7,_f8,arg){var _f9,_fa=_f8.getValueOfProperty("items")["$ref"],_fb=_f8.getEnvironment().findSchema(_fa),_fc=_fb&&_fb.getValueOfProperty("parser");arg=_7.toArray(arg);if(typeof _fc==="function"){_f9=_7.mapArray(_f7.getProperties(),function(_fd){return _fc(_fd,_fb);});}else{_f9=_7.toArray(_f7.getValue());}if(arg[0]){_f9=_7.filterArray(_f9,function(_fe){return _fe["rel"]===arg[0];});}if(arg[1]){_f9=_7.mapArray(_f9,function(_ff){var _100=arg[1],href=_ff["href"];href=href.replace(/\{(.+)\}/g,function(str,p1,_101,s){var _102;if(p1==="-this"){_102=_100.getValue();}else{_102=_100.getValueOfProperty(p1);}return _102!==undefined?String(_102):"";});return href?_7.formatURI(_100.resolveURI(href)):href;});}return _f9;}},"fragmentResolution":{"type":"string","optional":true,"default":"dot-delimited"},"root":{"type":"boolean","optional":true,"default":false},"readonly":{"type":"boolean","optional":true,"default":false},"pathStart":{"type":"string","optional":true,"format":"uri","validator":function(_103,_104,self,_105,_106,_107,name){var _108;if(_103.getType()!=="undefined"){_108=_104.getAttribute("pathStart");if(typeof _108==="string"){if(_103.getURI().indexOf(_108)!==0){_105.addError(_103,_104,"pathStart","Instance's URI does not start with "+_108,_108);}}}}},"mediaType":{"type":"string","optional":true,"format":"media-type"},"alternate":{"type":"array","items":{"$ref":"#"},"optional":true}},"links":[{"href":"{$ref}","rel":"full"},{"href":"{$schema}","rel":"describedby"},{"href":"{id}","rel":"self"}]},_a),true),true,"http://json-schema.org/hyper-schema#");_8.setOption("defaultSchemaURI","http://json-schema.org/hyper-schema#");_c=_8.createSchema({"$schema":"http://json-schema.org/hyper-schema#","id":"http://json-schema.org/links#","type":"object","properties":{"href":{"type":"string"},"rel":{"type":"string"},"method":{"type":"string","default":"GET","optional":true},"enctype":{"type":"string","requires":"method","optional":true},"properties":{"type":"object","additionalProperties":{"$ref":"hyper-schema#"},"optional":true,"parser":function(_109,self,arg){var env=_109.getEnvironment(),_10a=self.getEnvironment(),_10b=self.getValueOfProperty("additionalProperties")["$ref"];if(_109.getType()==="object"){if(arg){return env.createSchema(_109.getProperty(arg),_10a.findSchema(self.resolveURI(_10b)));}else{return _7.mapObject(_109.getProperties(),function(_10c){return env.createSchema(_10c,_10a.findSchema(self.resolveURI(_10b)));});}}}}},"parser":function(_10d,self){var _10e=self.getProperty("properties");if(_10d.getType()==="object"){return _7.mapObject(_10d.getProperties(),function(_10f,key){var _110=_10e.getProperty(key),_111=_110&&_110.getValueOfProperty("parser");if(typeof _111==="function"){return _111(_10f,_110);}return _10f.getValue();});}return _10d.getValue();}},_b,"http://json-schema.org/links#");_a=_8.createSchema(_a.getValue(),_b,"http://json-schema.org/schema#");_b=_8.createSchema(_b.getValue(),_b,"http://json-schema.org/hyper-schema#");_c=_8.createSchema(_c.getValue(),_b,"http://json-schema.org/links#");_7.registerEnvironment("json-schema-draft-00",_8);_7.registerEnvironment("json-schema-draft-01",_7.createEnvironment("json-schema-draft-00"));if(!_7.getDefaultEnvironmentID()){_7.setDefaultEnvironmentID("json-schema-draft-01");}}());}};});