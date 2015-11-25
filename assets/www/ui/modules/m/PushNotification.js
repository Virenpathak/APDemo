//Declare
jQuery.sap.declare("modules.m.PushNotification");
//Require
jQuery.sap.require("modules.SettingsIconAction");

//CONSTRUCTOR
modules.m.PushNotification = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 * Object instance methods
 */
modules.m.PushNotification.prototype = {
		defaultSettings: {
			page: ""
		},

		/**
		 * Initialize the control and its internal aggregations.
		 */
		init: function() {
			this._oTitle = null;
			this.options.bodyContainer = null;
			this._oList = null;
			this._oMenuButton = null;
			this._oNavButton = null;
			this._oSettings = null;
			this._oRefresh = null;
			this.options.switchButton = null;
			this.options.switchToolbar = null;
			this.options.panelContainer = null;
			this.options.footerBar = null;
			this.documentType = this.options.documentType;

			this.createHeader();
			this.createBody();
			this.createFooter();
		},

		/**
		 * Title for Push Notification from internationalization
		 */
		setPageTitle: function() {
			this.getTitle().setText(goBundle.getText("PUSH_NOTIFICATION"));
		},

		/**
		 * Returns text element for this instance
		 * 
		 * @returns {sap.m.Text} is title
		 */
		getTitle: function() {
			return this._oTitle;
		},

		/**
		 * Returns body container for this instance
		 * 
		 * @returns bodyContainer
		 */
		getBodyContainer: function() {
			return this.options.bodyContainer;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.Button} is navigation button
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Returns button element for this instance
		 * 
		 * @returns {sap.m.Button} is Setting button
		 */
		getSettingsButton: function() {
			return this._oSettings;
		},

		/**
		 * Returns VBox element for this instance
		 * 
		 * @returns {sap.m.VBox} is vertical arrangement
		 */
		getPanelContainer: function() {
			return this.options.panelContainer;
		},

		/**
		 * Returns bar element for this instance
		 * 
		 * @returns {sap.m.Bar} is footer bar
		 */
		getFooterBar: function() {
			return this.options.footerBar;
		},

		/**
		 * Creates the header object with required styling
		 */
		createHeader: function() {
			var _self = this;
			var loTitle = new sap.m.Text();
			this._oTitle = loTitle;

			//	Navigation button for search field navigation
			var loNavButton = new sap.m.Button({
				visible: true,
				icon: "sap-icon://nav-back",
				press: function(ioEvent) {
					_self.onPressNavButton();
				}
			});
			this._oNavButton = loNavButton;

			var loSettingsIconAction = new modules.SettingsIconAction({
				page: this.options.page
			});
			var loActionSheet = loSettingsIconAction.getActionSheet();

			//	Setting button for display action sheet
			var loSettingsButton = new sap.m.Button({
				icon: "sap-icon://action-settings",
				press: function(ioEvent) {
					loActionSheet.openBy(ioEvent.getSource());
				}
			});
			this._oSettings = loSettingsButton;

			//	All header objects added in header Bar
			var loHeaderBar = new sap.m.Bar({
				design: sap.m.BarDesign.SubHeader,
				contentLeft: loNavButton,
				contentMiddle: [loTitle],
				contentRight: loSettingsButton
			});
			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		/**
		 * Creates body container for require styling
		 */
		createBody: function() {
			this.getPushNotificationData();
		},

		/**
		 * Panel container for each document order for displaying the setting for push notification 
		 * 
		 * @param {object} ioPushSettingData is data object
		 */
		getPushNotificationSetting: function(ioPushSettingData) {
			var _self = this;
			var loPanelVBox = new sap.m.VBox({
				items: [new sap.m.Panel({
					backgroundDesign: sap.m.BackgroundDesign.Translucent,
					headerText: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"),
					expandable: true,
					expanded: true,
					content: [_self.panelContent(ioPushSettingData)],
					headerToolbar: new sap.m.Toolbar({
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT")
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.CheckBox({
							selected: true,
							select: function(ioEvent) {
								_self.onCheckCreditPanelExpand(ioEvent, ioPushSettingData);
							}
						})
						]
					})
				}), new sap.m.Panel({
					backgroundDesign: sap.m.BackgroundDesign.Translucent,
					headerText: "DAM",
					expandable: true,
					headerToolbar: new sap.m.Toolbar({
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT")
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.CheckBox({
							select: function(ioEvent) {
								_self.onCheckDiscountPanelExpand(ioEvent, ioPushSettingData);
							}
						})
						]
					})
				}), new sap.m.Panel({
					backgroundDesign: sap.m.BackgroundDesign.Translucent,
					headerText: "DIS",
					expandable: true,
					headerToolbar: new sap.m.Toolbar({
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED")
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.CheckBox({
							select: function(ioEvent) {
								_self.onCheckDamagedPanelExpand(ioEvent, ioPushSettingData);
							}
						})
						]
					})
				}), new sap.m.Panel({
					backgroundDesign: sap.m.BackgroundDesign.Translucent,
					headerText: "MRV",
					expandable: true,
					headerToolbar: new sap.m.Toolbar({
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL")
						}),
						new sap.m.ToolbarSpacer(),
						new sap.m.CheckBox({
							select: function(ioEvent) {
								_self.onCheckMaterialPanelExpand(ioEvent, ioPushSettingData);
							}
						})
						]
					})
				})]
			});
			this.options.panelContainer = loPanelVBox;
			this.options.page.addContent(loPanelVBox);
		},

		/**
		 * Event handle in check box, credit blocked order panel will get expand and collapse
		 *  
		 * @param {Event} ioEvent is the fired event
		 * 
		 * @param {object} ioPushSettingData is data object
		 */
		onCheckCreditPanelExpand: function(ioEvent, ioPushSettingData) {
			var loCheckPanel = ioEvent.getSource().getSelected();
			//			var loCheckPanel = ioPushSettingData.crActive;
			var loPanel = ioEvent.getSource().getParent().getParent();
			if (loCheckPanel == true) {
				loPanel.setExpanded(true);
			} else {
				var loPanel = ioEvent.getSource().getParent().getParent();
				loPanel.setExpanded(false);
			}
		},

		/**
		 * Event handle in check box, discount order panel will get expand and collapse
		 *  
		 * @param {Event} ioEvent is the fired event
		 * 
		 * @param {object} ioPushSettingData is data object
		 */
		onCheckDiscountPanelExpand: function(ioEvent, ioPushSettingData) {
			var loCheckPanel = ioEvent.getSource().getSelected();
			//			var loCheckPanel = ioPushSettingData.discActive;
			var loPanel = ioEvent.getSource().getParent().getParent();
			if (loCheckPanel == true) {
				loPanel.setExpanded(true);
			} else {
				var loPanel = ioEvent.getSource().getParent().getParent();
				loPanel.setExpanded(false);
			}
		},

		/**
		 * Event handle in check box, damaged order panel will get expand and collapse
		 *  
		 * @param {Event} ioEvent is the fired event
		 * 
		 * @param {object} ioPushSettingData is data object
		 */
		onCheckDamagedPanelExpand: function(ioEvent, ioPushSettingData) {
			var loCheckPanel = ioEvent.getSource().getSelected();
			//			var loCheckPanel = ioPushSettingData.damActive;
			var loPanel = ioEvent.getSource().getParent().getParent();
			if (loCheckPanel == true) {
				loPanel.setExpanded(true);
			} else {
				var loPanel = ioEvent.getSource().getParent().getParent();
				loPanel.setExpanded(false);
			}
		},

		/**
		 * Event handle in check box, material return panel will get expand and collapse
		 *  
		 * @param {Event} ioEvent is the fired event
		 * 
		 * @param {object} ioPushSettingData is data object
		 */
		onCheckMaterialPanelExpand: function(ioEvent, ioPushSettingData) {
			var loCheckPanel = ioEvent.getSource().getSelected();
			//			var loCheckPanel = ioPushSettingData.mrActive;
			var loPanel = ioEvent.getSource().getParent().getParent();
			if (loCheckPanel == true) {
				loPanel.setExpanded(true);
			} else {
				var loPanel = ioEvent.getSource().getParent().getParent();
				loPanel.setExpanded(false);
			}
		},

		/**
		 * Push notification data setting inside the panel container
		 * 
		 * @param {object} ioPushSettingData is data object
		 * 
		 * @returns {sap.m.VBox} container object is displayed on vertically one by one
		 */
		panelContent: function(ioPushSettingData) {
			var loPushNotificationData = ioPushSettingData.d;

			//	Order Value
			var loVBox = new sap.m.VBox().addStyleClass("pushSelectedPanelContentVBox");
			var loToolbar = new sap.m.Toolbar();
			loVBox.addItem(loToolbar);
			loToolbar.addContent(new sap.m.Text({
				text: "Order Value"
			}).addStyleClass("pushSelectedPanelContentText"));
			loToolbar.addContent(new sap.m.ToolbarSpacer({

			}));
			loToolbar.addContent(new sap.m.Text({
				text: ">"
			}).addStyleClass("pushSelectedPanelContentGreaterThan"));
			loToolbar.addContent(new sap.m.Input({
				value: loPushNotificationData.crValue
			}));

			//	Credit Limit
			var loToolbar = new sap.m.Toolbar();
			loVBox.addItem(loToolbar);
			loToolbar.addContent(new sap.m.Text({
				text: "Credit Limit"
			}).addStyleClass("pushSelectedPanelContentText"));
			loToolbar.addContent(new sap.m.ToolbarSpacer({

			}));
			loToolbar.addContent(new sap.m.Text({
				text: ">"
			}).addStyleClass("pushSelectedPanelContentGreaterThan"));
			loToolbar.addContent(new sap.m.Input({
				value: loPushNotificationData.crLimit
			}));

			//	Number of orders
			var loToolbar = new sap.m.Toolbar();
			loVBox.addItem(loToolbar);
			loToolbar.addContent(new sap.m.Text({
				text: "No. of Orders"
			}).addStyleClass("pushSelectedPanelContentText"));
			loToolbar.addContent(new sap.m.ToolbarSpacer({

			}));
			loToolbar.addContent(new sap.m.Text({
				text: ">"
			}).addStyleClass("pushSelectedPanelContentGreaterThan"));
			loToolbar.addContent(new sap.m.Input({
				value: loPushNotificationData.crNoOrders
			}));

			return loVBox;
		},

		/**
		 * ajax call
		 * 
		 * Get data from service URL for push notification for push notification setting in panel container.
		 * 
		 */
		getPushNotificationData: function() {
			var _self = this;
			var loParam = {
					url: getUrl("pushNotification"),
					async: true
			};

			var loAjaxCall = new framework.ajax({
				param: loParam,
				/**
				 * ajax success response
				 * 
				 * @param {object} ioData is data object
				 * 
				 * @param {String} isTextStatus is success message status
				 * 
				 * @param {object} ioJqXHR is response
				 */
				success: function(ioData, isTextStatus, ioJqXHR) {
					if (ioData) {
						_self.getPushNotificationSetting(ioData);
					} else {
						_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
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
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Creates the footer object with required styling
		 */
		createFooter: function() {
			var _self = this;
			var loFooterBar = new sap.m.Bar({
				visible: true,
				contentRight: [new sap.m.Button({
					text: goBundle.getText("SUBMIT"),
					width: "150px",
					type: "Accept",
					press: function(ioEvent) {
						_self.onPressSubmit(ioEvent);
					}
				})]
			});
			this.options.footerBar = loFooterBar;
			this.options.page.setFooter(loFooterBar);
		},

		/**
		 * On click of setting icon button in header bar
		 */
		onPressSettings: function() {

		},

		/**
		 * On click of back navigation, it will navigating to the previous page
		 */
		onPressNavButton: function() {
			window.history.go(-1);
		},

		/**
		 * On click of submit button, get the data from push notification setting and update the data in back end system
		 * 
		 * @param {Event} ioEvent is the fired event
		 */
		onPressSubmit: function(ioEvent) {
			var lrSelectedPanel = [];
			var lrSettingValue = [];
			var loPayload = {};

			var loSettingData = this.getPanelContainer().getItems();
			for (var i = 0; i < loSettingData.length; i++) {
				var loPanelHeader = loSettingData[i].getHeaderToolbar().getContent()[2].getSelected();
				lrSelectedPanel.push(loPanelHeader);
			}
			for (var i = 0; i < loSettingData.length; i++) {
				var loPanelContent = loSettingData[i].getContent();
				for (j = 0; j < loPanelContent.length; j++) {
					var loPanelContentItems = loPanelContent[j].getItems();
					for (k = 0; k < loPanelContentItems.length; k++) {
						var loPanelContentItemsValue = loPanelContentItems[k].getContent()[3].getValue();
						lrSettingValue.push(loPanelContentItemsValue);
					}
				}
			}

			loPayload.UserID = goConfig.userId;
			if (lrSelectedPanel[0]) {
				loPayload.crActive = "X";
			} else {
				loPayload.crActive = "";
			}
			if (lrSelectedPanel[1]) {
				loPayload.discActive = "X";
			} else {
				loPayload.discActive = "";
			}
			if (lrSelectedPanel[2]) {
				loPayload.damActive = "X";
			} else {
				loPayload.damActive = "";
			}
			if (lrSelectedPanel[3]) {
				loPayload.mrActive = "X";
			} else {
				loPayload.mrActive = "";
			}

			loPayload.crValue = lrSettingValue[0];
			loPayload.crLimit = lrSettingValue[1];
			loPayload.crNoOrders = lrSettingValue[2];

			this.submitPushNotificationSetting(loPayload);
		},

		/**
		 * On click of submit button, calling the push notification url and get the data from panel container and post in to the
		 * back end system
		 * 
		 * @param {object} ioData is data object
		 */
		submitPushNotificationSetting: function(ioData) {
			var loParam = {
					url: getUrl("pushNotification"),
					type: "POST",
					data: ioData,
					async: true
			};
			// busy indicator displayed, while calling service url
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [this.options.page]
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				success: function(ioData, isTextStatus, ioJqXHR) {
					sap.m.MessageToast.show(goBundle.getText("PUSH_UPDATE_SUCCESSFUL"));
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					sap.m.MessageToast.show(goBundle.getText("SERVICE_CALL_FAILED"));
				}
			});
			loAjaxCall.call();
		}
};