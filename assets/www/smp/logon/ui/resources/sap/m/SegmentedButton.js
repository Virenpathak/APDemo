/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.SegmentedButton");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.SegmentedButton",{metadata:{publicMethods:["createButton"],library:"sap.m",properties:{"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"enabled":{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"buttons",aggregations:{"buttons":{type:"sap.m.Button",multiple:true,singularName:"button"}},associations:{"selectedButton":{type:"sap.m.Button",multiple:false}},events:{"select":{}}}});sap.m.SegmentedButton.M_EVENTS={'select':'select'};jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");jQuery.sap.require("sap.ui.core.EnabledPropagator");sap.ui.core.EnabledPropagator.call(sap.m.SegmentedButton.prototype);
sap.m.SegmentedButton.prototype.init=function(){if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<=10){this._isMie=true}this._aButtonWidth=[];this._oGhostButton;var s=this;this._createGhostButton();this._oItemNavigation=new sap.ui.core.delegate.ItemNavigation();this._oItemNavigation.setCycling(true);this.addDelegate(this._oItemNavigation);this.removeButton=function(b){sap.m.SegmentedButton.prototype.removeButton.call(this,b);this.setSelectedButton(this.getButtons()[0])}};
sap.m.SegmentedButton.prototype._createGhostButton=function(b){if(jQuery("#segMtBtn_calc").length==0){this._oGhostButton=document.createElement("Button");var s=document.createElement("span");jQuery(s).addClass("sapMBtnContent");this._oGhostButton.appendChild(s);this._oGhostButton.setAttribute("id","segMtBtn_calc");jQuery(this._oGhostButton).addClass("sapMBtn sapMBtnDefault sapMBtnPaddingLeft sapMSegBBtn");this._oGhostButton=jQuery(this._oGhostButton)}else{this._oGhostButton=jQuery("#segMtBtn_calc")}};
sap.m.SegmentedButton.prototype._setGhostButtonText=function(b){var t=b.getText();var g=jQuery("#segMtBtn_calc");if(b.getIcon().length==0&&b.getWidth().length==0){g.find("span").text(t);this._aButtonWidth.push(g.width())}else{this._aButtonWidth.push(0)}};
sap.m.SegmentedButton.prototype._getButtonWidths=function(){var b=this.getButtons();var s=this;if(s._oGhostButton.length==0){return}else{for(var i=0;i<b.length;i++){s._setGhostButtonText(b[i])}}};
sap.m.SegmentedButton.prototype.onBeforeRendering=function(){this._aButtonWidth=[];var s=sap.ui.getCore().getStaticAreaRef();if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(jQuery("#segMtBtn_calc").length==0){s.appendChild(this._oGhostButton[0])}};
sap.m.SegmentedButton.prototype.onAfterRendering=function(){if(!this._sResizeListenerId){var p=this.getParent(),P;if(p instanceof sap.ui.core.Control){P=p.getDomRef()}else if(p instanceof sap.ui.core.UIArea){P=p.getRootNode()}if(P){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(P,jQuery.proxy(this._fHandleResize,this))}}this._getButtonWidths();this._bInsidePopup=(this.$().closest(".sapMPopup-CTX").length>0);this._bInsideBar=(this.$().closest('.sapMIBar').length>0)?true:false;var b=this.getButtons();var a=true;var s=this;for(var i=0;i<b.length;i++){if(b[i].getIcon()==""){a=false}}if(a){this.$().toggleClass("sapMSegBIcons",true)}if(this._isMie){setTimeout(function(){s._fCalcBtnWidth()},0)}else{s._fCalcBtnWidth()}this.$().removeClass("sapMSegBHide");this._setItemNavigation()};
sap.m.SegmentedButton.prototype.onThemeChanged=function(e){};
sap.m.SegmentedButton.prototype._fCalcBtnWidth=function(){var I=this.getButtons().length;if(I===0||!this.$().is(":visible")){return}var m=5,$=this.$(),p=0,c=$.outerWidth(true)-$.width(),a=$.children('#'+this.getButtons()[0].getId()).outerWidth(true)-$.children('#'+this.getButtons()[0].getId()).width();p=(jQuery(window).width()<$.parent().outerWidth())?jQuery(window).width():(this._bInsideBar?$.closest('.sapMBar').width():$.parent().width());if(this.getWidth()&&this.getWidth().indexOf("%")===-1){m=parseInt(this.getWidth());var C=I;for(var i=0;i<I;i++){var w=this.getButtons()[i].getWidth();if(w.length>0&&w.indexOf("%")===-1){m=m-parseInt(w);C--}}m=m/C;m=m-a}else{m=Math.max.apply(null,this._aButtonWidth);if(((p-c)>m*I)&&this.getWidth().indexOf("%")===-1){m=m}else{m=(p-c)/I;m=m-a}}for(var i=0;i<I;i++){if(!isNaN(m)&&m>0){m=this._isMie&&!this._bInsidePopup?m+2:m;if(this.getButtons()[i].getWidth().length>0){var b=this.getButtons()[i].getWidth();var W=b.indexOf("%")==-1?(parseInt(b)-a):b;$.children('#'+this.getButtons()[i].getId()).width(W)}else{$.children('#'+this.getButtons()[i].getId()).width(m)}}}};
sap.m.SegmentedButton.prototype._fHandleResize=function(){this._fCalcBtnWidth()};
sap.m.SegmentedButton.prototype.exit=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(this._oGhostButton){jQuery("#segMtBtn_calc").remove();this._oGhostButton=null}if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}};
sap.m.SegmentedButton.prototype._setItemNavigation=function(){var b,d=this.getDomRef();if(d){this._oItemNavigation.setRootDomRef(d);b=d.getElementsByTagName("li");this._oItemNavigation.setItemDomRefs(b);this._focusSelectedButton()}};
sap.m.SegmentedButton.prototype.createButton=function(t,u,e){var b=new sap.m.Button();if(u===null&&t!==null){b.setText(t)}else if(u!==null&&t===null){b.setIcon(u)}else throw new Error("in control: "+this.toString()+": method createButton() just accepts text or icon");if(e||e===undefined){b.setEnabled(true)}else{b.setEnabled(false)}this.addButton(b);return b};
(function(){sap.m.SegmentedButton.prototype.addButton=function(b){if(b){p(b,this);this.addAggregation('buttons',b);return this}};sap.m.SegmentedButton.prototype.insertButton=function(b){if(b){p(b,this);this.insertAggregation('buttons',b);return this}};function p(b,P){b.attachPress(function(e){P._buttonPressed(e)});var o=sap.m.Button.prototype.setEnabled;b.setEnabled=function(e){b.$().toggleClass("sapMSegBBtnDis",!e).toggleClass("sapMFocusable",e);o.apply(b,arguments)}}})();
sap.m.SegmentedButton.prototype.removeButton=function(b){if(b){delete b.setEnabled;this.removeAggregation("buttons",b)}};
sap.m.SegmentedButton.prototype.removeAllButtons=function(){var b=this.getButtons();if(b){for(var i=0;i<b.length;i++){var B=b[i];if(B){delete B.setEnabled;this.removeAggregation("buttons",B)}}}};
sap.m.SegmentedButton.prototype._buttonPressed=function(e){var l=this.getSelectedButton(),c=e.getSource();if(l!==c.getId()){c.$().addClass("sapMSegBBtnSel");sap.ui.getCore().byId(l).$().removeClass("sapMSegBBtnSel");this.setAssociation('selectedButton',c,true);this.fireSelect({button:c,id:c.getId()})}};
sap.m.SegmentedButton.prototype.setSelectedButton=function(b){var o=this.getSelectedButton();this.setAssociation("selectedButton",b,true);if(o!==this.getSelectedButton()){if(typeof b==="string"){b=sap.ui.getCore().byId(b)}this.getButtons().forEach(function(B){B.$().removeClass("sapMSegBBtnSel")});if(b){b.$().addClass("sapMSegBBtnSel")}this._focusSelectedButton()}};
sap.m.SegmentedButton.prototype._focusSelectedButton=function(){var b=this.getButtons();var s=this.getSelectedButton();for(var i=0;i<b.length;i++){if(b[i]&&b[i].getId()===s){this._oItemNavigation.setFocusedIndex(i);break}}};
