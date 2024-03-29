/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var L={};(function(){L.render=function(R,c){R.write("<div");R.writeControlData(c);R.addClass("sapUiLocalBusyIndicator");R.writeClasses();R.write(">");r(R,c);R.write("</div>")};var r=function(R,c){var I=c.getId();var s=I+"-animation";var b=["-leftBox","-middleBox","-rightBox"];R.write('<div');R.writeAttribute('id',s);R.addClass("sapUiLocalBusyIndicatorAnimation");R.writeClasses();R.write(">");for(var i=0;i<b.length;i++){R.write('<div');R.addClass("sapUiLocalBusyIndicatorBox");R.writeClasses();R.writeAttribute("id",I+b[i]);R.write(">");R.write("</div>")}R.write("</div>")}}());return L},true);
