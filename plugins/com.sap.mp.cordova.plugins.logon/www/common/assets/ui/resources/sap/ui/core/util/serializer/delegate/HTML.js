/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Delegate'],function(q,D){"use strict";var H=D.extend("sap.ui.core.util.serializer.delegate.HTML",{constructor:function(g,G){D.apply(this);this._fnGetControlId=g;this._fnGetEventHandlerName=G}});H.prototype.startAggregation=function(c,a){return'<div data-sap-ui-aggregation="'+a+'">'};H.prototype.endAggregation=function(c,a){return'</div>'};H.prototype.start=function(c,a,i){return"<div"};H.prototype.middle=function(c,a,b){var h=[];var I=(this._fnGetControlId)?this._fnGetControlId(c):c.getId();if(I.indexOf("__")!==0){h.push(this._createAttribute("id",I))}h.push(this._createAttribute("data-sap-ui-type",c.getMetadata()._sClassName));if(c.aCustomStyleClasses){var C=c.aCustomStyleClasses;var d=[];for(var i=0;i<C.length;i++){var s=C[i];if(!q.sap.startsWith(s,"sapM")&&!q.sap.startsWith(s,"sapUi")){d.push(s)}}if(d.length>0){h.push(this._createAttribute("class",d.join(" ")))}}if(this._fnGetEventHandlerName){var e=c.getMetadata().getAllEvents();for(var E in e){if(c.hasListeners(E)){var f=c.mEventRegistry[E];for(var i=0;i<f.length;i++){var g=this._fnGetEventHandlerName(f[i]);if(g){h.push(this._createAttribute("data-"+this._createHtmlAttributeName(E),g));break}}}}}var A=c.getMetadata().getAllAssociations();this._createAttributes(h,c,A,function(n,v){if(A[n].multiple){return v.join(" ")}return v},function(n,v){return(v!==null&&typeof v!==undefined&&v!=="")});var p=c.getMetadata().getAllProperties();this._createAttributes(h,c,p,null,function(n,v){return(!!c.getBindingInfo(n)||(v!==null&&typeof v!==undefined&&v!==""))});var o=c.getMetadata().getAllAggregations();this._createAttributes(h,c,o,null,function(n,v){if(!c.getBindingInfo(n)&&(!v||(typeof v!=="string"))){return false}return true});h.push('>');return h.join('')};H.prototype.end=function(c,a,i){return"</div>"};H.prototype._createAttributes=function(h,c,o,g,v){for(var n in o){var p=o[n];var G=p._sGetter;if(c[G]){var V=c[G]();V=g?g(n,V):V;if(!c.getBindingInfo(n)){if(V!==p.defaultValue){if(!v||v(n,V)){h.push(this._createAttribute("data-"+this._createHtmlAttributeName(n),V))}}}else{h.push(this._createDataBindingAttribute(c,n,V))}}}};H.prototype._createDataBindingAttribute=function(c,n,v){var b=c.getBindingInfo(n);var B=null;var p=v;if(!b.bindingString){if(b.binding){var C=b.binding.getMetadata().getName();if(C==="sap.ui.model.PropertyBinding"||C==="sap.ui.model.resource.ResourcePropertyBinding"){B=b.binding.getValue()}}if(b.parts){b=b.parts[0]}var m=b.model;if(B===v||B===null){p="{"+(m?(m+">"+b.path):b.path)+"}"}}else{p=b.bindingString}return this._createAttribute("data-"+this._createHtmlAttributeName(n),p)};H.prototype._createAttribute=function(a,v){return' '+a+'="'+v+'"'};H.prototype._createHtmlAttributeName=function(n){return q.sap.hyphen(n)};return H},true);
