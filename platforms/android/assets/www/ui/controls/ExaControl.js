jQuery.sap.declare("controls.ExaControl");

sap.ui.core.Control.extend("controls.Tree", {
	metadata : {
		properties : {
			"width" : {
				type : "sap.ui.core.CSSSize",
				defaultValue : "100%"
			}
		},
		aggregations : {
			"title" : {type : "sap.m.Text", multiple : false}
		}
	},

	init : function() {
		this.setAggregation("title", new sap.m.Text({}).addStyleClass("exaControlTitle"));
	}
});