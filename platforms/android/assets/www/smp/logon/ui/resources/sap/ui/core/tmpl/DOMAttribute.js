/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['sap/ui/core/library','sap/ui/core/Element'],function(){"use strict";sap.ui.core.Element.extend("sap.ui.core.tmpl.DOMAttribute",{metadata:{library:"sap.ui.core",properties:{"name":{type:"string",group:"Data",defaultValue:null},"value":{type:"string",group:"Data",defaultValue:null}}}});sap.ui.core.tmpl.DOMAttribute.prototype.setValue=function(v){this.setProperty("value",v,true);var p=this.getParent(),$=p&&p.$();if($&&$.length>0){$.attr(this.getName(),this.getProperty("value"))}return this};return sap.ui.core.tmpl.DOMAttribute},true);
