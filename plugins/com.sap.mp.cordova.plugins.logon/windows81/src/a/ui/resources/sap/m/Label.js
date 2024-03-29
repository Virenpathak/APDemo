/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Label");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Label",{metadata:{interfaces:["sap.ui.core.Label"],library:"sap.m",properties:{"design":{type:"sap.m.LabelDesign",group:"Appearance",defaultValue:sap.m.LabelDesign.Standard},"text":{type:"string",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"textAlign":{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},"textDirection":{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},"required":{type:"boolean",group:"Misc",defaultValue:false}},associations:{"labelFor":{type:"sap.ui.core.Control",multiple:false}}}});
sap.m.Label.prototype.getLabelForRendering=function(){return this.getLabelFor()};
sap.m.Label.prototype.setText=function(t){var v=this.getText();if(v!=t){this.setProperty("text",t,true);this.$().html(jQuery.sap.encodeHTML(this.getProperty("text")))}return this};
