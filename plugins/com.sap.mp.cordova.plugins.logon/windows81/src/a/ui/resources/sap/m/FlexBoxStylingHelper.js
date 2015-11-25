/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.m.FlexBoxCssPropertyMap");if(jQuery.support.useFlexBoxPolyfill){jQuery.sap.require("sap.ui.thirdparty.flexie")}jQuery.sap.declare("sap.m.FlexBoxStylingHelper");sap.m.FlexBoxStylingHelper={};
sap.m.FlexBoxStylingHelper.setFlexBoxStyles=function(r,c){var d;var i=c.getDisplayInline();var D=c.getDirection().replace(/\W+/g,"-").replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase();var f=c.getFitContainer();var j=c.getJustifyContent().replace(/\W+/g,"-").replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase();var a=c.getAlignItems().replace(/\W+/g,"-").replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase();if(i){d="inline-flex"}else{d="flex"}if(f&&!(c.getParent()instanceof sap.m.FlexBox)){if(c.getParent()instanceof sap.m.Page){var $=c.getParent().$();$.find("sapMPageScroll").height("100%")}r.addStyle("width","auto");r.addStyle("height","100%")}if(j==="start"||j==="end"){j="flex-"+j}if(a==="start"||a==="end"){a="flex-"+a}sap.m.FlexBoxStylingHelper.setStyle(r,c,"display",d);if(D!=="row"){sap.m.FlexBoxStylingHelper.setStyle(r,c,"flex-direction",D)}if(j!=="flex-start"){sap.m.FlexBoxStylingHelper.setStyle(r,c,"justify-content",j)}if(a!=="stretch"){sap.m.FlexBoxStylingHelper.setStyle(r,c,"align-items",a)}};
sap.m.FlexBoxStylingHelper.setFlexItemStyles=function(r,l){var o="";var g="";var a="";o=l.getOrder();if(o){sap.m.FlexBoxStylingHelper.setStyle(r,null,"order",o)}g=l.getGrowFactor();if(g!==undefined){sap.m.FlexBoxStylingHelper.setStyle(r,null,"flex-grow",g)}a=l.getAlignSelf().toLowerCase();if(a==="start"||a==="end"){a="flex-"+a}if(a&&a!=="auto"){sap.m.FlexBoxStylingHelper.setStyle(r,null,"align-self",a)}};
sap.m.FlexBoxStylingHelper.setStyle=function(r,c,p,v){if(typeof(v)==="string"){v=v.toLowerCase()}var V="";if(jQuery.support.flexBoxPrefixed){if(sap.ui.Device.browser.webkit){V="-webkit-"}else if(jQuery.browser.mozilla){V="-moz-"}else if(sap.ui.Device.browser.internet_explorer){V="-ms-"}}if(jQuery.support.newFlexBoxLayout){sap.m.FlexBoxStylingHelper.setFinalSpecStyle(r,c,p,v,V)}else if(jQuery.support.flexBoxLayout||jQuery.support.ie10FlexBoxLayout){sap.m.FlexBoxStylingHelper.setOldSpecStyle(r,c,p,v,V)}};
sap.m.FlexBoxStylingHelper.setFinalSpecStyle=function(r,c,p,v,V){if(jQuery.support.flexBoxPrefixed){sap.m.FlexBoxStylingHelper.writeStyle(r,c,p,v,V)}sap.m.FlexBoxStylingHelper.writeStyle(r,c,p,v)};
sap.m.FlexBoxStylingHelper.setOldSpecStyle=function(r,c,p,v,V){var s="";if(V=="-ms-"){s="specie10"}else{s="spec0907"}if(sap.m.FlexBoxCssPropertyMap[s][p]!==null&&sap.m.FlexBoxCssPropertyMap[s][p]!=="<idem>"){var l=null;if(typeof(sap.m.FlexBoxCssPropertyMap[s][p])==="object"){if(sap.m.FlexBoxCssPropertyMap[s][p]["<number>"]){l=sap.m.FlexBoxCssPropertyMap[s][p]["<number>"];for(var k in l){l[k]=v}}else{l=sap.m.FlexBoxCssPropertyMap[s][p][v]}}else{l=sap.m.FlexBoxCssPropertyMap[s][p][v]}if(l!==null&&l!=="<idem>"){if(typeof(l)==="object"){for(var L in l){sap.m.FlexBoxStylingHelper.writeStyle(r,c,L,l[L],V)}}}}};
sap.m.FlexBoxStylingHelper.writeStyle=function(r,c,p,v,V){var P="";var s="";V=typeof V!=="undefined"?V:"";if(p!=="display"){P=V}else{s=V}if(r){r.addStyle(P+p,s+v)}else{jQuery(c).css(P+p,s+v)}};
sap.m.FlexBoxStylingHelper.applyFlexBoxPolyfill=function(i,s){if(!jQuery.support.useFlexBoxPolyfill){jQuery.sap.log.warning("FlexBox Polyfill is not being used");return}var j={Start:"start",Center:"center",End:"end",SpaceBetween:"justify"};var a={Start:"start",Center:"center",End:"end",Stretch:"stretch"};var o="";var d="";switch(s.direction){case"Column":o="vertical";d="normal";break;case"RowReverse":o="horizontal";d="reverse";break;case"ColumnReverse":o="vertical";d="reverse";break;case"Row":default:o="horizontal";d="normal"}var b=new window.Flexie.box({target:document.getElementById(i),orient:o,align:a[s.alignItems],direction:d,pack:j[s.justifyContent],flexMatrix:s.flexMatrix,ordinalMatrix:s.ordinalMatrix,dynamic:true});return b};
