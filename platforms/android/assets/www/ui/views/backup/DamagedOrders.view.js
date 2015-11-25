sap.ui.jsview("views.DamagedOrders", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf views.DamagedOrders
	*/ 
	getControllerName : function() {
		return "views.DamagedOrders";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf views.DamagedOrders
	*/ 
	createContent : function(ioController) {
		var loPage = new sap.m.Page({
			title : "Damaged Orders"
		});
		ioController.page = loPage;

		return loPage;
	}
});