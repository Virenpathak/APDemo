/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.unified.ContentSwitcherRenderer");sap.ui.unified.ContentSwitcherRenderer={};
sap.ui.unified.ContentSwitcherRenderer.render=function(r,c){var i=c.getId();var a=c.getAnimation();if(!sap.ui.getCore().getConfiguration().getAnimation()){a=sap.ui.unified.ContentSwitcherAnimation.None}var A=c.getActiveContent();r.write("<div");r.writeControlData(c);r.addClass("sapUiUfdCSwitcher");r.addClass("sapUiUfdCSwitcherAnimation"+a);r.writeClasses();r.write(">");r.write("<section id=\""+i+"-content1\" class=\"sapUiUfdCSwitcherContent sapUiUfdCSwitcherContent1"+(A==1?" sapUiUfdCSwitcherVisible":"")+"\">");this.renderContent(r,c.getContent1());r.write("</section>");r.write("<section id=\""+i+"-content2\" class=\"sapUiUfdCSwitcherContent sapUiUfdCSwitcherContent2"+(A==2?" sapUiUfdCSwitcherVisible":"")+"\">");this.renderContent(r,c.getContent2());r.write("</section>");r.write("</div>")};
sap.ui.unified.ContentSwitcherRenderer.renderContent=function(r,c){for(var i=0;i<c.length;++i){r.renderControl(c[i])}};
