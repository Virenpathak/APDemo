/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/LocaleData'],function(q,L){"use strict";var N=sap.ui.base.Object.extend("sap.ui.core.format.NumberFormat",{constructor:function(f){throw new Error()}});N.INTEGER=0;N.FLOAT=1;N.CURRENCY=2;N.PERCENT=3;N.oDefaultIntegerFormat={minIntegerDigits:1,maxIntegerDigits:99,minFractionDigits:0,maxFractionDigits:0,groupingEnabled:false,groupingSeparator:",",decimalSeparator:".",plusSign:"+",minusSign:"-",isInteger:true,type:N.INTEGER,showMeasure:false};N.oDefaultFloatFormat={minIntegerDigits:1,maxIntegerDigits:99,minFractionDigits:0,maxFractionDigits:99,groupingEnabled:true,groupingSeparator:",",decimalSeparator:".",plusSign:"+",minusSign:"-",isInteger:false,type:N.FLOAT,showMeasure:false};N.oDefaultCurrencyFormat={minIntegerDigits:1,maxIntegerDigits:99,minFractionDigits:2,maxFractionDigits:2,groupingEnabled:true,groupingSeparator:",",decimalSeparator:".",plusSign:"+",minusSign:"-",isInteger:false,type:N.CURRENCY,showMeasure:true};N.getInstance=function(f,l){return this.getFloatInstance(f,l)};N.getFloatInstance=function(f,l){var F=this.createInstance(f,l),o=this.getLocaleFormatOptions(F.oLocaleData,N.FLOAT);F.oFormatOptions=q.extend(false,{},this.oDefaultFloatFormat,o,f);if(f&&f.pattern){F.oFormatOptions=q.extend(false,F.oFormatOptions,this.parseNumberPattern(f.pattern))}return F};N.getIntegerInstance=function(f,l){var F=this.createInstance(f,l),o=this.getLocaleFormatOptions(F.oLocaleData,N.INTEGER);F.oFormatOptions=q.extend(false,{},this.oDefaultIntegerFormat,o,f);if(f&&f.pattern){F.oFormatOptions=q.extend(false,F.oFormatOptions,this.parseNumberPattern(f.pattern))}return F};N.getCurrencyInstance=function(f,l){var F=this.createInstance(f,l),o=this.getLocaleFormatOptions(F.oLocaleData,N.CURRENCY);F.oFormatOptions=q.extend(false,{},this.oDefaultCurrencyFormat,o,f);if(f&&f.pattern){F.oFormatOptions=q.extend(false,F.oFormatOptions,this.parseNumberPattern(f.pattern))}return F};N.createInstance=function(f,l){var F=q.sap.newObject(this.prototype);if(f instanceof sap.ui.core.Locale){l=f;f=undefined}if(!l){l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()}F.oLocale=l;F.oLocaleData=L.getInstance(l);return F};N.getLocaleFormatOptions=function(l,t){var o={},n;if(t==N.CURRENCY){n=l.getCurrencyPattern();o=this.parseNumberPattern(n)}o.plusSign=l.getNumberSymbol("plusSign");o.minusSign=l.getNumberSymbol("minusSign");o.decimalSeparator=l.getNumberSymbol("decimal");o.groupingSeparator=l.getNumberSymbol("group");o.pattern=n;return o};N.parseNumberPattern=function(f){var m=0;var M=0;var a=0;var g=false;var s=0;for(var i=0;i<f.length;i++){var c=f[i];if(c===","){g=true;continue}else if(c==="."){s=1;continue}else if(s==0&&c==="0"){m++}else if(s==1){if(c==="0"){M++;a++}else if(c==="#"){a++}}}return{minIntegerDigits:m,minFractionDigits:M,maxFractionDigits:a,groupingEnabled:g}};N.prototype.format=function(v,m){var n=this.convertToDecimal(v),i="",f="",g="",r="",p=0,l=0,b=v<0,d=-1,o=this.oFormatOptions;if(n=="NaN"){return n}if(o.type==N.CURRENCY){var D=this.oLocaleData.getCurrencyDigits(m);o.maxFractionDigits=D;o.minFractionDigits=D}if(b){n=n.substr(1)}d=n.indexOf(".");if(d>-1){i=n.substr(0,d);f=n.substr(d+1)}else{i=n}if(i.length<o.minIntegerDigits){i=q.sap.padLeft(i,"0",o.minIntegerDigits)}else if(i.length>o.maxIntegerDigits){i=q.sap.padLeft("","?",o.maxIntegerDigits)}if(f.length<o.minFractionDigits){f=q.sap.padRight(f,"0",o.minFractionDigits)}else if(f.length>o.maxFractionDigits){f=f.substr(0,o.maxFractionDigits)}l=i.length;if(o.groupingEnabled&&l>3){p=l%3||3;g=i.substr(0,p);while(p<i.length){g+=o.groupingSeparator;g+=i.substr(p,3);p+=3}i=g}if(b){r=o.minusSign}r+=i;if(f){r+=o.decimalSeparator+f}if(m&&o.showMeasure){if(o.type==N.CURRENCY){var c='\u00a4';var P=o.pattern;P=P.replace(/\u00a4/,this.oLocaleData.getCurrencySymbol(m));P=P.replace(/[0#.,]+/,r);r=P}}if(sap.ui.getCore().getConfiguration().getOriginInfo()){r=new String(r);r.originInfo={source:"Common Locale Data Repository",locale:this.oLocale.toString()}}return r};N.prototype.parse=function(v){var o=this.oFormatOptions,r="^\\s*([+-]?(?:[0-9\\"+o.groupingSeparator+"]+|[0-9\\"+o.groupingSeparator+"]*\\"+o.decimalSeparator+"[0-9]+)([eE][+-][0-9]+)?)\\s*$",R="^\\s*([+-]?[0-9\\"+o.groupingSeparator+"]+)\\s*$",g=new RegExp("\\"+o.groupingSeparator,"g"),d=new RegExp("\\"+o.decimalSeparator,"g"),a,b=0;if(o.isInteger){a=new RegExp(R)}else{a=new RegExp(r)}if(!a.test(v)){return NaN}v=v.replace(g,"");if(o.isInteger){b=parseInt(v,10)}else{v=v.replace(d,".");b=parseFloat(v)}return b};N.prototype.convertToDecimal=function(v){var V=""+v,n,b,d,f,e,p;if(V.indexOf("e")==-1&&V.indexOf("E")==-1){return V}var r=V.match(/^([+-]?)((\d+)(?:\.(\d+))?)[eE]([+-]?\d+)$/);n=r[1]=="-";b=r[2].replace(/\./g,"");d=r[3]?r[3].length:0;f=r[4]?r[4].length:0;e=parseInt(r[5],10);if(e>0){if(e<f){p=d+e;V=b.substr(0,p)+"."+b.substr(p)}else{V=b;e-=f;for(var i=0;i<e;i++){V+="0"}}}else{if(-e<d){p=d+e;V=b.substr(0,p)+"."+b.substr(p)}else{V=b;e+=d;for(var i=0;i>e;i--){V="0"+V}V="0."+V}}if(n){V="-"+V}return V};return N},true);
