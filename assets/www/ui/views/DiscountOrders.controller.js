sap.ui.controller("views.DiscountOrders", {
	onInit : function() {
		this.loPage = this.getView().byId("idDiscountOrders");
		if (goConfig.appType === "w") {
			jQuery.sap.require("modules.w.SplitAppDetailPageWeb");
			new modules.w.SplitAppDetailPageWeb({
				page : loPage,
				documentType : "CreditBlockedOrders",
				maxItemSelection : giMaxItemSelection
			});
		} else if (goConfig.appType === "m") {
			jQuery.sap.require("modules.m.SplitAppDetailPageMobile");
			new modules.m.SplitAppDetailPageMobile({
				page : loPage,
				documentType : "CreditBlockedOrders",
				maxItemSelection : giMaxItemSelection
			});
		}
	}
});