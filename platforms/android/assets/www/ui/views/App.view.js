sap.ui.jsview("views.App", {
	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf views.App
	 */
	createContent: function() {
		this.setDisplayBlock(true);
		this.setDisplayBlock(true);
		var loSplitApp = new sap.m.SplitApp("appContainer", {});

		return loSplitApp;
	}
});