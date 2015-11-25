/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.ui.core.Renderer");jQuery.sap.require("sap.m.ListBaseRenderer");jQuery.sap.declare("sap.m.TableRenderer");sap.m.TableRenderer=sap.ui.core.Renderer.extend(sap.m.ListBaseRenderer);
sap.m.TableRenderer.renderColumns=function(r,t,a){var i=0,h=0,b=false,c=false,m=t.getMode(),d="sapMListTbl",e=t.getId("tbl"),f=(a=="Head")?"th":"td",g="t"+a.toLowerCase(),C=t.getColumns(),j=(a=="Head")&&C.every(function(o){return!o.getHeader()||!o.getVisible()||o.isPopin()||o.isNeverVisible()||o.isHidden()}),k=(a=="Head")&&C.filter(function(o){return o.getVisible()&&!o.isPopin()&&!o.isNeverVisible()&&!o.isHidden()}).length==1,l=function(n,o){r.write("<");r.write(f);o&&r.writeAttribute("id",e+o);r.addClass(d+n);r.writeClasses();r.write("></");r.write(f);r.write(">");i++};r.write("<"+g+">");r.write("<tr");r.writeAttribute("tabindex",-1);r.writeAttribute("id",t.addNavSection(e+a+"er"));if(j){r.addClass("sapMListTblHeaderNone")}else{r.addClass("sapMListTblRow sapMListTbl"+a+"er")}r.writeClasses();r.write(">");if(m!="None"&&m!="SingleSelect"&&m!="Delete"){if(m=="SingleSelectMaster"){l("None");h++}else if(m=="MultiSelect"&&a=="Head"&&!j){r.write("<th class='"+d+"SelCol'><div class='sapMLIBSelectM'>");r.renderControl(t._getSelectAllCheckbox());r.write("</div></th>");i++}else{l("SelCol")}}if(sap.ui.core.theming.Parameters.get("sapUiLIUnreadAsBubble")=="true"&&t.getShowUnread()){l("UnreadCol")}C.forEach(function(o,n){o.setIndex(-1);o.setInitialOrder(n)});t.getColumns(true).forEach(function(o,n){if(!o.getVisible()){return}if(o.isPopin()){b=true;return}if(o.isNeverVisible()){return}if(o.isHidden()){h++}var p=o["get"+a+"er"](),w=k?"":o.getWidth(),q=o.getStyleClass(true);r.write("<"+f);q&&r.addClass(q);r.addClass(d+"Cell");r.addClass(d+a+"erCell");r.writeAttribute("id",e+a+i);r.writeAttribute("data-sap-orig-width",o.getWidth());w&&r.addStyle("width",w);r.addStyle("text-align",o.getCssAlign());r.writeClasses();r.writeStyles();r.write(">");if(p){o.applyAlignTo(p);r.renderControl(p)}if(a=="Head"&&!c){c=!!o.getFooter()}r.write("</"+f+">");o.setIndex(i++)});l("NavCol",a+"Nav");if(m=="SingleSelect"||m=="Delete"){l("SelCol")}r.write("</tr></"+g+">");if(a=="Head"){t._hasPopin=b;t._colCount=i-h;t._hasFooter=c;t._headerHidden=j}};
sap.m.TableRenderer.renderContainerAttributes=function(r,c){c._bRendering=true;r.addClass("sapMListTblCnt")};
sap.m.TableRenderer.renderListStartAttributes=function(r,c){r.write("<table");r.addClass("sapMListTbl");r.addStyle("table-layout",c.getFixedLayout()?"fixed":"auto")};
sap.m.TableRenderer.renderListHeadAttributes=function(r,c){this.renderColumns(r,c,"Head");r.write("<tbody");r.writeAttribute("id",c.addNavSection(c.getId("tblBody")));r.write(">")};
sap.m.TableRenderer.renderListEndAttributes=function(r,c){r.write("</tbody>");c._hasFooter&&this.renderColumns(r,c,"Foot");c._bRendering=false;r.write("</table>")};
sap.m.TableRenderer.renderNoData=function(r,c){r.write("<tr");r.writeAttribute("id",c.getId("nodata"));r.addClass("sapMLIB sapMListTblRow sapMLIBTypeInactive");if(!c._headerHidden||(!c.getHeaderText()&&!c.getHeaderToolbar())){r.addClass("sapMLIBShowSeparator")}r.writeClasses();r.write("><td");r.writeAttribute("id",c.getId("nodata-text"));r.writeAttribute("colspan",c.getColCount());r.addClass("sapMListTblCell sapMListTblCellNoData");r.writeClasses();r.write(">");r.writeEscaped(c.getNoDataText());r.write("</td></tr>")};
