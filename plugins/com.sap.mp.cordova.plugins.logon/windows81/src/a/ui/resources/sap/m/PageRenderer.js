/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.PageRenderer");sap.m.PageRenderer={};
sap.m.PageRenderer.render=function(r,p){var h=null,f=null,e=p.getEnableScrolling()?" sapMPageScrollEnabled":"";if(p.getShowHeader()){h=p._getAnyHeader()}var s=p.getSubHeader();if(p.getShowFooter()){f=p.getFooter()}r.write("<div");r.writeControlData(p);r.addClass("sapMPage");r.addClass("sapMPageBg"+p.getBackgroundDesign());if(h){r.addClass("sapMPageWithHeader")}if(s){r.addClass("sapMPageWithSubHeader")}if(f){r.addClass("sapMPageWithFooter")}r.writeClasses();var t=p.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t)}r.write(">");this.renderBarControl(r,h,{context:"header",styleClass:"sapMPageHeader"});this.renderBarControl(r,s,{context:"subheader",styleClass:"sapMPageSubHeader"});r.write('<section id="'+p.getId()+'-cont">');r.write('<div id="'+p.getId()+'-scroll" class="sapMPageScroll'+e+'">');var c=p.getContent();var l=c.length;for(var i=0;i<l;i++){r.renderControl(c[i])}r.write("</div>");r.write("</section>");this.renderBarControl(r,f,{context:"footer",styleClass:"sapMPageFooter"});r.write("</div>")};
sap.m.PageRenderer.renderBarControl=function(r,b,o){if(!b){return}b.applyTagAndContextClassFor(o.context);b.addStyleClass(o.styleClass);r.renderControl(b)};
