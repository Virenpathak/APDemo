/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/RenderManager','sap/ui/core/support/Plugin'],function(q,R,P){"use strict";var a=P.extend("sap.ui.core.support.plugins.Performance",{constructor:function(s){P.apply(this,["sapUiSupportPerf","Performance",s]);this._oStub=s;if(this.isToolPlugin()){this._aEventIds=[this.getId()+"SetMeasurements",this.getId()+"SetActive"];q.sap.require("sap.ui.core.format.DateFormat");this._oDateFormat=sap.ui.core.format.DateFormat.getTimeInstance({pattern:"HH:mm:ss '+' SSS"})}else{this._aEventIds=[this.getId()+"Refresh",this.getId()+"Clear",this.getId()+"Start",this.getId()+"Stop",this.getId()+"Activate"]}}});a.prototype.init=function(s){P.prototype.init.apply(this,arguments);if(this.isToolPlugin()){b.call(this,s)}else{c.call(this,s)}};a.prototype.exit=function(s){P.prototype.exit.apply(this,arguments)};function b(s){var r=sap.ui.getCore().createRenderManager();r.write("<div class=\"sapUiSupportToolbar\">");r.write("<button id=\""+this.getId()+"-refresh\" class=\"sapUiSupportBtn\">Refresh</button>");r.write("<button id=\""+this.getId()+"-clear\" class=\"sapUiSupportBtn\">Clear</button>");r.write("<input type=\"checkbox\" id=\""+this.getId()+"-active\" class=\"sapUiSupportChB\">");r.write("<label for=\""+this.getId()+"-active\" class=\"sapUiSupportLabel\">Active</label>");r.write("</div><div class=\"sapUiSupportPerfCntnt\">");r.write("<table id=\""+this.getId()+"-tab\" width=\"100%\">");r.write("<colgroup><col><col><col><col><col><col></colgroup>");r.write("<thead style=\"text-align:left;\"><tr>");r.write("<th>ID</th>");r.write("<th>Info</th>");r.write("<th>Start</th>");r.write("<th>End</th>");r.write("<th>Time</th>");r.write("<th>Duration</th>");r.write("</tr></thead>");r.write("<tbody id=\""+this.getId()+"-tabBody\"></tbody>");r.write("</table></div>");r.flush(this.$().get(0));r.destroy();this.$("refresh").click(q.proxy(function(e){this._oStub.sendEvent(this.getId()+"Refresh")},this));this.$("clear").click(q.proxy(function(e){this._oStub.sendEvent(this.getId()+"Clear")},this));this.$("active").click(q.proxy(function(e){var A=false;if(this.$("active").attr("checked")){A=true}this._oStub.sendEvent(this.getId()+"Activate",{"active":A})},this))};function c(s){g.call(this)};function g(s){var A=q.sap.measure.getActive();var m=new Array();if(A){m=q.sap.measure.getAllMeasurements()}this._oStub.sendEvent(this.getId()+"SetMeasurements",{"measurements":m});this._oStub.sendEvent(this.getId()+"SetActive",{"active":A})};a.prototype.onsapUiSupportPerfSetMeasurements=function(e){var m=e.getParameter("measurements");var t=this.$("tabBody");var r=sap.ui.getCore().createRenderManager();for(var i=0;i<m.length;i++){var M=m[i];r.write("<tr>");r.write("<td>"+M.id+"</td>");r.write("<td>"+M.info+"</td>");r.write("<td>"+this._oDateFormat.format(new Date(M.start))+"</td>");r.write("<td>"+this._oDateFormat.format(new Date(M.end))+"</td>");r.write("<td>"+M.time+"</td>");r.write("<td>"+M.duration+"</td>");r.write("</tr>")}r.flush(t[0]);r.destroy()};a.prototype.onsapUiSupportPerfSetActive=function(e){var A=e.getParameter("active");var C=this.$("active");if(A){C.attr("checked","checked")}else{C.removeAttr("checked")}};a.prototype.onsapUiSupportPerfRefresh=function(e){g.call(this)};a.prototype.onsapUiSupportPerfClear=function(e){q.sap.measure.clear();this._oStub.sendEvent(this.getId()+"SetMeasurements",{"measurements":[]})};a.prototype.onsapUiSupportPerfStart=function(e){q.sap.measure.start(this.getId()+"-perf","Measurement by support tool")};a.prototype.onsapUiSupportPerfEnd=function(e){q.sap.measure.end(this.getId()+"-perf")};a.prototype.onsapUiSupportPerfActivate=function(e){var A=e.getParameter("active");if(q.sap.measure.getActive()!=A){q.sap.measure.setActive(A)}};return a},true);
