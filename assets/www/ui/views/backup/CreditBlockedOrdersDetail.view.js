sap.ui.jsview("views.CreditBlockedOrdersDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf views.CreditBlockedOrdersDetail
	*/ 
	getControllerName : function() {
		return "views.CreditBlockedOrdersDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf views.CreditBlockedOrdersDetail
	*/ 
	createContent : function(ioController) {
		var loPage = new sap.m.Page();
		ioController.page = loPage;

		return loPage;
	}
});