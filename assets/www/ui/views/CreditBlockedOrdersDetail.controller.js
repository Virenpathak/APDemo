sap.ui.controller("views.CreditBlockedOrdersDetail", {
	onInit : function() {
		var loPage = this.getView().byId("idCreditBlockedOrdersDetail");
		if (goConfig.appType === "w") {
			jQuery.sap.require("modules.w.DocumentDetail");
			new modules.w.DocumentDetail({
				page : loPage,
				appType : goConfig.appType,
				documentType : "CreditBlockedOrders",
				documentData : gaCreditBlockedOrdersFields
			});
		} else if (goConfig.appType === "m") {
			jQuery.sap.require("modules.m.DocumentDetail");
			new modules.m.DocumentDetail({
				page : loPage,
				appType : goConfig.appType,
				documentType : "CreditBlockedOrders",
				documentData : gaCreditBlockedOrdersFields
			});
		}
	}
});