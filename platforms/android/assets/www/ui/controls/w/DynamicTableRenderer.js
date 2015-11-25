//Declare
jQuery.sap.declare("controls.w.DynamicTableRenderer");

controls.w.DynamicTableRenderer = sap.ui.core.Renderer.extend(sap.ui.core.Control);

/**
 * Renders the control.
 * 
 * @param {sap.ui.core.RenderManager}
 *            ioRm The RenderManager that can be used for writing to the render output buffer.
 * @param {jcontrols.w.DynamicTableRenderer}
 *            ioControl The control that should be rendered.
 */
controls.w.DynamicTableRenderer.render = function(ioRm, ioControl) {console.log("1")
	ioRm.write("<div ");
	ioRm.writeControlData(ioControl);
	ioRm.addStyle("height", ioControl.getHeight());
	ioRm.addStyle("width", ioControl.getWidth());
	ioRm.writeStyles();
	ioRm.writeClasses();
	ioRm.write(">");

	//Create the Table
	ioRm.renderControl(ioControl.createTable());

	ioRm.write("</div>");
};