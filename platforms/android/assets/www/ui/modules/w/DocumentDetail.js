//Declare
jQuery.sap.declare("modules.w.DocumentDetail");

//Constructor
modules.w.DocumentDetail = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

var lsLocale = sap.ui.getCore().getConfiguration().getLanguage();
var goBundle = jQuery.sap.resources({url : "i18n/i18n.properties", locale: lsLocale});

/**
 *  Object Instance Methods
 */
modules.w.DocumentDetail.prototype = {
		defaultSettings: {
			page: "",
			appType: "", //m or w
			documentType: "",
			documentIndex: "",
			maxItemSelection: 5,
			data: "",
			orderDetails: "",
			documentData: [],
			allOrderData: [],
			outstandingInvoiceFields: [{
				fieldName: "custNo",
				description: goBundle.getText("CUSTOMER_NUMBER"),
				width: "80px",
				type: "string",
				visible: false
			}, {
				fieldName: "docType",
				description: goBundle.getText("DOCUMENT_TYPE"),
				width: "80px",
				type: "string",
				visible: true
			}, {
				fieldName: "docDesc",
				description: goBundle.getText("DOCUMENT_DESCRIPTION"),
				width: "80px",
				type: "string",
				visible: true
			}, {
				fieldName: "docNo",
				description: goBundle.getText("DOCUMENT_NUMBER"),
				width: "80px",
				type: "string",
				visible: true
			}, {
				fieldName: "docDate",
				description: goBundle.getText("DOCUMENT_DATE"),
				width: "80px",
				type: "date",
				visible: true
			}, {
				fieldName: "paymentTerm",
				description: goBundle.getText("PAYMENT_TERM"),
				width: "80px",
				type: "string",
				visible: true
			}, {
				fieldName: "paymentTermDesc",
				description: goBundle.getText("PAYMENT_TERM_DESCRIPTION"),
				width: "80px",
				type: "string",
				visible: true
			}, {
				fieldName: "dueDate",
				description: goBundle.getText("DUE_DATE"),
				width: "80px",
				type: "date",
				visible: true
			}, {
				fieldName: "outstandingAmount",
				description: goBundle.getText("OUTSTANDING_AMOUNT") + "(₹)",
				width: "80px",
				type: "integer",
				visible: false
			}, {
				fieldName: "companyCode",
				description: goBundle.getText("COMPANY_CODE"),
				width: "80px",
				type: "string",
				visible: false
			}, {
				fieldName: "date",
				description: goBundle.getText("DATE"),
				width: "80px",
				type: "date",
				visible: false
			}, {
				fieldName: "grossOS",
				description: goBundle.getText("GROSS_OUTSTANDING") + "(₹)",
				width: "80px",
				type: "integer",
				visible: false
			}, {
				fieldName: "unclearCredit",
				description: goBundle.getText("UNCLEAR_CREDIT_AMOUNT") + "(₹)",
				width: "80px",
				type: "integer",
				visible: false
			}, {
				fieldName: "netOS",
				description: goBundle.getText("NET_OUTSTANDING") + "(₹)",
				width: "80px",
				type: "integer",
				visible: true
			}]
		},

		/**
		 * Initialize module
		 */
		init: function() {
			this._oTitle = null;
			this._oNavButton = null;
			this._oGetOutstanding = null;
			this.options.grossOS = null;
			this.options.unclearCredit = null;
			this.options.netOS = null;
			this.options.detailsTable = null;
			this._oShowPaymentTermHBox = null;
			this._oPaymentTermTableHBox = null;
			this.options.outstandingInvoiceTable = null;
			this.options.addPaymentTermIcon = null;

			this.createHeader();
			this.createBody();
			this.createFooter();
		},

		/* Custom Getter & Setter */
		/**
		 * Set the page title for the corresponding Document Type
		 */
		setPageTitle: function() {
			this.options.page.setTitleLevel("H1");

			switch (this.options.documentType) {
			case goOrderType.CreditBlockedOrders:
				this.getTitle().setText(goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"));
				break;
			case goOrderType.DiscountOrders:
				this.getTitle().setText(goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT"));
				break;
			case goOrderType.DamagedOrders:
				this.getTitle().setText(goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED"));
				break;
			case goOrderType.MaterialReturn:
				this.getTitle().setText(goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"));
				break;
			};
		},

		/**
		 * Get the title object for this instance
		 * 
		 * @returns {sap.m.Text}
		 */
		getTitle: function() {
			return this._oTitle;
		},

		/**
		 * Get the Navigation button for this instance
		 * 
		 * @returns {sap.m.Button}
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Get the Get Outstanding button instance
		 * 
		 * @returns {sap.m.Button}
		 */
		getGetOutstandingButton: function() {
			return this._oGetOutstanding;
		},

		/**
		 * Get outstanding invoice table entity for this instance
		 * 
		 * @returns {sap.ui.table.Table}
		 */
		getOutstandingInvoiceTable: function() {
			return this.options.outstandingInvoiceTable;
		},

		/**
		 * Get the table object for this instance 
		 * 
		 * @returns {sap.ui.table.Table}
		 */
		getDetailsTable: function() {
			return this.options.detailsTable;
		},

		/**
		 * Get Gross Os object for this instance
		 * 
		 * @returns {sap.m.Input}
		 */
		getGrossOS: function() {
			return this.options.grossOS;
		},

		/**
		 * Get Unclear Credit object for this instance
		 * 
		 * @returns {sap.m.Input}
		 */
		getUnclearCredit: function() {
			return this.options.unclearCredit;
		},

		/**
		 * Get Net Os object for this instance
		 * 
		 * @returns {sap.m.Input}
		 */
		getNetOS: function() {
			return this.options.netOS;
		},

		/**
		 * Get the payment terms object for this instance
		 * 
		 * @returns {sap.m.HBox}
		 */
		getShowPaymentTermHBox: function() {
			return this._oShowPaymentTermHBox;
		},

		/**
		 * Get the payment term table HBox for this instance
		 * 
		 * @returns {sap.m.HBox}
		 */
		getPaymentTermTableHBox: function() {
			return this._oPaymentTermTableHBox;
		},

		/**
		 * Get the add Icon for payment Terms
		 * 
		 * @returns {sap.ui.core.icon} Add Icon for payment terms 
		 */
		getAddPaymentTermIcon : function() {
			return this.options.addPaymentTermIcon;
		},

		/**
		 * Get the details table field configuration for the corresponding document type
		 * 
		 * @returns {object|JSON Array}
		 * 			raDetailsTableFields the return array of configuration for details table
		 */
		getDetailsTableFields: function() {
			var raDetailsTableFields = {
					// Configuration for details table in Credit Block Orders
					CreditBlockedOrders: {
						navExpandName: "NavCreditBlockToDueDatePayment",
						blockName: goBundle.getText("PAYMENT_TERMS"),
						fields: [{
							fieldName: "orderNo",
							description: goBundle.getText("ORDER_NO"),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "paymentTerm",
							description: goBundle.getText("PAYMENT_TERM"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "dueDate",
							description: goBundle.getText("DUE_DATE"),
							width: "80px",
							type: "date",
							visible: true
						}, {
							fieldName: "outstandingAmount",
							description: goBundle.getText("OUTSTANDING_AMOUNT") + "(₹)",
							width: "80px",
							type: "integer",
							visible: true
						}]
					},
					// Configuration for details table in Discount Orders
					DiscountOrders: {
						navExpandName: "NavDiscountOrderHeaderToItem",
						blockName: goBundle.getText("SKU_LINE_ITEM_DETAILS"),
						fields: [{
							fieldName: "orderNo",
							description: goBundle.getText("ORDER_NO."),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "Posnr",
							description: goBundle.getText("POSITION_NO."),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "skuCode",
							description: goBundle.getText("SKU_CODE"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "materialDesc",
							description: goBundle.getText("MATERIAL_DESCRIPTION"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "quantity",
							description: goBundle.getText("QUANTITY"),
							width: "80px",
							type: "integer",
							visible: true
						}, {
							fieldName: "Vrkme",
							description: goBundle.getText("VRKME"),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "volume",
							description: goBundle.getText("VOLUME"),
							width: "80px",
							type: "integer",
							visible: true
						}]
					},
					// Configuration for details table in Damaged Orders
					DamagedOrders: {
						navExpandName: "NavDamagedOrderHeaderToItem",
						blockName: goBundle.getText("SKU_LINE_ITEM_DETAILS"),
						fields: [{
							fieldName: "skuCode",
							description: goBundle.getText("SKU_CODE"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "materialDesc",
							description: goBundle.getText("MATERIAL_DESCRIPTION"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "quantity",
							description: goBundle.getText("QUANTITY"),
							width: "80px",
							type: "integer",
							visible: true
						}, {
							fieldName: "volume",
							description: goBundle.getText("VOLUME"),
							width: "80px",
							type: "integer",
							visible: true
						}, {
							fieldName: "orderNo",
							description: goBundle.getText("ORDER_NO."),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "Posnr",
							description: goBundle.getText("POSITION_NO."),
							width: "80px",
							type: "string",
							visible: false
						}, {
							fieldName: "Vrkme",
							description: goBundle.getText("VRKME"),
							width: "80px",
							type: "string",
							visible: false
						}]
					},
					// Configuration for details table in Material Return
					MaterialReturn: {
						navExpandName: "NavMaterialReturnHeaderToItem",
						blockName: goBundle.getText("SKU_LINE_ITEM_DETAILS"),
						fields: [{
							fieldName: "skuCode",
							description: goBundle.getText("SKU_CODE"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "materialDesc",
							description: goBundle.getText("MATERIAL_DESCRIPTION"),
							width: "80px",
							type: "string",
							visible: true
						}, {
							fieldName: "quantity",
							description: goBundle.getText("QUANTITY"),
							width: "80px",
							type: "integer",
							visible: true
						}, {
							fieldName: "volume",
							description: goBundle.getText("VOLUME"),
							width: "80px",
							type: "integer",
							visible: true
						}]
					}
			};

			return raDetailsTableFields[this.options.documentType];
		},

		/**
		 * Create the header object
		 */
		createHeader: function() {
			var _self = this;

			// Create and add title text
			var loTitle = new sap.m.Text();
			this._oTitle = loTitle;

			// Create and add back navigation button
			var loNavButton = new sap.m.Button({
				icon: "sap-icon://nav-back",
				press: function(ioEvent) {
					_self.onPressNavButton();
				}
			});
			this._oNavButton = loNavButton;

			// Create and add get outstanding button
			var loGetOutstandingButton = new sap.m.Button({
				icon: "sap-icon://activity-items",
				text: goBundle.getText("GET_OUTSTANDING_INVOICES"),
				visible: false,
				press: function(ioEvent) {
					_self.onPressGetOutstanding(ioEvent);
				}
			});

			// Add get outstanding button only for credit blocked orders
			if (this.options.documentType === "CreditBlockedOrders") {
				loGetOutstandingButton.setVisible(true);
			} else {
				loGetOutstandingButton.setVisible(false);
			}
			this._oGetOutstanding = loGetOutstandingButton;

			// Insert the header items into a Bar
			var loHeaderBar = new sap.m.Bar({
				design: sap.m.BarDesign.SubHeader,
				contentLeft: [loNavButton],
				contentMiddle: [loTitle],
				contentRight: [loGetOutstandingButton]
			});
			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		/**
		 * Create the Body objects 
		 */
		createBody: function() {
			//Add the style class for the body objects
			var loVBox = new sap.m.VBox({}).addStyleClass("documentDetailWebMainVBox");
			this.options.page.addContent(loVBox);

			var loHBox = new sap.m.HBox({
				width: "100%"
			}).addStyleClass("documentDetailWebMainHBox");
			loVBox.addItem(loHBox);

			var loLeftVBox = new sap.m.VBox({
				width: "49%"
			}).addStyleClass("documentDetailWebLeftVBox");
			loHBox.addItem(loLeftVBox);

			var loRightVBox = new sap.m.VBox({
				width: "49%"
			}).addStyleClass("documentDetailWebRightVBox");
			loHBox.addItem(loRightVBox);

			// Create the blocks for the body
			for (var i = 0; i < this.options.documentData.length; i++) {
				if (this.options.documentData[i]) {
					loLeftVBox.addItem(this.createDetailBlock(this.options.documentData[i]));
				}
				if (this.options.documentData[i + 1]) {
					loRightVBox.addItem(this.createDetailBlock(this.options.documentData[i + 1]));
				}
				i++;
			}

			// Get the details table configuration
			var loDetailsTableConfig = this.getDetailsTableFields();

			// adding details table for corresponding order types
			if (this.options.documentType === goOrderType.CreditBlockedOrders) {
				this.createPaymentTermSection(loVBox);
				this.createPendingOrdersSection(loVBox);
			} else {
				if (loDetailsTableConfig && this.options.orderDetails[loDetailsTableConfig.navExpandName]) {
					if (this.options.orderDetails[loDetailsTableConfig.navExpandName].results) {
						loVBox.addItem(this.createDetailsTable());
					}
				}
			}
		},

		/**
		 * Creating pending orders table
		 * 
		 * @param ioVBox {sap.m.VBox} contains table for pending orders
		 */
		createPendingOrdersSection: function(ioVBox) {
			var _self = this;
			var loHBox = new sap.m.HBox().addStyleClass("documentDetailWebHorizontalBlock");
			ioVBox.addItem(loHBox);

			var loVBox = new sap.m.VBox().addStyleClass("documentDetailWebBlockVBox");
//			var loTitle = new sap.m.Text({
//				text: goBundle.getText("PENDING_ORDERS")
//			}).addStyleClass("documentDetailWebBlockTitle");
//
//			loVBox.addItem(loTitle);
			loHBox.addItem(loVBox);

			// Configurations for pending orders table
			var loDetailsTableConfig = {
					blockName: "Pending Orders",
					fields: [{
						fieldName: "orderNo",
						description: goBundle.getText("ORDER_NO"),
						width: "80px",
						type: "string",
						visible: true
					}, {
						fieldName: "orderValue",
						description: goBundle.getText("ORDER_VALUE") + "(₹)",
						width: "80px",
						type: "integer",
						visible: true
					}, {
						fieldName: "createdAt",
						description: goBundle.getText("ORDER_DATE"),
						width: "80px",
						type: "date",
						visible: true
					}, {
						fieldName: "distChannel",
						description: goBundle.getText("DISTRIBUTION_CHANNEL"),
						width: "80px",
						type: "string",
						visible: true
					}]
			};
			// Create and add the pending orders table
			var laTableData = this.getPendingOrdersForCurrentCustomer();
			loVBox.addItem(this.createTable(loDetailsTableConfig, laTableData, "pendingOrdersTable"));

			var loBottomHBox = new sap.m.HBox({
				justifyContent: "End"
			});
			loVBox.addItem(loBottomHBox);

			// Adding Approve and reject button for pending orders
			var loApprove = new sap.m.Button({
				text: goBundle.getText("APPROVEALL"),
				type: sap.m.ButtonType.Accept,
				press: function(ioEvent) {
					_self.onPressApproveReject(ioEvent, "ApproveAll");
				}
			}).addStyleClass("documentDetailPendingOrderBottomButton");

			var loReject = new sap.m.Button({
				text: goBundle.getText("REJECTALL"),
				type: sap.m.ButtonType.Reject,
				press: function(ioEvent) {
					_self.onPressApproveReject(ioEvent, "RejectAll");
				}
			}).addStyleClass("documentDetailPendingOrderBottomButton");
			loBottomHBox.addItem(loReject).addItem(loApprove);
		},

		/**
		 * Get the list of pending orders for the current customer
		 * 
		 * @returns {Array} is the array of pending orders for the customer
		 */
		getPendingOrdersForCurrentCustomer: function() {
			var raCurrentCustomerData = [];

			for (var i = 0; i < this.options.allOrderData.length; i++) {
				if (this.options.allOrderData[i].customerCode === this.options.orderDetails.customerCode) {
					raCurrentCustomerData.push(this.options.allOrderData[i]);
				}
			}

			return raCurrentCustomerData;
		},

		/**
		 * Create the table for pending orders
		 * 
		 * @param iaColumns is the array of configuration for the details table
		 * @param iaTableData is the array of data JSON
		 * @param isModelPath is the component set for the related item
		 * 
		 * @returns {Array}  
		 * 			roTable returns the details table
		 */
		createTable: function(iaColumns, iaTableData, isModelPath) {
			var loDetailsTableConfig = iaColumns;
			var laTableData = iaTableData;

			// Add CSS styling to details block
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailWebDetailsTableBlock");
			// Add the title for the for the block
			var loTitle = new sap.m.Text({
				text: loDetailsTableConfig.blockName
			}).addStyleClass("documentDetailWebBlockTitle");
			roVBox.addItem(loTitle);

			// Create and add the table for the details block
			var roTable = new sap.ui.table.Table({
				selectionMode: sap.ui.table.SelectionMode.None
			}).addStyleClass("detailsTable");
			this.options.pendingOrdersTable = roTable;
			roVBox.addItem(roTable);

			var loModel = new sap.ui.model.json.JSONModel();
			roTable.setModel(loModel);
			roTable.bindRows("/" + isModelPath);

			// Add the columns with relevant binding to the table
			var laColumns = loDetailsTableConfig.fields;
			for (var i = 0; i < laColumns.length; i++) {
				// If not a checkbox, add the columns normal text column
				var lsHAlign = "Begin";
				if (laColumns[i].type === "integer") {
					lsHAlign = "End";
				}

				roTable.addColumn(new sap.ui.table.Column({
					label: laColumns[i].description,
					width: laColumns[i].width,
					hAlign: lsHAlign,
					visible: laColumns[i].visible,
					resizable: true,
					// If the column data is a date object, then convert it format DD-MM-YYYY
					template: new sap.m.Text().bindProperty("text", laColumns[i].fieldName, function(isText) {
						if (isText && isText.toString().indexOf("/Date(") !== -1) {
							var lsDate = isText.replace("/Date(", "");
							lsDate = lsDate.replace(")/", "");
							var roDate = new Date(parseInt(lsDate, 10));
							var lsMonth = roDate.getMonth() + 1;
							var lsDay = roDate.getDate();

							if (lsMonth.toString().length === 1) {
								lsMonth = "0" + lsMonth;
							}

							if (lsDay.toString().length === 1) {
								lsDay = "0" + lsDay;
							}

							return lsDay + "-" + lsMonth + "-" + roDate.getFullYear();
						} else {
							return isText;
						}
					}),
					customData: [new sap.ui.core.CustomData({
						key: "type",
						value: laColumns[i].type
					})]
				}));
			}
			roTable.getModel().setProperty("/" + isModelPath, laTableData);

			return roVBox;
		},

		/**
		 * Creates the payment term table section for Credit Blocked orders
		 * 
		 * @param ioVBox is the VBox where the payment terms table is created 
		 */
		createPaymentTermSection: function(ioVBox) {
			var _self = this;
			var loHBox = null;
			if (this.getShowPaymentTermHBox()) {
				loHBox = this.getShowPaymentTermHBox();
			} else {
				loHBox = new sap.m.HBox().addStyleClass("documentDetailWebPaymentTermHBox");
				this._oShowPaymentTermHBox = loHBox;
			}
			loHBox.setVisible(true);

			// Created the Icon, event handler and label for payment terms
			var loAddIcon = new sap.ui.core.Icon({
				src: "sap-icon://add",
				color: "#666666",
				size: "15px",
				press: function(ioEvent) {
					_self.onPressPaymentTermAddIcon(ioEvent);
				}
			}).addStyleClass("documentDetailWebPaymentTermAddIcon");
			this.options.addPaymentTermIcon = loAddIcon;

			var loAddText = new sap.m.Label({
				text: goBundle.getText("SHOW_PAYMENT_DUE_DETAILS")
			}).addStyleClass("documentDetailWebPaymentTermText");
			loHBox.addItem(loAddIcon);
			loHBox.addItem(loAddText);

			var loPaymentTermTableHBox = new sap.m.HBox().addStyleClass("documentDetailWebPaymentTermHBox");
			this._oPaymentTermTableHBox = loPaymentTermTableHBox;

			ioVBox.addItem(loHBox);
			ioVBox.addItem(loPaymentTermTableHBox);
		},

		/**
		 * Event hander for Payment terms
		 * 
		 * @param ioEvent receives the payment term trigger and loads the payment term object
		 */
		onPressPaymentTermAddIcon: function(ioEvent) {
			this.getAddPaymentTermIcon().setVisible(false);
			if (this.getPaymentTermTableHBox().getItems()) {
				this._oShowPaymentTermHBox.removeAllItems();
			} else {
				this.getPaymentTermTableHBox().removeAllItems();				
			}
			
			var loVBox = new sap.m.VBox().addStyleClass("documentDetailWebBlockVBox");
			this.getPaymentTermTableHBox().addItem(loVBox);
			// Payment terms table structure 
			var loDetailsTableConfig = {
					blockName: goBundle.getText("PAYMENT_DUE_DETAILS"),
					fields: [{
						fieldName: "dueDate",
						description: goBundle.getText("DUE_DATE"),
						width: "80px",
						type: "date",
						visible: true
					}, {
						fieldName: "fcd",
						description: goBundle.getText("FCD") + "(₹)",
						width: "80px",
						type: "integer",
						visible: true
					}, {
						fieldName: "rcd",
						description: goBundle.getText("RCD") + "(₹)",
						width: "80px",
						type: "integer",
						visible: true
					}, {
						fieldName: "others",
						description: goBundle.getText("OTHERS") + "(₹)",
						width: "80px",
						type: "integer",
						visible: true
					}]
			};
			// Retrive the payment term table data
			var laTableData = this.getPaymentDueDetailsData();
			// Create and add the payment terms table at the relevant HBox
			loVBox.addItem(this.createTable(loDetailsTableConfig, laTableData, "paymentDueDetails"));
		},

		/**
		 * Perform a ajax call and retrive the payment terms data
		 * 
		 * @returns {Array}
		 * 			raData is the payment terms for the customer
		 */
		getPaymentDueDetailsData: function() {
			var _self = this;
			var raData = [];
			var lsUrl = getUrl("PaymentDueDetails") + this.options.data.companyCode +
			"' and dealerCode eq '" + this.options.data.customerCode + "'&$format=json";
			var loParam = {
					url: lsUrl,
					async: false
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				success: function(ioData, isTextStatus, ioJqXHR) {
					raData = ioData.d.results;
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetTableData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();

			return raData;
		},

		/**
		 * Creates detail block
		 * 
		 * @param ioBlockData is the configuration and data for detail block
		 * 
		 * @returns {sap.m.VBox}
		 * 			roVBox is the block structure
		 */
		createDetailBlock: function(ioBlockData) {
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailWebDetailBlockVBox");
			var loTitle = new sap.m.Text({
				text: ioBlockData.blockName
			}).addStyleClass("documentDetailWebBlockTitle");
			roVBox.addItem(loTitle);

			for (var i = 0; i < ioBlockData.blockFields.length; i++) {
				var loBlockField = ioBlockData.blockFields[i];
				if (loBlockField[this.options.appType].visibleInDetail) {
					var loFieldVBox = this.createFields(loBlockField);
					roVBox.addItem(loFieldVBox);
				}
			}

			return roVBox;
		},

		/**
		 * Creates the fields of the block
		 * 
		 * @param loBlockField Contains the field configuration and data
		 * 
		 * @returns {sap.m.HBox}
		 * 			roHBox is the field created
		 */
		createFields: function(loBlockField) {
			var roHBox = new sap.m.HBox().addStyleClass("documentDetailWebFieldVBox");
			var loTitle = new sap.m.Label({
				text: loBlockField.displayText + ":"
			}).addStyleClass("documentDetailWebFieldName");
			roHBox.addItem(loTitle);
			loBlockField.value = this.formatDataIfDate(loBlockField.value);

			if (loBlockField.fieldId == "remarks") {
				loTitle = new sap.m.TextArea({
					id: "idRemarks",
					rows: 3,
					cols: 80,
					value: loBlockField.value
				});
			} else {
				loTitle = new sap.m.Label({
					text: loBlockField.value
				});
			}

			if (loBlockField[this.options.appType].specialType) {
				loTitle.addStyleClass("documentDetailWebFieldValueRed");
			} else {
				loTitle.addStyleClass("documentDetailWebFieldValue");
			}
			roHBox.addItem(loTitle);

			return roHBox;
		},

		/**
		 * Format the date to DD-MM-YYYY format
		 * 
		 * @param isText is the input text
		 * 
		 * @returns {text|Date}
		 * 			roDate is converted date or the same as input 
		 */
		formatDataIfDate: function(isText) {
			if (isText) {
				if (isText.toString().indexOf("/Date(") !== -1) {
					var lsDate = isText.replace("/Date(", "");
					lsDate = lsDate.replace(")/", "");
					var roDate = new Date(parseInt(lsDate, 10));
					var lsMonth = roDate.getMonth() + 1;
					var lsDay = roDate.getDate();
					if (lsMonth.toString().length === 1) {
						lsMonth = "0" + lsMonth;
					}
					if (lsDay.toString().length === 1) {
						lsDay = "0" + lsDay;
					}

					return lsDay + "-" + lsMonth + "-" + roDate.getFullYear();
				} else {

					return isText;
				}
			}
		},

		/**
		 * Create the detail table
		 * 
		 * @param iaColumns - array of columns to be created
		 * 
		 * @returns {sap.m.VBox}
		 * 			roVBox is the Vbox with table structure
		 */
		createDetailsTable: function(iaColumns) {
			var loDetailsTableConfig = this.getDetailsTableFields();
			if (loDetailsTableConfig && this.options.orderDetails[loDetailsTableConfig.navExpandName]) {
				var laTableData = this.options.orderDetails[loDetailsTableConfig.navExpandName].results;

				var roVBox = new sap.m.VBox().addStyleClass("documentDetailWebDetailsTableBlock");
				var loTitle = new sap.m.Text({
					text: loDetailsTableConfig.blockName
				}).addStyleClass("documentDetailWebBlockTitle");
				roVBox.addItem(loTitle);

				var loTable = new sap.ui.table.Table({
					selectionMode: sap.ui.table.SelectionMode.None,
					width: "95%",
					visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto
				}).addStyleClass("detailsTable");
				this.options.detailsTable = loTable;
				roVBox.addItem(loTable);

				var loModel = new sap.ui.model.json.JSONModel();
				loTable.setModel(loModel);
				loTable.bindRows("/detailsTable");

				var laColumns = loDetailsTableConfig.fields;
				for (var i = 0; i < laColumns.length; i++) {
					// If not a checkbox, add the columns normal text column
					var lsHAlign = "Begin";
					if (laColumns[i].type === "integer") {
						lsHAlign = "End";
					}
					loTable.addColumn(new sap.ui.table.Column({
						label: laColumns[i].description,
						width: laColumns[i].width,
						hAlign: lsHAlign,
						visible: laColumns[i].visible,
						resizable: true,
						template: new sap.m.Text().bindProperty("text", laColumns[i].fieldName, function(isText) {
							if (isText && isText.toString().indexOf("/Date(") !== -1) {
								var lsDate = isText.replace("/Date(", "");
								lsDate = lsDate.replace(")/", "");
								var roDate = new Date(parseInt(lsDate, 10));
								var lsMonth = roDate.getMonth() + 1;
								var lsDay = roDate.getDate();

								if (lsMonth.toString().length === 1) {
									lsMonth = "0" + lsMonth;
								}

								if (lsDay.toString().length === 1) {
									lsDay = "0" + lsDay;
								}

								return lsDay + "-" + lsMonth + "-" + roDate.getFullYear();
							} else {
								return isText;
							}
						}),
						customData: [new sap.ui.core.CustomData({
							key: "type",
							value: laColumns[i].type
						})]
					}));
				}
				loTable.getModel().setProperty("/detailsTable", laTableData);

				return roVBox;
			}
		},

		/**
		 * Create the footer object
		 */
		createFooter: function() {
			var _self = this;
			var loFooterBar = new sap.m.Bar({
				contentRight: [new sap.m.Button({
					text: goBundle.getText("REJECT"),
					width: "150px",
					type: "Reject",
					press: function(ioEvent) {
						_self.onPressApproveReject(ioEvent, "Reject");
					}
				}),
				new sap.m.Button({
					text: goBundle.getText("APPROVE"),
					width: "150px",
					type: "Accept",
					press: function(ioEvent) {
						_self.onPressApproveReject(ioEvent, "Approve");
					}
				})
				]
			});
			this.options.page.setFooter(loFooterBar);
		},

		/**
		 * Event handler for get outstanding button
		 */
		onPressGetOutstanding: function() {
			// Open a dialogue to show the details of outstanding orders
			var loDialog = new sap.m.Dialog({
				width: "80%",
				title: goBundle.getText("GET_OUTSTANDING_INVOICES"),
				tooltip: goBundle.getText("GET_OUTSTANDING_INVOICES"),
				showHeader: true,
				content: [this.createTopFields(), this.createOutstandingInvoiceTable(this.options.outstandingInvoiceFields)],
				rightButton: new sap.m.Button({
					text: goBundle.getText("CLOSE"),
					type: "Reject",
					press: function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
					}
				})
			});
			// Call the service and populate the outstanding data
			this.populateOutstandingInvoiceTable(this.getOutstandingInvoiceTable());
			loDialog.open();
		},

		/**
		 * Event handler for the Approve and Reject of orders
		 * 
		 * @param ioEvent Event handler object
		 * 
		 * @param isType Type of document order
		 */
		onPressApproveReject: function(ioEvent, isType) {
			var _self = this;
			var lsTitle = "";
			if (isType === "Approve" || isType === "ApproveAll") {
				lsTitle = goBundle.getText("ARE_YOU_SURE_APPROVE");
			} else if (isType === "Reject" || isType === "RejectAll") {
				lsTitle = goBundle.getText("ARE_YOU_SURE_REJECT");
			}
			var loMessageDialog = new sap.m.Dialog({
				title: goBundle.getText("CONFIRM"),
				content: [new sap.m.Text({
					text: lsTitle
				}).addStyleClass("DocumentDetailMessageDialogText")],
				buttons: [new sap.m.Button({
					type: "Reject",
					text: goBundle.getText("NO"),
					width: "100px",
					press: function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
					}
				}), new sap.m.Button({
					type: "Accept",
					text: goBundle.getText("YES"),
					width: "100px",
					press: function(ioEvent) {
						ioEvent.getSource().getParent().getParent().close();
						_self.onDecisionConfirmed(isType);
					}
				})]
			});
			loMessageDialog.open();
		},

		/**
		 * Fired once the Approval or Rejection is confirmed from Message Dialog
		 * 
		 * @param isType Type of document order
		 */
		onDecisionConfirmed: function(isType) {
			var _self = this;
			var loView = this.options.page.getParent();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
			var laBatchRequest = [];
			this.busyDialog = new sap.m.BusyDialog();

			if (isType === "Approve" || isType === "ApproveAll") {

				// Create header for the OData call
				var loHeaders = {
						"X-SMP-APPCID": goConfig.smpAppCID
				};

				// Parameters for OData call
				var loParam = {
						json: true,
						user: goConfig.userId,
						password: goConfig.password,
						headers: loHeaders
				};

				// Initiate OData model with component set and other credentials
				var loModel = new sap.ui.model.odata.ODataModel(getUrl("orderApproval"), loParam);

				// Create batch operation for approval and reject 
				if (isType === "Approve") {
					laBatchRequest.push(loModel.createBatchOperation(
							this.getDocumentEntitySet(
									this.options.documentType).replace(/\s/g, "+"), "PUT", this.getPayloadData(isType)));
				} else {
					var loTable = this.options.pendingOrdersTable;
					var laRows = loTable.getModel().getData().pendingOrdersTable;
					for (var i = 0; i < laRows.length; i++) {
						var loData = laRows[i];
						laBatchRequest.push(loModel.createBatchOperation(
								this.getDocumentEntitySet(
										this.options.documentType).replace(/\s/g, "+"), "PUT", this.getPayloadData(isType, loData)));
					}
				}

				loModel.setUseBatch(true);
				loModel.addBatchChangeOperations(laBatchRequest);

				this.busyDialog.open();
				// Call the batch process
				loModel.submitBatch(function(iaResult) {
					var lsMessage = "";
					var laResponse = [];

					//For batch result structure differs for single and multiple approval
					//This is handled by below try catch structure
					try {
						if (iaResult.__batchResponses[0].headers) {
							laResponse = iaResult.__batchResponses;
						}
					} finally {
						if (laResponse.length == 0) {
							laResponse = iaResult.__batchResponses[0].__changeResponses;
						}
					}

					for (var i = 0; i < laResponse.length; i++) {
						if (laResponse[i].headers.Failure_Message) {
							if (!lsMessage) {
								lsMessage = laResponse[i].headers.Failure_Message + ". ";
							} else {
								lsMessage = lsMessage + laResponse[i].headers.Failure_Message + ". ";
							}
						}
						if (laResponse[i].headers.Success_Message) {
							if (!lsMessage) {
								lsMessage = laResponse[i].headers.Success_Message + ". ";
							} else {
								lsMessage = lsMessage + laResponse[i].headers.Success_Message + ". ";
							}
						}
					}
					_self.busyDialog.close();
					// If submitted successfully, then navigate to landing page
					loRouter.navTo("DocumentOrders", {
						docOrder: _self.options.documentIndex
					});
					sap.m.MessageToast.show(lsMessage);
				}, function(ioError) {
					//If service error raised, Raise a toast message 
					_self.busyDialog.close();
					sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
					console.log(ioError);
				}, true);
			} else if (isType === "Reject" || isType === "RejectAll") {
				if (this.options.documentType === goOrderType.DamagedOrders || this.options.documentType === goOrderType.MaterialReturn) {
					sap.m.MessageToast.show(goBundle.getText("DAMAGED_ORDER_REJECTION_MESSAGE"));
				} else {

					// Create header for the OData call
					var loHeaders = {
							"X-SMP-APPCID": goConfig.smpAppCID
					};

					// Parameters for OData call
					var loParam = {
							json: true,
							user: goConfig.userId,
							password: goConfig.password,
							headers: loHeaders
					};

					// Initiate OData model with component set and other credentials
					var loModel = new sap.ui.model.odata.ODataModel(getUrl("orderApproval"), loParam);

					if (isType === "Reject") {
						laBatchRequest.push(loModel.createBatchOperation(
								this.getDocumentEntitySet(
										this.options.documentType).replace(/\s/g, "+"), "PUT", this.getPayloadData(isType)));
					} else {
						var loTable = this.options.pendingOrdersTable;
						for (var i = 0; i < loTable.getRows().length; i++) {
							var loData = loTable.getRows()[i].getBindingContext().getObject();
							laBatchRequest.push(loModel.createBatchOperation(
									this.getDocumentEntitySet(
											this.options.documentType).replace(/\s/g, "+"), "PUT", this.getPayloadData(isType, loData)));
						}
					}

					loModel.setUseBatch(true);
					loModel.addBatchChangeOperations(laBatchRequest);

					this.busyDialog.open();
					// Call the batch process
					loModel.submitBatch(function(iaResult) {
						var lsMessage = "";
						var laResponse = [];

						//For batch result structure differs for single and multiple approval
						//This is handled by below try catch structure
						try {
							if (iaResult.__batchResponses[0].headers) {
								laResponse = iaResult.__batchResponses;
							}
						} finally {
							if (laResponse.length == 0) {
								laResponse = iaResult.__batchResponses[0].__changeResponses;
							}
						}

						for (var i = 0; i < laResponse.length; i++) {
							if (laResponse[i].headers.Failure_Message) {
								if (!lsMessage) {
									lsMessage = laResponse[i].headers.Failure_Message + ". ";
								} else {
									lsMessage = lsMessage + laResponse[i].headers.Failure_Message + ". ";
								}
							}
							if (laResponse[i].headers.Success_Message) {
								if (!lsMessage) {
									lsMessage = laResponse[i].headers.Success_Message + ". ";
								} else {
									lsMessage = lsMessage + laResponse[i].headers.Success_Message + ". ";
								}
							}
						}
						_self.busyDialog.close();
						// If submitted successfully, then navigate to landing page
						loRouter.navTo("DocumentOrders", {
							docOrder: _self.options.documentIndex
						});
						sap.m.MessageToast.show(lsMessage);
					}, function(ioError) {
						//If service error raised, Raise a toast message 
						_self.busyDialog.close();
						sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
						console.log(ioError);
					}, true);
				}
			}
		},

		/**
		 * Retrive the payload data
		 * 
		 * @param isType is the document type
		 * 
		 * @returns {Array}
		 * 			roData is the payload data
		 */
		getPayloadData: function(isType) {
			var roData = this.options.data;

			delete roData.__metadata;

			switch (this.options.documentType) {
			case goOrderType.CreditBlockedOrders:
				delete roData.selected;
				delete roData.NavCreditBlockToDueDatePayment;
				break;
			case goOrderType.DamagedOrders:
				delete roData.NavDamagedOrderHeaderToItem;
				break;
			case goOrderType.DiscountOrders:
				delete roData.NavDiscountOrderHeaderToItem;
				break;
			case goOrderType.MaterialReturn:
				delete roData.NavMaterialReturnHeaderToItem;
				break;
			}

			if (goConfig.systemId) {
				if (goConfig.systemId.MacAddr != ""){
					roData.deviceID = goConfig.systemId.MacAddr;
				} else {
					roData.deviceID = goConfig.systemId.IPAddr;
				}
			}

			roData.remarks = sap.ui.getCore().byId("idRemarks").getValue();
			roData.DocType = this.getDocumentType(this.options.documentType);
			roData.UserID = goConfig.userId;
			roData.isMobile = "";

			if (isType === "Approve" || isType === "ApproveAll") {
				roData.AppRej = 'A';
			} else {
				roData.AppRej = 'R';
			}

			return roData;
		},

		/**
		 * Get the document entity set
		 * 
		 * @param isDocumentType document entity set
		 * 
		 * @returns {String}
		 */
		getDocumentEntitySet: function(isDocumentType) {
			switch (isDocumentType) {
			case goOrderType.CreditBlockedOrders:
				return "/CreditBlockedSet('0000000')";
			case goOrderType.DamagedOrders:
				return "/DamagedOrderHeaderSet('0000000')";
			case goOrderType.DiscountOrders:
				return "/DiscountOrderHeaderSet('0000000')";
			case goOrderType.MaterialReturn:
				return "/MaterialReturnHeaderSet('0000000')";
			}
		},

		/**
		 * Map to the backend relevant document order names
		 * 
		 * @param isDocumentType Document type name
		 * 
		 * @returns {String}
		 */
		getDocumentType: function(isDocumentType) {
			switch (isDocumentType) {
			case goOrderType.CreditBlockedOrders:
				return "CREDIT_RELEASE";
			case goOrderType.DamagedOrders:
				return "DAMAGED_ORDER";
			case goOrderType.DiscountOrders:
				return "DISC_ORDER";
			case goOrderType.MaterialReturn:
				return "MATERIAL_RETURN";
			}
		},

		/**
		 * Event handler for back button
		 */
		onPressNavButton: function() {
			goIsRefreshRequired = false;
			window.history.go(-1);
		},

		/**
		 * Create the top fields for getOutstanding
		 * 
		 * @returns {sap.m.HBox}
		 * 			roHBox contains top fields 
		 */
		createTopFields: function() {
			var roHBox = new sap.m.HBox();
			roHBox.addItem(new sap.m.Label({
				text: goBundle.getText("GROSS_OS") + "(₹)"
			}).addStyleClass("labelOutstanding"));
			var loGrossOS = new sap.m.Input({
				editable: false,
			}).addStyleClass("inputOutstanding");
			this.options.grossOS = loGrossOS;
			roHBox.addItem(loGrossOS);

			roHBox.addItem(new sap.m.Label({
				text: goBundle.getText("UNCLEAR_CREDIT") + "(₹)"
			}).addStyleClass("labelOutstanding"));
			var loUnclearCredit = new sap.m.Input({
				editable: false,
			}).addStyleClass("inputOutstanding");
			this.options.unclearCredit = loUnclearCredit;
			roHBox.addItem(loUnclearCredit);

			roHBox.addItem(new sap.m.Label({
				text: goBundle.getText("TOTAL_RECEIVABLE") + "(₹)"
			}).addStyleClass("labelOutstanding"));
			var loNetOS = new sap.m.Input({
				editable: false,
			}).addStyleClass("inputOutstanding");
			this.options.netOS = loNetOS;
			roHBox.addItem(loNetOS);

			return roHBox;
		},

		/**
		 * Create the outstanding invoice table
		 * 
		 * @param iaColumns Array containing configuration for outstanding invoice table
		 * 
		 * @returns {sap.ui.table.Table}
		 * 			roTable is the table created for outstanding invoice
		 */
		createOutstandingInvoiceTable: function(iaColumns) {
			var roTable = new sap.ui.table.Table({
				visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Fixed
			}).addStyleClass("creditListTable");
			this.options.outstandingInvoiceTable = roTable;

			var loModel = new sap.ui.model.json.JSONModel();
			roTable.setModel(loModel);
			roTable.bindRows("/outstandingInvoice");

			for (var i = 0; i < iaColumns.length; i++) {
				// If not a checkbox, add the columns normal text column
				var lsHAlign = "Begin";
				if (iaColumns[i].type === "integer") {
					lsHAlign = "End";
				}
				roTable.addColumn(new sap.ui.table.Column({
					label: iaColumns[i].description,
					tooltip: iaColumns[i].description,
					hAlign: lsHAlign,
					width: iaColumns[i].width,
					visible: iaColumns[i].visible,
					resizable: true,
					template: new sap.m.Text().bindProperty("text", iaColumns[i].fieldName, function(isText) {
						if (isText && isText.toString().indexOf("/Date(") !== -1) {
							var lsDate = isText.replace("/Date(", "");
							lsDate = lsDate.replace(")/", "");
							var roDate = new Date(parseInt(lsDate, 10));
							var lsMonth = roDate.getMonth() + 1;
							var lsDay = roDate.getDate();
							if (lsMonth.toString().length === 1) {
								lsMonth = "0" + lsMonth;
							}

							if (lsDay.toString().length === 1) {
								lsDay = "0" + lsDay;
							}

							return lsDay + "-" + lsMonth + "-" + roDate.getFullYear();
						} else {

							return isText;
						}
					}),
					customData: [new sap.ui.core.CustomData({
						key: "type",
						value: iaColumns[i].type
					})]
				}));
			}
			roTable.setVisibleRowCount(7);

			return roTable;
		},

		/**
		 * Retrive data for outstanding invoice and populate the table
		 * 
		 * @param ioTable outstanding invoice table
		 */
		populateOutstandingInvoiceTable: function(ioTable) {
			var _self = this;
			var loCurrentDate = new Date();
			var lsMonth = loCurrentDate.getMonth() + 1;
			if (lsMonth.toString().length === 1) {
				lsMonth = "0" + lsMonth;
			}
			var lsDay = loCurrentDate.getDate();
			if (lsDay.toString().length === 1) {
				lsDay = "0" + lsDay;
			}
			var lsHours = loCurrentDate.getHours();
			if (lsHours.toString().length === 1) {
				lsHours = "0" + lsHours;
			}
			var lsMinutes = loCurrentDate.getMinutes();
			if (lsMinutes.toString().length === 1) {
				lsMinutes = "0" + lsMinutes;
			}
			var lsSeconds = loCurrentDate.getSeconds();
			if (lsSeconds.toString().length === 1) {
				lsSeconds = "0" + lsSeconds;
			}
			var lsCurrentDate = loCurrentDate.getFullYear() + "-" + lsMonth + "-" + lsDay;
			var lsCurrentTime = lsHours + ":" + lsMinutes + ":" + lsSeconds;

			// Retrieve the URL for outstanding invoice data and retrieve using ajax call
			var lsUrl = getUrl("outstandingInvoice") + "?$filter=custNo eq '" + this.options.data.customerCode + "'" +
			"and date eq datetime'" + lsCurrentDate + "T" + lsCurrentTime + "' and companyCode eq '" + this.options.data.companyCode + "'";
			var loParam = {
					url: lsUrl,
					async: true
			};
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [ioTable]
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				success: function(ioData, isTextStatus, ioJqXHR) {
					ioTable.getModel().setProperty("/outstandingInvoice", ioData.d.results);
					if (ioData.d.results.length) {
						_self.updateTopFields(ioData.d.results[0]);
					} else {
						sap.m.MessageToast.show(goBundle.getText("NO_OUTSTANDING_INVOICE"));
					}
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetTableData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Update the top fields for outstanding invoice
		 * 
		 * @param ioData
		 */
		updateTopFields: function(ioData) {
			this.getGrossOS().setValue(ioData.grossOS);
			this.getUnclearCredit().setValue(ioData.unclearCredit);
			this.getNetOS().setValue(ioData.netOS);
		},

		/**
		 * Event handler for raising toast message for service error
		 * 
		 * @param {object} ioData is data object
		 * @param {String} isTextStatus is success message status
		 * @param {object} ioJqXHR is response
		 */
		onErrorGetTableData: function(ioJqXHR, isTextStatus, isErrorThrown) {
			sap.m.MessageToast.show(goBundle.getText("UNABLE_TO_FETCH_DATA"));
		}
};