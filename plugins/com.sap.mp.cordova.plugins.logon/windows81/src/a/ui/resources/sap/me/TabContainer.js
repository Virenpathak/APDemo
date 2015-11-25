/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.me.TabContainer");jQuery.sap.require("sap.me.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.me.TabContainer",{metadata:{deprecated:true,library:"sap.me",properties:{"selectedTab":{type:"int",group:"Data",defaultValue:null},"badgeInfo":{type:"int",group:"Data",defaultValue:null},"badgeNotes":{type:"int",group:"Data",defaultValue:null},"badgeAttachments":{type:"int",group:"Data",defaultValue:null},"badgePeople":{type:"int",group:"Data",defaultValue:null},"expandable":{type:"boolean",group:"Misc",defaultValue:true},"expanded":{type:"boolean",group:"Misc",defaultValue:true},"visible":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"tabs":{type:"sap.ui.core.Icon",multiple:true,singularName:"tab",visibility:"hidden"},"contentInfo":{type:"sap.ui.core.Control",multiple:false},"contentAttachments":{type:"sap.ui.core.Control",multiple:false},"contentNotes":{type:"sap.ui.core.Control",multiple:false},"contentPeople":{type:"sap.ui.core.Control",multiple:false},"badges":{type:"sap.ui.core.Control",multiple:true,singularName:"badge",visibility:"hidden"}},events:{"select":{allowPreventDefault:true},"expand":{},"collapse":{}}}});sap.me.TabContainer.M_EVENTS={'select':'select','expand':'expand','collapse':'collapse'};jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.ui.core.theming.Parameters");
sap.me.TabContainer.prototype.init=function(){this.addAggregation("tabs",this._createButton("Info"));this.addAggregation("tabs",this._createButton("Notes"));this.addAggregation("tabs",this._createButton("Attachments"));this.addAggregation("tabs",this._createButton("People"));sap.ui.core.IconPool.insertFontFaceStyle();this._bFirstRendering=true};
sap.me.TabContainer.prototype.setBadgeInfo=function(v){this._setBadgeLabelByName("badgeInfo",v)};
sap.me.TabContainer.prototype.setBadgeAttachments=function(v){this._setBadgeLabelByName("badgeAttachments",v)};
sap.me.TabContainer.prototype.setBadgeNotes=function(v){this._setBadgeLabelByName("badgeNotes",v)};
sap.me.TabContainer.prototype.setBadgePeople=function(v){this._setBadgeLabelByName("badgePeople",v)};
sap.me.TabContainer.prototype.onBeforeRendering=function(){if(this.getSelectedTab()==undefined){this.setProperty("selectedTab",0,true)}};
sap.me.TabContainer.prototype._setBadgeLabelByName=function(n,v){var l=sap.ui.getCore().byId(this.getId()+"-"+n);l.setText(v);this.setProperty(n,v);l.toggleStyleClass("sapUIMeTabContainerHiddenBadges",(v==0))};
sap.me.TabContainer.prototype._placeElements=function(){var $=this.$("arrow");var b=this.getAggregation("tabs")[this.getSelectedTab()];if(b&&(b.$().outerWidth()>8)){var l=parseFloat(b.$()[0].offsetLeft)+parseFloat(b.$().outerWidth()/2)-parseFloat($.width()/2);$.css("left",l+"px")}};
sap.me.TabContainer.prototype.onAfterRendering=function(){this.setProperty("expanded",true,true);if(this._bFirstRendering){this._bFirstRendering=false;setTimeout(jQuery.proxy(this._placeElements,this),300)}else{this._placeElements()}};
sap.me.TabContainer.prototype.onThemeChanged=function(){this._placeElements()};
sap.me.TabContainer.prototype.onTransitionEnded=function(){var $=this.$("container");if(this.getExpanded()){this.$("arrow").show();$.css("display","block");this.$().find(".sapUIMeTabContainerContent").removeClass("sapUIMeTabContainerContentClosed")}else{$.css("display","none");this.$().find(".sapUIMeTabContainerContent").addClass("sapUIMeTabContainerContentClosed")}};
sap.me.TabContainer.prototype.toggleExpandCollapse=function(){var e=!this.getExpanded();var $=this.$("container");var a=this.$("arrow");if(e){this.$().find(".sapUIMeTabContainerButtons").children().filter(":eq("+this.getSelectedTab()+")").addClass("sapUIMeTabContainerTabSelected");$.slideDown('400',jQuery.proxy(this.onTransitionEnded,this));this.fireExpand()}else{a.hide();this.$().find(".sapUIMeTabContainerTabSelected").removeClass("sapUIMeTabContainerTabSelected");$.slideUp('400',jQuery.proxy(this.onTransitionEnded,this));this.fireCollapse()}this.setProperty("expanded",e,true)};
sap.me.TabContainer.prototype.onButtonTap=function(e){var b=e.getSource();var i=this.indexOfAggregation("tabs",b);if(i==this.getSelectedTab()&&this.getExpandable()){this.toggleExpandCollapse()}else{this.setProperty("expanded",true,true);var B=b.getId();var c=this._getContentForBtn(B);if(c){if(this.fireSelect()){this.setSelectedTab(i)}}}};
sap.me.TabContainer.prototype._getContentForBtn=function(b){var i=this.getId()+"-";var c=b.substr(b.indexOf(i)+i.length);return this.getAggregation(c)};
sap.me.TabContainer.prototype._getBagdeForBtn=function(b){var i=this.getId()+"-content";var a=b.substr(b.indexOf(i)+i.length);a.charAt(0).toUpperCase();a="badge"+a;return this.getProperty(a)};
sap.me.TabContainer.prototype._getScrollContainer=function(c){return new sap.m.ScrollContainer({content:c})};
sap.me.TabContainer.prototype._createButton=function(i){var I=sap.ui.core.theming.Parameters.get("sapMeTabIcon"+i);var u=sap.ui.core.IconPool.getIconURI(I);var c=sap.ui.core.theming.Parameters.get("sapMeTabColor"+i);var b=new sap.ui.core.Icon(this.getId()+'-content'+i,{src:u,backgroundColor:c,activeColor:sap.ui.core.theming.Parameters.get("sapUiIconInverted")});b.addStyleClass("sapUIMeTabContainerBtn");b.addStyleClass("sapUIMeTabContainerBtn"+i);b.attachPress(this.onButtonTap,this);var l=new sap.m.Label(this.getId()+'-badge'+i,{textAlign:"Center"});l.addStyleClass("sapUIMeTabContainerBadge");l.addStyleClass("sapUIMeTabContainerBadge"+i);this.addAggregation("badges",l);return b};