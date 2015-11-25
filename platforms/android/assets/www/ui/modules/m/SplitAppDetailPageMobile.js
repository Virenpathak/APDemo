//Declare
jQuery.sap.declare("modules.m.SplitAppDetailPageMobile");
//Require
jQuery.sap.require("modules.SettingsIconAction");

//CONSTRUCTOR
modules.m.SplitAppDetailPageMobile = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 * object instance methods
 */
modules.m.SplitAppDetailPageMobile.prototype = {
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
			this._oList = null;
			this._oSearchField = null;
			this._oSearchButton = null;
			this._oRefresh = null;
			this._oSettings = null;
			this.documentType = this.options.documentType;

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
			};
		},

		/**
		 * Returns list model element for this instance
		 * 
		 * @returns {sap.m.List}
		 */
		getList: function() {
			return this._oList;
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
		 * @returns {sap.m.Button} is naviagtion button
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.SearchField} is search field
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
			var loModel = new sap.ui.model.json.JSONModel();
			// creates list object, its internal events and aggregations
			var loList = new sap.m.List({
				includeItemInSelection: false,
				mode: sap.m.ListMode.MultiSelect,
				select: function(ioEvent) {
					_self.onSelectList(ioEvent);
				}
			}).addStyleClass("splitAppDetailPageMobileList");
			loList.setModel(loModel);
			this._oList = loList;

			var loTemplate = new sap.m.StandardListItem({
				icon : {
					parts: [{path: 'rmApprReqd'}],
					formatter: function(isRMApprReqd) {
						if (isRMApprReqd) {
							return "sap-icon://hr-approval";
						} else {
							return undefined;
						}
					}
				},
				title: {
					parts: [{
						path: 'position1'
					}, {
						path: 'position2'
					}],
					formatter: function(position1, position2) {
						var lsReturn = "";
						if (position1) {
							lsReturn = position1 + " ";
						}
						if (position2) {
							lsReturn += position2;
						}
						return lsReturn;
					}
				},
				description: {
					parts: [{
						path: 'position3'
					}, {
						path: 'position4'
					}],
					formatter: function(position3, position4) {
						var lsReturn = "";
						if (position3) {
							lsReturn = position3 + " ";
						}
						if (position4) {
							lsReturn += position4;
						}
						return lsReturn;
					}
				},
				info: {
					parts: [{
						path: 'position5'
					}],
					formatter: function(position5) {
						if (position5) {
							return "₹ " + position5;
						}
					}
				},
				infoState: "Success",
				type: "Active",
				press: _self.onItemSelection
			});
			loList.bindAggregation("items", "/" + this.options.documentType, loTemplate);

			if (this.options.page) {
				this.options.page.addContent(loList);
			}

			this.getListData();
		},

		/**
		 * On click of any item in the list, it will navigating to the OrderDetailsPage and display the details of that particular
		 * selected item. 
		 * 
		 * @param {Event} ioEvent the fired event
		 */
		onItemSelection: function(ioEvent) {
			var loModel = new sap.ui.getCore().byId("appView").getModel();
			var loDocOrderIndex = document.location.href;
			var loDocOrderIndex;
			if (isNaN(loDocOrderIndex.slice(-1))) {
				loDocOrderIndex = 0;
			} else {
				loDocOrderIndex = loDocOrderIndex.slice(-1);
			}
			var loParent = this.getParent();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loParent.getParent().getParent());
			var loContext = ioEvent.getSource().getBindingContext();
			var loPath = loContext.getPath();
			var loGetContext = ioEvent.getSource().getModel();
			var loSelectedItem = loGetContext.getProperty(loPath);
			loModel.setProperty("/selectedRow", loSelectedItem);
			loRouter.navTo("OrderDetailsPage", {
				docOrder: loDocOrderIndex,
				docDetail: loSelectedItem.orderNo
			});
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
			this.options.page.setShowFooter(false);
		},

		/**
		 * Fuzzy search for required field, Event handler when user type value on search field.
		 * 
		 * Search method assigned for Customer Code, Customer Number, Order Number, and Order Value
		 * 
		 */
		onChangeSearchField: function() {
			var laFilterParams = ["customerCode", "customerName",
			                      "orderNo", "orderValue", "mrvOrderValue"
			                      ];
			var laFilters = [];
			var lsQuery = this.getSearchField().getValue();

			for (var i = 0; i < laFilterParams.length; i++) {
				var loFilter = new sap.ui.model.Filter(laFilterParams[i], sap.ui.model.FilterOperator.Contains, lsQuery.trim());
				laFilters.push(loFilter);
			}
			var loFilters = new sap.ui.model.Filter(laFilters, false);
			var loBinding = this.getList().getBinding("items");
			loBinding.filter(loFilters, sap.ui.model.FilterType.Application);
		},

		/**
		 * On click of refresh icon in header, list data should get refresh as well as clear the search field
		 */
		onPressRefresh: function() {
			this.getSearchField().setValue(); //Clear the search field
			this.onChangeSearchField(); //Clear all the filters

			this.clearListSelection();
			this.getListData();
			// Remove the Approve Reject button from bottom of screen
			this.options.page.setShowFooter(false);
		},

		// On Refresh, Clear selected data.
		clearListSelection: function() {
			var loSelectedListItem = this.getList().getSelectedItems();
			for (var i = 0; i < loSelectedListItem.length; i++) {
				loSelectedListItem[i].setSelected(false);
			}
		},

		/**
		 * Get data from service URL based on the document type, Based on the success and error message it should be display the 
		 * data, this is asynchronous service call. Busy indicator should be display while fetching data from system.
		 * 
		 */
		getListData: function() {
			var _self = this;
			//	calling service URL based on the document type
			var loParam = {
					url: getUrl(this.options.documentType),
					async: true
			};
			//	Display busy indicator, while fetching data
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [this.getList()]
			};
			//	Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				success: function(ioData, isTextStatus, ioJqXHR) {
					var laListData = ioData.d.results;
					laListData = _self.updateOrderCounts(laListData);
					_self.generatePositionData(laListData);
					_self.loadListData(laListData);
					_self.onChangeSearchField();
					if (goConfig.appType == "m") {
						goDocumentList.options.menuList.getSelectedItem().setSelected(false);
					}
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorgetListData(ioJqXHR, isTextStatus, isErrorThrown);
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
		 * Load the data object in to the list.
		 * 
		 * @param {object} iaData is the data object
		 */
		loadListData: function(iaData) {
			//Load List Data
			if (this.getList() && this.getList().getModel()) {
				this.getList().getModel().setProperty("/" + this.options.documentType, iaData);
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
		onErrorgetListData: function(ioJqXHR, isTextStatus, isErrorThrown) {
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
			var loList = this.getList();

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

				for (var i = 0; i < loList.getSelectedItems().length; i++) {
					var loData = loList.getSelectedItems()[i].getBindingContext().getModel().getData()[this.options.documentType][loList.getSelectedItems()[
					                                                                                                                                        i].getBindingContextPath().slice(-1)];
					laBatchRequest.push(loModel.createBatchOperation(
							this.getDocumentEntitySet(this.options.documentType).replace(/\s/g, "+"),
							"PUT", this.getPayloadData(isType, loData)));
				}
				loModel.setUseBatch(true);
				loModel.addBatchChangeOperations(laBatchRequest);

				this.busyDialog.open();
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
						if (laResponse != 'undefined') {
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

					for (var i = 0; i < loList.getSelectedItems().length; i++) {
						var loData = loList.getSelectedItems()[i].getBindingContext().getModel().getData()[this.options.documentType][loList.getSelectedItems()[
						                                                                                                                                        i].getBindingContextPath().slice(-1)];
						laBatchRequest.push(loModel.createBatchOperation(
								this.getDocumentEntitySet(
										this.options.documentType).replace(/\s/g, "+"),
										"PUT", this.getPayloadData(isType, loData)));
					}
					loModel.setUseBatch(true);
					loModel.addBatchChangeOperations(laBatchRequest);

					this.busyDialog.open();
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
							if (laResponse != 'undefined') {
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
					}, function(ioError) {
						_self.busyDialog.close();
						sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
						console.log(ioError);
					}, true);
				}
			}
		},

		/**
		 * Triggering the method pay load data based on the document type
		 *  
		 * @param {String} isType is Approve or Reject
		 * 
		 * @param {object} ioData is data object
		 * 
		 * @returns {object} ioData is returning the data object
		 */
		getPayloadData: function(isType, ioData) {
			ioData.DocType = this.getDocumentType(this.options.documentType);
			ioData.UserID = goConfig.userId;
			ioData.isMobile = "X";

			if (goConfig.systemId) {
				if (goConfig.systemId.MacAddr != ""){
					ioData.deviceID = goConfig.systemId.MacAddr;
				} else {
					ioData.deviceID = goConfig.systemId.IPAddr;
				}
			}

			delete ioData.__metadata;
			delete ioData.position1;
			delete ioData.position2;
			delete ioData.position3;
			delete ioData.position4;
			delete ioData.position5;

			switch (this.options.documentType) {
			case goOrderType.CreditBlockedOrders:
				delete ioData.NavCreditBlockToDueDatePayment;
			case goOrderType.DamagedOrders:
				delete ioData.NavDamagedOrderHeaderToItem;
			case goOrderType.DiscountOrders:
				delete ioData.NavDiscountOrderHeaderToItem;
			case goOrderType.MaterialReturn:
				delete ioData.NavMaterialReturnHeaderToItem;
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
			this.getMenuButton().setVisible(false);
			this.getSearchButton().setVisible(false);
			this.getRefreshButton().setVisible(false);
			this.getSettingsButton().setVisible(false);
			this.getTitle().setVisible(false);
		},

		/**
		 * On click of back navigation button, make it visible false and true below header button
		 */
		onPressNavButton: function() {
			this.getSearchField().setVisible(false);
			this.getNavButton().setVisible(false);
			this.getMenuButton().setVisible(true);
			this.getSearchButton().setVisible(true);
			this.getRefreshButton().setVisible(true);
			this.getSettingsButton().setVisible(true);
			this.getTitle().setVisible(true);
		},

		/**
		 * On click of menu button routing to document list menu view
		 */
		onPressMenuButton: function(ioEvent) {
			var loMenu = sap.ui.getCore().byId("__xmlview0");
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loMenu);
			loRouter.navTo("idMenu");
		},

		/**
		 * Approve and Reject the selected checked row in the list. Here, we can not approve and reject more than five item at a time.
		 *  
		 * @param {Event} ioEvent the fired event
		 */
		onSelectList: function(ioEvent) {
			if (this.getList().getSelectedItems().length > this.options.maxItemSelection) {
				ioEvent.getParameters().listItem.setSelected(false);
				var loText = goBundle.getText("CANNOT_SELECT_MORE_THAN") + " " + this.options.maxItemSelection + " " + goBundle.getText("items");
				sap.m.MessageToast.show(loText);
			}
			if (this.getList().getSelectedItems().length) {
				this.options.page.setShowFooter(true);
			} else {
				this.options.page.setShowFooter(false);
			}
		},

		/**
		 * Generate the Position data for order data
		 * 
		 * @param {object} iaData is data object
		 */
		generatePositionData: function(iaData) {
			var laConfigData = gaBlockFieldsDetails;
			var laFields = [];
			for (var keys in iaData[0]) {
				var loField = {};
				loField.fieldId = keys;
				laFields.push(loField);
			}
			//Get Column Names
			laFields = this.fieldIdToNameMapping(laFields, laConfigData);
			for (var i = 0; i < iaData.length; i++) {
				for (var j = 0; j < laFields.length; j++) {
					if (iaData[i][laFields[j].fieldId]) {
						iaData[i][laFields[j].fieldId] = this.formatDataIfDate(iaData[i][laFields[j].fieldId]);
						if (laFields[j].position >= 10 && laFields[j].position < 20) {
							if (!iaData[i].position1) {
								iaData[i].position1 = iaData[i][laFields[j].fieldId];
							} else {
								iaData[i].position1 = iaData[i].position1 + ", " + iaData[i][laFields[j].fieldId];
							}
						} else if (laFields[j].position >= 20 && laFields[j].position < 30) {
							if (!iaData[i].position2) {
								iaData[i].position2 = iaData[i][laFields[j].fieldId];
							} else {
								iaData[i].position2 = iaData[i].position2 + ", " + iaData[i][laFields[j].fieldId];
							}
						} else if (laFields[j].position >= 30 && laFields[j].position < 40) {
							if (!iaData[i].position3) {
								iaData[i].position3 = iaData[i][laFields[j].fieldId];
							} else {
								iaData[i].position3 = iaData[i].position3 + ", " + iaData[i][laFields[j].fieldId];
							}
						} else if (laFields[j].position >= 40 && laFields[j].position < 50) {
							if (!iaData[i].position4) {
								iaData[i].position4 = iaData[i][laFields[j].fieldId];
							} else if (laFields[j].position == 40) {
								iaData[i].position4 = iaData[i][laFields[j].fieldId] + ", " + iaData[i].position4;
							} else {
								iaData[i].position4 = iaData[i].position4 + ", " + iaData[i][laFields[j].fieldId];
							}
						} else if (laFields[j].position >= 50) {
							if (!iaData[i].position5) {
								iaData[i].position5 = iaData[i][laFields[j].fieldId];
							} else {
								iaData[i].position5 = iaData[i].position5 + ", " + iaData[i][laFields[j].fieldId];
							}
						}
					}
				}
				// Enclose the position data with brackets if more then one data to be displayed 
				this.encloseIfMoreThenOne(iaData[i]);
			}

		},

		/**
		 * Date format (yyyy-mm-dd)
		 * 
		 * @param {String} isText is list data element
		 * 
		 * @returns {String} isText is returning list data element with proper date format
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
		 * Enclose braces to the position data if more then one data found
		 * 
		 * @param {object} ioData is data object
		 */
		encloseIfMoreThenOne: function(ioData) {
			if (ioData.position1) {
				if (ioData.position1.search(",") != -1) {
					ioData.position1 = "( " + ioData.position1 + " )";
				}
			}
			if (ioData.position2) {
				if (ioData.position2.search(",") != -1) {
					ioData.position2 = "( " + ioData.position2 + " )";
				}
			}
			if (ioData.position3) {
				if (ioData.position3.search(",") != -1) {
					ioData.position3 = "( " + ioData.position3 + " )";
				}
			}
			if (ioData.position4) {
				if (ioData.position4.search(",") != -1) {
					ioData.position4 = "( " + ioData.position4 + " )";
				}
			}
			if (ioData.position5) {
				if (ioData.position5.search(",") != -1) {
					ioData.position5 = "( " + ioData.position5 + " )";
				}
			}
		},

		/**
		 * Map the fields of the imported json array to its corresponding configuration in the configuration list
		 * 
		 * @param {String} iaFields is fields of the imported json array
		 * 
		 * @param {String} iaConfig is configuration data
		 * 
		 * @returns {Array} is returning mapped configuration data
		 */
		fieldIdToNameMapping: function(iaFields, iaConfig) {
			var lafields = [];
			for (var i = 0; i < iaFields.length; i++) {
				if (iaConfig.length > 0) {
					for (var j = 0; j < iaConfig.length; j++) {
						var loField = {};
						if (iaConfig[j].documentType.toUpperCase() == this.options.documentType.toUpperCase()) {
							for (var k = 0; k < iaConfig[j].blockFields.length; k++) {
								if (iaFields[i].fieldId === iaConfig[j].blockFields[k].fieldId) {
									if (iaConfig[j].blockFields[k].m.positionInMobileList) {
										loField.fieldId = iaConfig[j].blockFields[k].fieldId;
										loField.position = iaConfig[j].blockFields[k].m.positionInMobileList;
										lafields.push(loField);
									}
									break;
								}
							}
						}
					}
				}
			}

			return lafields;
		}
};