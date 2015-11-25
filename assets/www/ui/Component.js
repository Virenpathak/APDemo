//Declare
jQuery.sap.declare("asianpaints.dra.Component");
//Required
jQuery.sap.require("asianpaints.dra.config.global");

sap.ui.core.UIComponent.extend("asianpaints.dra.Component", {
	//Defining the routing structure for the application
	metadata: {
		routing: {
			config: {
				viewType: "XML", // View Type
				viewPath: "views", //View Name
				targetControl: "appContainer", //container for all the views
				clearTarget: false
			},
			routes: [{
				pattern: "",
				name: "Menu",
				view: "Menu",
				targetAggregation: "masterPages", //can be pages for normal app
				subroutes: [{
					pattern: "documentType/{docOrder}", //	documentType/0
					name: "DocumentOrders",
					view: "DocumentOrders",
					targetAggregation: "detailPages"
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
				}, {
					pattern: "outOfOfficeGetData",
					name: "OutOfOffice",
					view: "OutOfOffice",
					targetAggregation: "detailPages"
				}, {
					pattern: "employeeTransfer",
					name: "EmployeeTransfer",
					view: "EmployeeTransfer",
					targetAggregation: "detailPages"
				}]
			}]
		}
	}
});

/**
 * Initialization of instance of Component JS
 */
asianpaints.dra.Component.prototype.init = function() {
	//Predefined for all routing initializing
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

	sap.ui.core.UIComponent.prototype.init.apply(this);

	var loRouter = this.getRouter();
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(loRouter);
	loRouter.initialize(); //all the routes are embedded into this

	var loDeviceModel = new sap.ui.model.json.JSONModel({
		isTouch: sap.ui.Device.support.touch,
		isNoTouch: !sap.ui.Device.support.touch,
		isPhone: sap.ui.Device.system.phone,
		isNoPhone: !sap.ui.Device.system.phone,
		listMode: (sap.ui.Device.system.phone ? "None" : "SingleSelectMaster"),
		listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
	});
	loDeviceModel.setDefaultBindingMode("OneWay");
	this.setModel(loDeviceModel, "device");
};

/**
 * Destroying the instance of component JS
 */
asianpaints.dra.Component.prototype.destroy = function() {
	if (this.routeHandler) {
		this.routeHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this, arguments);
};

/**
 * Create the content of Application
 * 
 * @returns is the object instance of the application
 */
asianpaints.dra.Component.prototype.createContent = function() {
	var loAppView = sap.ui.view({
		id: "appView",
		viewName: "views.App",
		type: sap.ui.core.mvc.ViewType.JS
	});

	var loModel = new sap.ui.model.json.JSONModel();
	loAppView.setModel(loModel);

	return loAppView;
};