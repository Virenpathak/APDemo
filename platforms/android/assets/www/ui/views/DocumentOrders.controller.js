//Required
jQuery.sap.require("modules.w.SplitAppDetailPageWeb");
jQuery.sap.require("modules.m.SplitAppDetailPageMobile");
//Controller
sap.ui.controller("views.DocumentOrders", {
	/**
	 * Initialization of controller
	 */
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

		this.loPage = this.getView().byId("idDocumentOrders");
	},

	/**
	 * Handling the routing to the document order page
	 * 
	 * @param ioEvent Event controller object
	 */
	_handleRouteMatched: function(ioEvent) {
		if (ioEvent.getParameters().name === "DocumentOrders") {
			this.documentIndexId = ioEvent.getParameter("arguments").docOrder;
			if (goIsRefreshRequired) {
				// Destroy the past created instances
				this.loPage.destroyContent();
				// Credit Blocked orders
				if (this.documentIndexId == 0) {
					if (goConfig.appType === "w") {
						new modules.w.SplitAppDetailPageWeb({
							page: this.loPage,
							documentType: goOrderType.CreditBlockedOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					} else if (goConfig.appType === "m") {
						new modules.m.SplitAppDetailPageMobile({
							page: this.loPage,
							documentType: goOrderType.CreditBlockedOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					}
					// Discount Orders
				} else if (this.documentIndexId == 1) {
					if (goConfig.appType === "w") {
						new modules.w.SplitAppDetailPageWeb({
							page: this.loPage,
							documentType: goOrderType.DiscountOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					} else if (goConfig.appType === "m") {
						new modules.m.SplitAppDetailPageMobile({
							page: this.loPage,
							documentType: goOrderType.DiscountOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					}
					// Damaged orders
				} else if (this.documentIndexId == 2) {
					if (goConfig.appType === "w") {
						new modules.w.SplitAppDetailPageWeb({
							page: this.loPage,
							documentType: goOrderType.DamagedOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					} else if (goConfig.appType === "m") {
						new modules.m.SplitAppDetailPageMobile({
							page: this.loPage,
							documentType: goOrderType.DamagedOrders,
							maxItemSelection: goConfig.maxItemSelected
						});
					}
					// Material Return
				} else if (this.documentIndexId == 3) {
					if (goConfig.appType === "w") {
						new modules.w.SplitAppDetailPageWeb({
							page: this.loPage,
							documentType: goOrderType.MaterialReturn,
							maxItemSelection: goConfig.maxItemSelected
						});
					} else if (goConfig.appType === "m") {
						new modules.m.SplitAppDetailPageMobile({
							page: this.loPage,
							documentType: goOrderType.MaterialReturn,
							maxItemSelection: goConfig.maxItemSelected
						});
					}
					// Order status search
				} else if (this.documentIndexId == 4) {
					if (goConfig.appType === "w") {
						new modules.w.SplitAppDetailPageWeb({
							page: this.loPage,
							documentType: goOrderType.OrderStatusSearch,
							maxItemSelection: goConfig.maxItemSelected
						});
					} else if (goConfig.appType === "m") {
						new modules.m.SplitAppDetailPageMobile({
							page: this.loPage,
							documentType: goOrderType.OrderStatusSearch,
							maxItemSelection: goConfig.maxItemSelected
						});
					}
				}
			} else {
				// Reset Flag, so refresh is triggered if any other action other than back button press is pressed
				goIsRefreshRequired = true;
			}

		}
	}
});