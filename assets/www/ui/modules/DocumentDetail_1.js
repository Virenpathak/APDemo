jQuery.sap.declare("modules.m.DocumentDetail");
//jQuery.sap.require("jquery.sap.resources");

//CONSTRUCTOR
modules.m.DocumentDetail = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

//	Initialize the form Layout
	this.init();
};

//var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
//var oBundle = jQuery.sap.resources({url : "i18n/i18n.properties", locale: sLocale});

//object instance methods
modules.m.DocumentDetail.prototype = {
		defaultSettings : {
			page : "",
			appType : "",		//m or w
			documentType : "",
			maxItemSelection : 5,
			documentData : []
		},

		init : function() {
			var _self = this;
			this._oTitle = null;
			this._oNavButton = null;

			this.createHeader();
			this.createBody();
			this.createFooter();
		},

		setPageTitle : function() {
			switch(this.options.documentType) {
			case "CreditBlockedOrders" : 
				this.getTitle().setText("Credit Blocked Orders");
				break;
			case "DiscountOrders" : 
				this.getTitle().setText("Discount Orders");
				break;
			case "DamagedOrders" : 
				this.getTitle().setText("Damaged Orders");
				break;
			case "MaterialReturn" : 
				this.getTitle().setText("Material Return"); //(oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"));
				break;
			};
//			switch(this.options.documentType) {
//			case "CreditBlockedOrders" : 
//				this.getTitle().setText(oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"));
//				break;
//			case "DiscountOrders" : 
//				this.getTitle().setText(oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT"));
//				break;
//			case "DamagedOrders" : 
//				this.getTitle().setText(oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED"));
//				break;
//			case "MaterialReturn" : 
//				this.getTitle().setText("Material Return"); //(oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"));
//				break;
//			};
		},

		getTitle : function() {
			return this._oTitle;
		},

		getNavButton : function() {
			return this._oNavButton;
		},

		createHeader : function() {
			var _self = this;
			var loTitle = new sap.m.Text({
				text : "Title of the Page"
			});
			this._oTitle = loTitle;

			var loNavButton = new sap.m.Button({
				icon : "sap-icon://nav-back",
				press : function(ioEvent) {
					_self.onPressNavButton();
				}
			});
			this._oNavButton = loNavButton;

			var loHeaderBar = new sap.m.Bar({
				design : sap.m.BarDesign.SubHeader,
				contentLeft : [loNavButton],
				contentMiddle : [loTitle]
			});
			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		createBody : function() {
			var loVBox = new sap.m.VBox();
			this.options.page.addContent(loVBox);
			for (var i=0;i<this.options.documentData.length;i++) {
				loVBox.addItem(this.createDetailBlock(this.options.documentData[i]));
			}
		},

		createDetailBlock : function(ioBlockData) {
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailBlockVBox");
			var loTitle = new sap.m.Text({
				text : ioBlockData.blockName
			}).addStyleClass("documentDetailBlockTitle");
			roVBox.addItem(loTitle);

			for (var i=0;i<ioBlockData.blockFields.length;i++) {
				var loBlockField = ioBlockData.blockFields[i];
				if (loBlockField[this.options.appType].visibleInDetail) {
					var loFieldVBox = this.createFields(loBlockField);
					roVBox.addItem(loFieldVBox);
				}
			}

			return roVBox;
		},

		createFields : function(loBlockField) {
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailFieldVBox");
			var loTitle = new sap.m.Text({
				text : loBlockField.displayText
			}).addStyleClass("documentDetailFieldName");
			roVBox.addItem(loTitle);

			var loTitle = new sap.m.Text({
				text : loBlockField.value
			});
			if (loBlockField[this.options.appType].specialType) {
				loTitle.addStyleClass("documentDetailFieldValueRed");
			} else {
				loTitle.addStyleClass("documentDetailFieldValue");
			}
			roVBox.addItem(loTitle);

			return roVBox;
		},

		createFooter : function() {
			var _self = this;
			var loFooterBar = new sap.m.Bar({
				contentRight : [ new sap.m.Button({
					text : "Reject",
					width: "150px",
					type : "Reject",
					press : function(ioEvent) {
						_self.onPressReject(ioEvent);
					}
				}),
				new sap.m.Button({
					text : "Approve",
					width: "150px",
					type : "Accept",
					press : function(ioEvent) {
						_self.onPressApprove(ioEvent);
					}
				})
				]
			});
			this.options.page.setFooter(loFooterBar);
		},

		onPressApprove : function(ioEvent) {
			var _self = this;
			var loMessageDialog = new sap.m.Dialog({
//				icon : undefined,
				title : "Approve",
				content : [new sap.m.Text({
					text : "Are you sure you want to Approve?"
				}).addStyleClass("DocumentDetailMessageDialogText")],
				buttons : [new sap.m.Button({
					type : "Reject",
					text : "No",
					width : "100px",
					press : function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
					}
				}), new sap.m.Button({
					type : "Accept",
					text : "Yes",
					width : "100px",
					press : function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
						_self.onDecisionConfirmed("Approve");
					}
				})]
			});
			loMessageDialog.open();
		},

		onPressReject : function(ioEvent) {
			var _self = this;
			var loMessageDialog = new sap.m.Dialog({
//				icon : undefined,
				title : "Approve",
				content : [new sap.m.Text({
					text : "Are you sure you want to Reject?"
				}).addStyleClass("DocumentDetailMessageDialogText")],
				buttons : [new sap.m.Button({
					type : "Reject",
					text : "No",
					width : "100px",
					press : function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
					}
				}), new sap.m.Button({
					type : "Accept",
					text : "Yes",
					width : "100px",
					press : function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
						_self.onDecisionConfirmed("Reject");
					}
				})]
			});
			loMessageDialog.open();
		},

		//Fired once the Approval or Rejection is confirmed from Message Dialog
		onDecisionConfirmed : function(isType) {
			if (isType === "Approve") {
				
				sap.m.MessageToast.show("The Order has been Approved");
			} else if (isType === "Reject") {
				sap.m.MessageToast.show("The Order has been Rejected");
			}
		},

		onPressNavButton : function() {
			window.history.go(-1);
		},

		onPressMenuButton : function() {

		}
};