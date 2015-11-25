/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.CustomerContext");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ca.ui.CustomerContext",{metadata:{publicMethods:["setModel","select","change","reset"],library:"sap.ca.ui",properties:{"personalizationPageName":{type:"string",group:"Misc",defaultValue:'AppCustomerContext'},"showSalesArea":{type:"boolean",group:"Misc",defaultValue:false},"path":{type:"string",group:"Misc",defaultValue:'/Customers'},"customerIDProperty":{type:"string",group:"Misc",defaultValue:'CustomerID'},"customerNameProperty":{type:"string",group:"Misc",defaultValue:'CustomerName'},"salesOrganizationNameProperty":{type:"string",group:"Misc",defaultValue:'SalesOrganizationName'},"distributionChannelNameProperty":{type:"string",group:"Misc",defaultValue:'DistributionChannelName'},"divisionNameProperty":{type:"string",group:"Misc",defaultValue:'DivisionName'},"dialogTitle":{type:"string",group:"Misc",defaultValue:null}},events:{"customerSelected":{}}}});sap.ca.ui.CustomerContext.M_EVENTS={'customerSelected':'customerSelected'};
/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.CustomerContext");jQuery.sap.require("sap.m.Dialog");jQuery.sap.require("sap.m.List");jQuery.sap.require("sap.ca.ui.utils.resourcebundle");jQuery.sap.require("sap.ca.ui.CustomerControlListItem");sap.ca.ui.CustomerContext.MODE={Select:'Select',Change:'Change'};
sap.ca.ui.CustomerContext.prototype.init=function(){this._oldValue="";this._oPersService=null;this._bDialogTitleOverriden=false;this._oDialog=new sap.m.Dialog(this.getId()+"-ccDialog",{type:sap.m.DialogType.Standard,contentWidth:"25%",contentHeight:"446px",enableScrolling:false}).addStyleClass("sapCaUiCCD");if(jQuery.device.is.phone){this._oDialog.setStretchOnPhone(true)}this._oButtonOk=new sap.m.Button({text:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.Ok"),press:jQuery.proxy(function(){if(this._oList.getSelectedItem()){var o=this._oList.getSelectedItem().getBindingContext().getProperty();if(this._oPersService){try{var a=this._oPersService.setPersData(JSON.stringify(o));a.done(function(){jQuery.sap.log.info("CustomerContext: Customer '"+JSON.stringify(o)+"' successfully saved")});a.fail(function(e){jQuery.sap.log.error("CustomerContext: Error while saving customer info : "+e.message)})}catch(e){jQuery.sap.log.error("CustomerContext: wasn't able to saved SelectedCustomer on personalization service "+e.message)}}else{jQuery.sap.log.warning("CustomerContext: there is no service defined for saving the SelectedCustomer, did you set the personalizationPageName property? ")}this.fireCustomerSelected(o)}this._oDialog.close()},this)});this._oDialog.setLeftButton(this._oButtonOk);this._oButtonCancel=new sap.m.Button({text:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.Cancel"),press:jQuery.proxy(this._onCancel,this)});this._oDialog.setRightButton(this._oButtonCancel);var p=new sap.m.Page({showHeader:false,contentHeight:"350em",enableScrolling:true});var s=new sap.m.SearchField({placeholder:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.Search"),width:"100%",layoutData:new sap.m.FlexItemData({growFactor:1}),liveChange:jQuery.proxy(this._onLiveSearch,this)});var S=new sap.m.Bar(this._oDialog.getId()+"-searchField",{contentMiddle:[s]});p.setSubHeader(S);this._oList=new sap.m.List({mode:sap.m.ListMode.SingleSelectMaster,noDataText:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.NoData")});this._bindListItems(this.getPath());p.addContent(this._oList);this._oDialog.addContent(p);this._oDialog.attachAfterOpen(jQuery.proxy(function(){if(!this._oList.getSelectedItem()&&this._oList.getItems().length>0){this._oList.setSelectedItem(this._oList.getItems()[0],true)}},this));this._oDialog.setInitialFocus(this._oButtonCancel)};
sap.ca.ui.CustomerContext.prototype.setDialogTitle=function(v,i){this._bDialogTitleOverriden=true;this.setProperty("dialogTitle",v,i)};
sap.ca.ui.CustomerContext.prototype.setPersonalizationPageName=function(v){try{var p=sap.ushell.Container.getService("Personalization");this._oPersService=p.getPersonalizer({container:v,item:"SelectedCustomerContext"})}catch(e){jQuery.sap.log.error("CustomerContext: error while loading personalization service: "+e.message)}this.setProperty("personalizationPageName",v,false)};
sap.ca.ui.CustomerContext.prototype.setShowSalesArea=function(v){var _=this.getShowSalesArea();if(_!==!!v){this.setProperty("showSalesArea",v,false)}};
sap.ca.ui.CustomerContext.prototype.setPath=function(v){this._bindListItems(v);this.setProperty("path",v)};
sap.ca.ui.CustomerContext.prototype.setModel=function(m){if(m instanceof sap.ui.model.odata.ODataModel){m=this._prepareODataForLiveSearch(m)}else if(m instanceof sap.ui.model.json.JSONModel){m=this._prepareJSONForLiveSearch(m)}this._oList.setModel(m)};
sap.ca.ui.CustomerContext.prototype.select=function(){if(!this._oDialog.isOpen()){if(this._oPersService){try{var r=this._oPersService.getPersData();r.done(jQuery.proxy(function(C){if(C&&C!==""){var a=JSON.parse(C);var l=this._oList;var b=this.getCustomerIDProperty();if(this._oList&&this._oList.getItems()&&this._oList.getItems().length>0){jQuery.each(this._oList.getItems(),function(i,o){var c=o.getBindingContext();if(c.getModel().getProperty(c.getPath())[b]==a[b]){l.setSelectedItem(o,true)}})}this.fireCustomerSelected(a)}else{if(this._oList.getItems().length==1){this._oList.setSelectedItem(this._oList.getItems()[0],true);this._oButtonOk.firePress()}else{this._mode=sap.ca.ui.CustomerContext.MODE.Select;if(this._bDialogTitleOverriden){this._oDialog.setTitle(this.getDialogTitle())}else{this._oDialog.setTitle(sap.ca.ui.utils.resourcebundle.getText("CustomerContext.TitleSelect"))}this._oDialog.open()}}},this));r.fail(jQuery.proxy(function(e){jQuery.sap.log.error("CustomerContext: error while using personalization service: "+e.message);this.fireCustomerSelected(null)},this))}catch(e){jQuery.sap.log.error("CustomerContext: error while loading personalization service: "+e.message);this.fireCustomerSelected(null)}}else{jQuery.sap.log.warning("CustomerContext: there is no service defined for saving the SelectedCustomer, did you set the personalizationPageName property? ")}}};
sap.ca.ui.CustomerContext.prototype.change=function(){if(!this._oDialog.isOpen()){this._mode=sap.ca.ui.CustomerContext.MODE.Change;if(this._bDialogTitleOverriden){this._oDialog.setTitle(this.getDialogTitle())}else{this._oDialog.setTitle(sap.ca.ui.utils.resourcebundle.getText("CustomerContext.TitleChange"))}this._oDialog.open()}};
sap.ca.ui.CustomerContext.prototype.reset=function(){if(this._oPersService){try{var s=this._oPersService.setPersData("");s.done(function(){jQuery.sap.log.info("CustomerContext: Customer successfully reset")});s.fail(function(e){jQuery.sap.log.error("CustomerContext: Error while resetting customer context: "+e.message)})}catch(e){jQuery.sap.log.error("CustomerContext: wasn't able to reset SelectedCustomer on personalization service "+e.message)}}else{jQuery.sap.log.error("CustomerContext: there is no service defined for resetting the SelectedCustomer, did you set the personalizationPageName property? ")}};
sap.ca.ui.CustomerContext.prototype._getItemTemplate=function(){var c=new sap.ca.ui.CustomerControlListItem({showSalesArea:this.getShowSalesArea(),customerID:{path:this.getCustomerIDProperty()},customerName:{path:this.getCustomerNameProperty()},salesOrganizationName:{path:this.getSalesOrganizationNameProperty()},distributionChannelName:{path:this.getDistributionChannelNameProperty()},divisionName:{path:this.getDivisionNameProperty()}});return c};
sap.ca.ui.CustomerContext.prototype._onCancel=function(){if(this._mode==sap.ca.ui.CustomerContext.MODE.Select){this.fireCustomerSelected(null)}this._oDialog.close()};
sap.ca.ui.CustomerContext.prototype._prepareJSONForLiveSearch=function(m){var c=this.getPath();if(c.length>1&&c[0]=='/'){c=c.substring(1)}var C=m.getData()[c];for(var i=0;i<C.length;i++){this._enrichModel(C[i])}var j={};j[c]=C;m.setData(j);return m};
sap.ca.ui.CustomerContext.prototype._enrichModel=function(c){c["_searchString"]="";if(c[this.getCustomerNameProperty()]){c["_searchString"]+=c[this.getCustomerNameProperty()]}if(c[this.getCustomerIDProperty()]){c["_searchString"]+=c[this.getCustomerIDProperty()]}if(this.getShowSalesArea()){if(c[this.getSalesOrganizationNameProperty()]){c["_searchString"]+=c[this.getSalesOrganizationNameProperty()]}if(c[this.getDistributionChannelNameProperty()]){c["_searchString"]+=c[this.getDistributionChannelNameProperty()]}if(c[this.getDivisionNameProperty()]){c["_searchString"]+=c[this.getDivisionNameProperty()]}}return c};
sap.ca.ui.CustomerContext.prototype._prepareODataForLiveSearch=function(m){var j=new sap.ui.model.json.JSONModel();var a=[];var J={};var c=this.getPath();if(c.length>1&&c[0]=='/'){c=c.substring(1)}m.read(this.getPath(),null,[],false,jQuery.proxy(function(d){for(var k in d.results){m.oData[c+"('"+d.results[k][this.getCustomerIDProperty()]+"')"]=d.results[k];a.push(this._enrichModel(d.results[k]))}J[c]=a;j.setData(J)},this),function(){});return j};
sap.ca.ui.CustomerContext.prototype._onLiveSearch=function(e){var s=e.getParameter("newValue");var f=[];if(s!=""){f.push(new sap.ui.model.Filter("_searchString",sap.ui.model.FilterOperator.Contains,s));this._oList.getBinding("items").filter(f)}else{if(this._oldValue!=""){this._oList.getBinding("items").filter([])}}this._oldValue=s};
sap.ca.ui.CustomerContext.prototype.exit=function(){if(this._oButtonOk){this._oButtonOk.destroy();this._oButtonOk=null}if(this._oButtonCancel){this._oButtonCancel.destroy();this._oButtonCancel=null}if(this._oDialog){this._oDialog.destroy();this._oDialog=null}};
sap.ca.ui.CustomerContext.prototype._bindListItems=function(p){this._oList.bindItems({path:p,template:this._getItemTemplate()})};
