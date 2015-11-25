sap.ui.controller("views.OutOfOffice", {

	/**
	 * Initialization of controller
	 */
	onInit: function() {
		var loPage = this.getView().byId("idOutOfOffice");
		if (goConfig.appType === "w") {
			jQuery.sap.require("modules.w.OutOfOfficeWeb");
			new modules.w.OutOfOfficeWeb({
				page: loPage
			});
		} else if (goConfig.appType === "m") {
			jQuery.sap.require("modules.m.OutOfOfficeMobile");
			new modules.m.OutOfOfficeMobile({
				page: loPage
			});
		}
	}
});