sap.ui.controller("views.Menu", {
	/**
	 * Initialization of controller
	 */
	onInit: function() {
		var loPage = this.getView().byId("idMenu");
		//Create the Document List
		loPage.addContent(goDocumentList.render());
	}
});