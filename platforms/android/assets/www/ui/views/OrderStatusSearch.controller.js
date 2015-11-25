sap.ui.controller("views.OrderStatusSearch", {
	onInit : function() {
		var loPage = this.getView().byId("idOrderStatusSearch");
		//Create the Document List
		if (goConfig.appType === "w") {
			jQuery.sap.require("modules.w.SplitAppDetailPageWeb");
			new modules.w.SplitAppDetailPageWeb({
				page : loPage,
				documentType : "orderStatusSearch",
				maxItemSelection : giMaxItemSelection
			});
		} else if (goConfig.appType === "m") {
			jQuery.sap.require("modules.m.SplitAppDetailPageMobile");
			new modules.m.SplitAppDetailPageMobile({
				page : loPage,
				documentType : "orderStatusSearch",
				maxItemSelection : giMaxItemSelection
			});
		}
	}
});