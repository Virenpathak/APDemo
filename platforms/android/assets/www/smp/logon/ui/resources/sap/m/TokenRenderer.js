/*!

* SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved

*/
jQuery.sap.declare("sap.m.TokenRenderer");sap.m.TokenRenderer={};
sap.m.TokenRenderer.render=function(r,c){r.write("<div tabindex=\"-1\"");r.writeControlData(c);r.addClass("sapMToken");r.writeClasses();r.write(">");sap.m.TokenRenderer._renderInnerControl(r,c);if(c.getEditable()){r.renderControl(c._deleteIcon)}r.write("</div>")};
sap.m.TokenRenderer._renderInnerControl=function(r,c){r.write("<span class=\"sapMTokenText\">");var t=c.getText();if(t){r.writeEscaped(t)}r.write("</span>")};
