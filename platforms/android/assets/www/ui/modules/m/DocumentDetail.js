jQuery.sap.declare("modules.m.DocumentDetail");

//CONSTRUCTOR
modules.m.DocumentDetail = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

var lsLocale = sap.ui.getCore().getConfiguration().getLanguage();
var goBundle = jQuery.sap.resources({url : "i18n/i18n.properties", locale: lsLocale});

/**
 *  Object Instance Methods
 */
modules.m.DocumentDetail.prototype = {
		defaultSettings: {
			page: "",
			appType: "", //m or w
			documentType: "",
			documentIndex: "",
			maxItemSelection: 5,
			data: "",
			orderDetails: "",
			documentData: []
		},

		/**
		 * Initialize module
		 */
		init: function() {
			this._oTitle = null;
			this._oNavButton = null;
			this._oShowPaymentTermHBox = null;
			this._oPaymentTermTableHBox = null;

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
		 * Get the payment terms object for this instance
		 * 
		 * @returns {sap.m.HBox}
		 */
		getShowPaymentTermHBox: function() {
			return this._oShowPaymentTermHBox;
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

			var loHeaderBar = new sap.m.Bar({
				design: sap.m.BarDesign.SubHeader,
				contentLeft: [loNavButton],
				contentMiddle: [loTitle]
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

			// Create the blocks for the body
			for (var i = 0; i < this.options.documentData.length; i++) {
				loVBox.addItem(this.createDetailBlock(this.options.documentData[i]));
			}

			// adding details table for corresponding order types
			if (this.options.documentType === goOrderType.CreditBlockedOrders) {
				this.createPaymentTermSectionMobile(loVBox);
			}

		},

		createPaymentTermSectionMobile: function(ioVBox) {
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
					_self.onPressPaymentTermAddIconMobile(ioEvent);
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
		onPressPaymentTermAddIconMobile: function(ioEvent) {
			this.getAddPaymentTermIcon().setVisible(false);
			if (this.getPaymentTermTableHBox().getItems()) {
				this._oShowPaymentTermHBox.removeAllItems();
			} else {
				this.getPaymentTermTableHBox().removeAllItems();				
			}
			// Retrieve the payment term table data
			var laTableData = this.getPaymentDueDetailsData();
			// Create and add the payment terms table at the relevant HBox
			this.getPaymentTermTableHBox().addItem(this.createList(laTableData, "paymentDueDetails"));
		},

		createList: function(iaTableData, isModelPath) {
			var laTableData = iaTableData;

			// Add CSS styling to details block
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailWebDetailsTableBlock");
			// Add the title for the for the block
			var loTitle = new sap.m.Text({
				text: goBundle.getText("PAYMENT_DUE_DETAILS")
			}).addStyleClass("documentDetailWebBlockTitle");
			roVBox.addItem(loTitle);

			// Create and add the List for the details block
			var loList = new sap.m.List({
			}).addStyleClass("documentDetailWebBlockList");
			var loModel = new sap.ui.model.json.JSONModel();
			loList.setModel(loModel);

			roVBox.addItem(loList);
			var loTemplate = new sap.m.StandardListItem({
				title: {
					parts: [{
						path: 'dueDate'
					}],
					formatter: function(dueDate) {
						var lsReturn = "";
						if (dueDate) {
							if (dueDate && dueDate.toString().indexOf("/Date(") !== -1) {
								var lsDate = dueDate.replace("/Date(", "");
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

								return dueDate;
							}
							lsReturn = dueDate + " ";
						}

						return lsReturn;
					}
				},
				description: {
					parts: [{
						path: 'rcd'
					}, {
						path: 'fcd'
					}, {
						path: 'others'
					}],
					formatter: function(rcd, fcd, others) {
						var lsReturn = "";
						if (rcd) {
							lsReturn = "RCD = ₹ " + rcd;
						}
						if (fcd) {
							if (lsReturn) {
								lsReturn = lsReturn + ", ";
							}
							lsReturn = lsReturn + "FCD = ₹ " + fcd;
						}
						if (others) {
							if (lsReturn) {
								lsReturn = lsReturn + ", ";
							}
							lsReturn = lsReturn + "Others = ₹ " + others;
						}

						return lsReturn;
					}
				},
				infoState: "Success",
				type: "Active",
			});
			loList.bindAggregation("items", "/" + isModelPath, loTemplate);
			loList.getModel().setProperty("/" + isModelPath, laTableData);

			return roVBox;
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
					var laData = ioData.d.results;
					var loStartDate = new Date();
					var loEndDate = new Date().setDate(loStartDate.getDate() + 3);

					// For mobile, only the next 3 days data is of payment terms is relevant
					for ( var i = 0 ; i < laData.length ; i++ ) {
						var lsDate = laData[i].dueDate.replace("/Date(", "");
						lsDate = lsDate.replace(")/", "");
						var loDate = new Date(parseInt(lsDate, 10));
						if (loDate >= loStartDate && loDate < loEndDate) {
							raData.push(laData[i])
						}
					}
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
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailBlockVBox");
			var loTitle = new sap.m.Text({
				text: ioBlockData.blockName
			}).addStyleClass("documentDetailBlockTitle");
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
			var roVBox = new sap.m.VBox().addStyleClass("documentDetailFieldVBox");
			var loTitle = new sap.m.Text({
				text: loBlockField.displayText
			}).addStyleClass("documentDetailFieldName");
			roVBox.addItem(loTitle);

			loBlockField.value = this.formatDataIfDate(loBlockField.value);

			if (loBlockField.fieldId == "remarks") {
				var loTitle = new sap.m.TextArea({
					id: "idRemarks",
					rows: 3,
					cols: 80,
					value: loBlockField.value
				});
			} else {
				var loTitle = new sap.m.Label({
					text: loBlockField.value
				});
			}

			if (loBlockField[this.options.appType].specialType) {
				loTitle.addStyleClass("documentDetailFieldValueRed");
			} else {
				loTitle.addStyleClass("documentDetailFieldValue");
			}

			roVBox.addItem(loTitle);

			return roVBox;
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
					var laResponse = iaResult.__batchResponses;

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
						var laResponse = iaResult.__batchResponses;

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
			var roData = this.options.orderDetails;

			delete roData.__metadata;
			delete roData.position1;
			delete roData.position2;
			delete roData.position3;
			delete roData.position4;
			delete roData.position5;

			switch (this.options.documentType) {
			case goOrderType.CreditBlockedOrders:
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
			roData.isMobile = "X";
			roData.remarks = sap.ui.getCore().byId("idRemarks").getValue();
			roData.DocType = this.getDocumentType(this.options.documentType);
			roData.UserID = goConfig.userId;

			if (isType === "Approve") {
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