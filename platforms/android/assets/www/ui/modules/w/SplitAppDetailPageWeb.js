//Declare
jQuery.sap.declare("modules.w.SplitAppDetailPageWeb");
//Require
jQuery.sap.require("modules.w.DynamicTable");
jQuery.sap.require("modules.SettingsIconAction");

//CONSTRUCTOR
modules.w.SplitAppDetailPageWeb = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 * Object Instance Methods
 */
modules.w.SplitAppDetailPageWeb.prototype = {
		defaultSettings: {
			page: "",
			documentType: "",
			maxItemSelection: 5
		},

		/**
		 * Initialize the control and its internal aggregations.
		 */
		init: function() {
			this._oTitle = null;
			this._oMenuButton = null;
			this._oNavButton = null;
			this._oDynamicTable = null;
			this._oSearchField = null;
			this._oSearchButton = null;
			this._oRefresh = null;
			this._oSettings = null;
			this.documentType = this.options.documentType;
			if (this.options.maxItemSelection) {
				this.options.maxItemSelection = parseInt(this.options.maxItemSelection);
			}

			this.createHeader();
			this.createBody();
			this.createFooter();
		},

		/**
		 * Setting the title for each orders from internationalization(i18n)
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
			case goOrderType.OrderStatusSearch:
				this.getTitle().setText(goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_ORDERSTATUS"));
				break;
			}
		},

		/**
		 * Returns table model element for this instance
		 * 
		 * @returns {sap.ui.model.json.JSONModel}
		 */
		getDynamicTable: function() {
			return this._oDynamicTable;
		},

		/**
		 * Returns text element for this instance
		 * 
		 * @returns {sap.m.Text} is Title
		 */
		getTitle: function() {
			return this._oTitle;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.Button} is Menu button
		 */
		getMenuButton: function() {
			return this._oMenuButton;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.Button} Navigation back button
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Returns search field for this instance
		 * 
		 * @returns {sap.m.SearchField} data search field
		 */
		getSearchField: function() {
			return this._oSearchField;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.Button} is search icon button
		 */
		getSearchButton: function() {
			return this._oSearchButton;
		},

		/**
		 * Returns button field for this instance
		 * 
		 * @returns {sap.m.Button} refreshing the URL
		 */
		getRefreshButton: function() {
			return this._oRefresh;
		},

		/**
		 * Returns button for this instance
		 * 
		 * @returns {sap.m.Button} Setting icon button
		 */
		getSettingsButton: function() {
			return this._oSettings;
		},

		/**
		 * Creates the header object with required styling
		 */
		createHeader: function() {
			var _self = this;
			var loTitle = new sap.m.Text();
			this._oTitle = loTitle;

			//	Menu button for getting document orders list
			var loMenuButton = new sap.m.Button({
				icon: "sap-icon://menu2",
				visible: false,
				press: function(ioEvent) {
					_self.onPressMenuButton(ioEvent);
				}
			});
			this._oMenuButton = loMenuButton;

			//	Navigation button for search field navigation
			var loNavButton = new sap.m.Button({
				visible: false,
				icon: "sap-icon://nav-back",
				press: function(ioEvent) {
					_self.onPressNavButton();
				}
			});
			this._oNavButton = loNavButton;

			//	Search field for fuzzy search
			var loSearchField = new sap.m.SearchField({
				width: "100%",
				visible: false,
				liveChange: function(ioEvent) {
					_self.onChangeSearchField();
				}
			});

			//	keyboard escape method for search field
			loSearchField.addDelegate({
				onsapescape: function(ioEvent) {
					_self.onPressNavButton();
				}
			});
			this._oSearchField = loSearchField;

			//	search button icon for opening the search field
			var loSearchButton = new sap.m.Button({
				icon: "sap-icon://search",
				press: function(ioEvent) {
					_self.onPressSearchButton();
				}
			});
			this._oSearchButton = loSearchButton;

			//	refresh button icon for refreshing the URL
			var loRefreshButton = new sap.m.Button({
				icon: "sap-icon://refresh",
				press: function(ioEvent) {
					_self.onPressRefresh();
				}
			});
			this._oRefresh = loRefreshButton;

			var loSettingsIconAction = new modules.SettingsIconAction({
				page: this.options.page
			});
			var loActionSheet = loSettingsIconAction.getActionSheet();

			// Setting button display the action sheet
			var loSettingsButton = new sap.m.Button({
				icon: "sap-icon://action-settings",
				press: function(ioEvent) {
					loActionSheet.openBy(ioEvent.getSource());
				}
			});

			this._oSettings = loSettingsButton;

			// All header objects added in header Bar
			var loHeaderBar = new sap.m.Bar({
				design: sap.m.BarDesign.SubHeader,
				contentLeft: [loMenuButton, loNavButton],
				contentMiddle: [loTitle],
				contentRight: [loSearchField, loSearchButton, loRefreshButton, loSettingsButton]
			});
			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		/**
		 * Creates body container for require styling
		 */
		createBody: function() {
			var _self = this;

			// If order status Search, disable multiselect 
			var loSelection = sap.ui.table.SelectionMode.MultiToggle;
			if (this.options.documentType == goOrderType.OrderStatusSearch) {
				loSelection = sap.ui.table.SelectionMode.None;
			}

			var loVBox = new sap.m.VBox({
				height: "100%",
				fitContainer: false,
				justifyContent: "Start"
			}).addStyleClass("dynamicTableContainer");
			// creates table object, its internal events and aggregations
			var loTable = new modules.w.DynamicTable({
				height: "100%",
				width: "100%",
				documentType: this.options.documentType,
				selectionMode: loSelection,
				tableConfigData: gaBlockFieldsDetails,
				maxItemSelection: parseInt(this.options.maxItemSelection),
				showToolbar: false,
				onSelectOrderNum: function(ioEvent) {
					_self.onSelectOrderNum(ioEvent);
				},
				rowSelectionChange: function(ioEvent) {
					_self.onSelectTableRows(ioEvent);
				},
				cellClick : function(ioEvent) {
					_self.cellClick(ioEvent);
				}
			});
			this._oDynamicTable = loTable;
			// add the table in VBox control
			loVBox.addItem(loTable.getTable());
			if (this.options.page) {
				this.options.page.addContent(loVBox);
			}

			this.getTableData();
		},

		cellClick: function(ioEvent) {
			if (this.options.documentType != goOrderType.OrderStatusSearch) {
				var loModel = new sap.ui.getCore().byId("appView").getModel();
				var loDocOrderIndex = document.location.href;
				if (isNaN(loDocOrderIndex.slice(-1))) {
					loDocOrderIndex = 0;
				} else {
					loDocOrderIndex = loDocOrderIndex.slice(-1);
				}
				var loParent = this.getDynamicTable().getTable().getParent();
				var loRouter = sap.ui.core.UIComponent.getRouterFor(loParent.getParent().getParent());
				if (ioEvent.getParameters().cellControl.getBindingContext())
				{
					var loSelectedRow = ioEvent.getParameters().cellControl.getBindingContext().getObject();
					loModel.setProperty("/selectedRow", loSelectedRow);
					loModel.setProperty("/allOrderData", this.getDynamicTable().getTable().getModel().getData().rows);
					loRouter.navTo("OrderDetailsPage", {
						docOrder: loDocOrderIndex,
						docDetail: loSelectedRow.orderNo
					});
				}
			}
		},

		/**
		 * Creates the footer object with required styling
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
			this.options.page.getFooter().setVisible(false);
		},

		/**
		 * Fuzzy search for required field, Event handler when user type value on search field.
		 * 
		 * Search method assigned for Order Number, Customer Code, Customer Name and Order Value
		 * 
		 */
		onChangeSearchField: function() {
			var laFilterParams = ["orderNo", "customerCode", "customerName", "orderValue", "custmerNo", "mrvOrderValue"];
			var laFilters = [];
			var lsQuery = this.getSearchField().getValue();

			for (var i = 0; i < laFilterParams.length; i++) {
				var loFilter = new sap.ui.model.Filter(laFilterParams[i], sap.ui.model.FilterOperator.Contains, lsQuery.trim());
				laFilters.push(loFilter);
			}
			var loFilters = new sap.ui.model.Filter(laFilters, false);
			var loBinding = this.getDynamicTable().getTable().getBinding("rows");
			loBinding.filter(loFilters, sap.ui.model.FilterType.Application);
		},

		/**
		 * On click of refresh icon in header, table data should get refresh as well as clear the search field
		 */
		onPressRefresh: function() {
			this.getSearchField().setValue(); //Clear the search field
			this.onChangeSearchField(); //Clear all the filters

			this.getTableData();
		},

		/**
		 * Approve and Reject the selected checked row in the table.
		 * Here, we can not select more than this.options.maxItemSelection at a time.
		 *  
		 * @param {Event} ioEvent the fired event
		 */
		onSelectTableRows: function(ioEvent) {
			loTable = ioEvent.getSource();

			if (loTable.getSelectedIndices().length) {
				this.options.page.getFooter().setVisible(true);
			} else {
				this.options.page.getFooter().setVisible(false);
			}

			if (loTable.getSelectedIndices().length > this.options.maxItemSelection) {
				loTable.removeSelectionInterval(ioEvent.getParameters().rowIndex, ioEvent.getParameters().rowIndex);
				var loText = goBundle.getText("CANNOT_SELECT_MORE_THAN") + " " + this.options.maxItemSelection + " " + goBundle.getText("items");
				sap.m.MessageToast.show(loText);
			}
		},

		/**
		 * Get data from service URL based on the document type, Based on the success and error message it should be display the 
		 * data, this is asynchronous service call. Busy indicator should be display while fetching data from system.
		 * 
		 */
		getTableData: function() {
			var _self = this;
			var loParam = {
					url: getUrl(this.options.documentType),
					async: true
			};
			//	Display busy indicator, while fetching data
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [this.getDynamicTable().getTable()]
			};
			//	Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				/**
				 * ajax success response
				 * 
				 * @param {object} ioData is data object
				 * @param {String} isTextStatus is success message status
				 * @param {object} ioJqXHR is response
				 */
				success: function(ioData, isTextStatus, ioJqXHR) {
					var laTableData = ioData.d.results;
					if (_self.options.documentType !== "OrderStatusSearch") {
						laTableData = _self.updateOrderCounts(laTableData);
					}
					_self.loadTableData(laTableData);
					_self.onChangeSearchField(); //TODO: have to Apply filter on the items
				},
				/**
				 * ajax error response
				 * 
				 * @param {object} ioData is data object
				 * @param {String} isTextStatus is success message status
				 * @param {object} ioJqXHR is response
				 */
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetTableData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Count the number of orders and update it in particular document order type.
		 * 
		 * @param {object} iaData is the data object
		 * 
		 * @returns {Array} iaData is returning the data object
		 */
		updateOrderCounts: function(iaData) {
			var laOrderCount = [];
			// Add count of Credit Blocked Order
			laOrderCount.push({
				id: goOrderType.CreditBlockedOrders,
				counter: iaData[0].CRCount
			});

			// Add count of Discount Order
			laOrderCount.push({
				id: goOrderType.DiscountOrders,
				counter: iaData[0].DiscCount
			});

			// Add count of Damaged Order
			laOrderCount.push({
				id: goOrderType.DamagedOrders,
				counter: iaData[0].DamCount
			});

			// Add count of Material Order
			laOrderCount.push({
				id: goOrderType.MaterialReturn,
				counter: iaData[0].MRVCount
			});

			goDocumentList.updateCounter(laOrderCount);
			if (iaData.length === 1 && iaData[0].orderNo === "") {
				iaData = [];
			}

			return iaData;
		},

		/**
		 * Load the data object in to the table.
		 * 
		 * @param {object} iaData is the data object
		 */
		loadTableData: function(iaData) {
			//Load Table Data
			if (this.getDynamicTable()) {
				this.getDynamicTable().updateTableRows(iaData);
			}
		},

		/**
		 * ajax error response, while fetching data from system.
		 * 
		 * @param {object} ioJqXHR is response
		 * 
		 * @param {String} isTextStatus is error message status
		 * 
		 * @param {String} isErrorThrown thrown the message if it is error
		 */
		onErrorGetTableData: function(ioJqXHR, isTextStatus, isErrorThrown) {
			sap.m.MessageToast.show(goBundle.getText("UNABLE_TO_FETCH_DATA"));
		},

		onPressApproveReject: function(ioEvent, isType) {
			var _self = this;
			if (isType === "Approve") {
				lsTitle = goBundle.getText("ARE_YOU_SURE_APPROVE");
			} else if (isType === "Reject") {
				lsTitle = goBundle.getText("ARE_YOU_SURE_REJECT");
			}
			var loMessageDialog = new sap.m.Dialog({
				title: goBundle.getText("CONFIRM"),
				content: [new sap.m.Text({
					text: lsTitle
				}).addStyleClass("splitAppDetailPageMobileMessageDialogText")],
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
		 * Fired once the Approval or Rejection is confirmed by user from message dialog. Based on the approval and rejection
		 * service call get refreshed and navigate to the landing page.
		 * 
		 * @param {String} isType decision confirm for Approve or Reject
		 */
		onDecisionConfirmed: function(isType) {
			var _self = this;
			var laBatchRequest = [];
			this.busyDialog = new sap.m.BusyDialog();
			var loTableData = this.getDynamicTable().getTableData();
			var laSelectedIndices = this.getDynamicTable().getTable().getSelectedIndices();

			if (isType === "Approve") {
				var loHeaders = {
						"X-SMP-APPCID": goConfig.smpAppCID
				};
				var loParam = {
						json: true,
						user: goConfig.userId,
						password: goConfig.password,
						headers: loHeaders
				};
				var loModel = new sap.ui.model.odata.ODataModel(getUrl("orderApproval"), loParam);

				for (var i=0; i<laSelectedIndices.length ; i++) {
					var loRow = this.getDynamicTable().getTable().getRows()[laSelectedIndices[i]];
					laBatchRequest.push(loModel.createBatchOperation(
							this.getDocumentEntitySet(this.options.documentType).replace(/\s/g, "+"),
							"PUT", this.getPayloadData(isType, loRow.getBindingContext().getObject())));
				}
				loModel.setUseBatch(true);
				loModel.addBatchChangeOperations(laBatchRequest);

				this.busyDialog.open();
				loModel.submitBatch(function(iaResult) {
					_self.deleteCookie ();
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
					_self.onPressRefresh();
					sap.m.MessageToast.show(lsMessage);
					_self.onPressRefresh();
				}, function(ioError) {
					_self.deleteCookie ();
					_self.busyDialog.close();
					sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
					console.log(ioError);
				}, true);
			} else if (isType === "Reject") {
				if (this.options.documentType === goOrderType.DamagedOrders || this.options.documentType === goOrderType.MaterialReturn) {
					sap.m.MessageToast.show(goBundle.getText("DAMAGED_ORDER_REJECTION_MESSAGE"));
				} else {
					var loHeaders = {
							"X-SMP-APPCID": goConfig.smpAppCID
					};
					var loParam = {
							json: true,
							user: goConfig.userId,
							password: goConfig.password,
							headers: loHeaders
					};
					var loModel = new sap.ui.model.odata.ODataModel(getUrl("orderApproval"), loParam);

					for (var i=0; i<laSelectedIndices.length ; i++) {
						var loRow = this.getDynamicTable().getTable().getRows()[laSelectedIndices[i]];
						laBatchRequest.push(loModel.createBatchOperation(
								this.getDocumentEntitySet(this.options.documentType).replace(/\s/g, "+"),
								"PUT", this.getPayloadData(isType, loRow.getBindingContext().getObject())));
					}

					loModel.setUseBatch(true);
					loModel.addBatchChangeOperations(laBatchRequest);

					this.busyDialog.open();
					loModel.submitBatch(function(iaResult) {
						_self.deleteCookie ();
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
						_self.onPressRefresh();
						sap.m.MessageToast.show(lsMessage); //goBundle.getText("REJECTION_CONFIRMATION"));
					}, function(ioError) {
						_self.deleteCookie ();
						_self.busyDialog.close();
						sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
						console.log(ioError);
					}, true);
				}
			}
		},

		/**
		 * Delete the cookies
		 */
		deleteCookie: function() {
			if (document.cookie) {
				var laCookies = document.cookie.split(";");
				if (laCookies.length > 0) {
					for (var i = 0; i < laCookies.length; ++i) {
						var loCurrentCookie = laCookies[i];
						var pos = loCurrentCookie.indexOf("=");
						var name = pos > -1 ? loCurrentCookie.substr(0, pos) : loCurrentCookie;
						document.cookie = name + "=;expires="+new Date().toGMTString()+";path=/";
					}
				}
			}
		},

		/**
		 * Triggering the method pay load data based on the document type
		 *  
		 * @param {String} isType is Approve or Reject
		 * @param {object} ioData is data object
		 * 
		 * @returns {object} ioData is returning the data object
		 */
		getPayloadData: function(isType, ioData) {
			if (goConfig.systemId) {
				if (goConfig.systemId.MacAddr != ""){
					ioData.deviceID = goConfig.systemId.MacAddr;			
				} else {
					ioData.deviceID = goConfig.systemId.IPAddr;
				}
			}

			ioData.isMobile = "";
			ioData.DocType = this.getDocumentType(this.options.documentType);
			ioData.UserID = goConfig.userId;

			delete ioData.__metadata;
			delete ioData.selected;

			switch (this.options.documentType) {
			case goOrderType.CreditBlockedOrders:
				delete ioData.NavCreditBlockToDueDatePayment;
				break;
			case goOrderType.DamagedOrders:
				delete ioData.NavDamagedOrderHeaderToItem;
				break;
			case goOrderType.DiscountOrders:
				delete ioData.NavDiscountOrderHeaderToItem;
				break;
			case goOrderType.MaterialReturn:
				delete ioData.NavMaterialReturnHeaderToItem;
				break;
			}

			if (isType === "Approve") {
				ioData.AppRej = 'A';
			} else {
				ioData.AppRej = 'R';
			}

			return ioData;
		},

		/**
		 * Get the document entity set for the corresponding document orders
		 * 
		 * @param {String} isDocumentType the document type
		 * 
		 * @returns {String} isDocumentType returning the document type
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
		 * Get the document type for the corresponding document orders
		 * 
		 * @param {String} isDocumentType is the document type
		 * 
		 * @returns {String} isDocumentType is returning the document type
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
		 * On click of search icon button, make it visible false and true below header button
		 */
		onPressSearchButton: function() {
			this.getSearchField().setVisible(true);
			jQuery.sap.delayedCall(0, this, function() {
				this.getSearchField().focus();
			});
			this.getNavButton().setVisible(true);
			this.getSearchButton().setVisible(false);
			this.getRefreshButton().setVisible(false);
			this.getSettingsButton().setVisible(false);
			this.getTitle().setVisible(false);
		},

		/**
		 * On click of back navigation button, make it visible false and true below header button
		 */
		onPressNavButton: function() {
			this.getSearchField().setValue(); //Clear the search field
			this.onChangeSearchField(); //Clear all the filters
			this.getSearchField().setVisible(false);
			this.getNavButton().setVisible(false);
			this.getSearchButton().setVisible(true);
			this.getRefreshButton().setVisible(true);
			this.getSettingsButton().setVisible(true);
			this.getTitle().setVisible(true);
		}
};