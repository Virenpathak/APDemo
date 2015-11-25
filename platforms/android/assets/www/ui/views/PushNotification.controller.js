sap.ui.controller("views.PushNotification", {

	/**
	 * Initialization of controller
	 */
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
	},

	/**
	 * Handling the routing to the document order page
	 */
	_handleRouteMatched: function(ioEvent) {
		if (ioEvent.getParameters().name === "PushNotification") {
			var loPage = this.getView().byId("idPushNotification");
			loPage.destroyContent();
			jQuery.sap.require("modules.m.PushNotification");
			new modules.m.PushNotification({
				page: loPage
			});
		}
	}
});