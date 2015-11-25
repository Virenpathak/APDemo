jQuery.sap.require("asianpaints.dra.config.global");
jQuery.sap.declare("asianpaints.dra.Component");

sap.ui.core.UIComponent.extend("asianpaints.dra.Component", {
	metadata : {
		routing : {
			config : {
				viewType:"XML",
				viewPath:"views", //where ur view is
				targetControl:"appContainer", //gives the container for all the views...
				clearTarget : false
			},
			routes : [{
				pattern : "",
				name:"Menu",
				view:"Menu",
				targetAggregation:"masterPages", //can be pages for normal app
				subroutes: [{
					pattern : "",	//	documentType/0
					name:"CreditBlockedOrders",
					view:"CreditBlockedOrders",
					targetAggregation:"detailPages"
				}, {
					pattern : "documentType/{docOrder}",	//	documentType/0
					name:"DocumentOrders",
					view:"DocumentOrders",
					targetAggregation:"detailPages"
				}, {
					pattern: "documentType/{docOrder}/documentDetail/{docDetail}",
					name: "OrderDetailsPage",
					view: "OrderDetailsPage",
					targetAggregation: "detailPages"
				}, {
					pattern: "pushNotification",
					name: "PushNotification",
					view: "PushNotification",
					targetAggregation: "detailPages"
				}]
			}]
		}
	}
});

asianpaints.dra.Component.prototype.init = function() {
	//predefined for all routing initializing
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

	sap.ui.core.UIComponent.prototype.init.apply(this);

	var loRouter = this.getRouter();
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(loRouter);
	loRouter.initialize(); //all the routes are embedded into this

	var loDeviceModel = new sap.ui.model.json.JSONModel({
		isTouch : sap.ui.Device.support.touch,
		isNoTouch : !sap.ui.Device.support.touch,
		isPhone : sap.ui.Device.system.phone,
		isNoPhone : !sap.ui.Device.system.phone,
		listMode : (sap.ui.Device.system.phone ? "None" : "SingleSelectMaster"),
		listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
	});
	loDeviceModel.setDefaultBindingMode("OneWay");
	this.setModel(loDeviceModel, "device");
};

asianpaints.dra.Component.prototype.destroy = function() {
	if(this.routeHandler) {
		this.routeHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this, arguments);
};

asianpaints.dra.Component.prototype.createContent = function() {
	
	var loAppView = sap.ui.view({
		id : "appView",
		viewName : "views.App",
		type : sap.ui.core.mvc.ViewType.JS
	});

	var loModel = new sap.ui.model.json.JSONModel();
	loAppView.setModel(loModel);

	return loAppView;
};