jQuery.sap.declare("controls.ExaControlRenderer");

controls.ExaControlRenderer = sap.ui.core.Renderer.extend(sap.ui.core.Control);

controls.ExaControlRenderer.render = function(ioRm, ioControl) {
	ioRm.write("<div ");
	ioRm.writeControlData(ioControl);
	ioRm.addStyle("width", ioControl.getWidth());
	ioRm.writeStyles();
	ioRm.addClass("tree");
	ioRm.writeClasses();
	ioRm.write(">");

	ioRm.write("</div>");
};