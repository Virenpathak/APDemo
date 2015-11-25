sap.ui.controller("views.EmployeeTransfer", {
	/**
	 * Initialization of controller
	 */
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
	},

	/**
	 * Handling the routing to the document order page
	 * 
	 * @param ioEvent Event controller object
	 */
	_handleRouteMatched: function(ioEvent) {
		if (ioEvent.getParameters().name === "EmployeeTransfer") {
			var loPage = this.getView().byId("idEmployeeTransfer");
			loPage.destroyContent();
			if (goConfig.appType === "w") {
				jQuery.sap.require("modules.w.EmployeeTransfer");
				new modules.w.EmployeeTransfer({
					page: loPage
				});
			} else if (goConfig.appType === "m") {
				jQuery.sap.require("modules.m.EmployeeTransfer");
				new modules.m.EmployeeTransfer({
					page: loPage
				});
			}
		}
	}
});