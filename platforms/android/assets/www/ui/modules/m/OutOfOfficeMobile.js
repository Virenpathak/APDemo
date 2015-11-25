jQuery.sap.declare("modules.m.OutOfOfficeMobile");
jQuery.sap.require("modules.SettingsIconAction");
//CONSTRUCTOR
modules.m.OutOfOfficeMobile = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

//object instance methods
modules.m.OutOfOfficeMobile.prototype = {
		defaultSettings: {
			page: ""
		},
//		initialization function
		init: function() {
			this._oTitle = null;
			this.options.bodyContainer = null;
			this._oMenuButton = null;
			this._oNavButton = null;
			this._oSettings = null;
			this.options.switchButton = null;
			this.options.switchToolbar = null;
			this.options.panelContainer = null;
			this.options.footerBar = null;
			this.options.block = null;
			this._oSFData = null;
			this._oStartDate = null;
			this._oEndDate = null;
			this._oReason = null;

			this.createHeader();
			this.createBody();
			this.createFooter();
			this.getModelData();
		},

		/**
		 * Setting Text to The Title
		 */
		setPageTitle: function() {
			this.getTitle().setText(goBundle.getText("OUT_OF_OFFICE"));
		},

		/**
		 * Title for the Out of Office Page
		 * 
		 * @returns {sap.m.Text}
		 */
		getTitle: function() {
			return this._oTitle;
		},

		/**
		 * Body Container 
		 * 
		 * @returns
		 */
		getBodyContainer: function() {
			return this.options.bodyContainer;
		},

		/**
		 * Success Factor Data
		 * 
		 * @returns {sap.ui.model.json.JSONModel|_oSFData}
		 */
		getSFData: function() {
			return this._oSFData;
		},

		/**
		 * Get the Start Date
		 * 
		 * @returns {Date Object|_oStartDate}
		 */
		getStartDate: function() {
			return this._oStartDate;
		},

		/**
		 * Get the End Date
		 * 
		 * @returns {Date Object|_oEndDate}
		 */
		getEndDate: function() {
			return this._oEndDate;
		},

		/**
		 * Get the Reason
		 * 
		 * @returns {String|_oReason}
		 */
		getReason: function() {
			return this._oReason;
		},

		/**
		 * Switch toolbar 
		 * 
		 * @returns 
		 */
		getSwitchToolbar: function() {
			return this.options.switchToolbar;
		},

		/**
		 * Menu Button 
		 * 
		 * @returns {sap.m.Button}
		 */
		getMenuButton: function() {
			return this._oMenuButton;
		},

		/**
		 * Navigation Button for out of Office
		 * 
		 * @returns {sap.m.Button} 
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Setting Button for Out of Office
		 * 
		 * @returns {sap.m.Button}
		 */
		getSettingsButton: function() {
			return this._oSettings;
		},

		/**
		 * Panel Container for Out of Office
		 * 
		 * @returns {sap.m.VBox}
		 */
		getPanelContainer: function() {
			return this.options.panelContainer;
		},

		/**
		 * Switch for Setting out of Office ON or OFF
		 * 
		 * @returns {sap.m.Switch}
		 */
		getSwitchButton: function() {
			return this.options.switchButton;
		},

		/**
		 * Footer Bar for Out Of Office
		 * 
		 * @returns {sap.m.Bar}
		 */
		getFooterBar: function() {
			return this.options.footerBar;
		},

		/**
		 * Creating Header for The Out of Office Page
		 */
		createHeader: function() {
			var _self = this;
			var loTitle = new sap.m.Text();
			this._oTitle = loTitle;

			var loMenuButton = new sap.m.Button({
				icon: "sap-icon://menu2",
				visible: false,
				press: function(ioEvent) {
					_self.onPressMenuButton(ioEvent);
				}
			});

			this._oMenuButton = loMenuButton;

			var loNavButton = new sap.m.Button({
				visible: true,
				icon: "sap-icon://nav-back",
				press: function(ioEvent) {
					_self.onPressNavButton(ioEvent);
				}
			});

			this._oNavButton = loNavButton;

			var loSettingsIconAction = new modules.SettingsIconAction({
				page: this.options.page
			});
			var loActionSheet = loSettingsIconAction.getActionSheet();

			var loSettingsButton = new sap.m.Button({
				icon: "sap-icon://action-settings",
				press: function(ioEvent) {
					loActionSheet.openBy(ioEvent.getSource());
				}
			});
			this._oSettings = loSettingsButton;

			var loHeaderBar = new sap.m.Bar({
				design: sap.m.BarDesign.SubHeader,
				contentLeft: [loMenuButton, loNavButton],
				contentMiddle: [loTitle],
				contentRight: [loSettingsButton]
			});

			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		/**
		 * On click of the Push Notification to call the Push Notification Screen
		 * 
		 * @param [object] ioEvent
		 */
		onPressPushNotification: function(ioEvent) {
			var loView = this.options.page.getParent();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
			loRouter.navTo("PushNotification");
		},

		/**
		 * On click of the Out of Office to Call the Out of Office Screen
		 * 
		 * @param [object] ioEvent
		 */
		onPressOutOfOffice: function(ioEvent) {
			var loView = this.options.page.getParent();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
			loRouter.navTo("OutOfOffice");
		},

		/**
		 * Event handler for back button
		 */
		onPressNavButton: function() {
			window.history.go(-1);
		},

		/**
		 * Create the Body of Out of Office
		 */
		createBody: function() {
//			Defining the main VBox for the Body and add it in the Panel Container 
			var loVBox = new sap.m.VBox().addStyleClass("OutOfOfficeWebBodyContainer");
			this.options.bodyContainer = loVBox;

//			Calling the Switch Tool Bar and add it in the Body
			this.createSwitchToolbar();
			if (this.getSwitchToolbar()) {
				loVBox.addItem(this.getSwitchToolbar());
			}

//			Defining the VBox for Panel and add it ot the Panel Container 
			var loPanelVBox = new sap.m.VBox();
			this.options.panelContainer = loPanelVBox;
			loVBox.addItem(loPanelVBox);

//			Calling the createAllPanels function for Creating panels 
			this.createAllPanels();

//			Adding Body to the Page		
			if (this.options.page) {
				this.options.page.addContent(loVBox);
			}
		},

		/**
		 * Switch Tool Bar for Out of Office
		 */
		createSwitchToolbar: function() {
			var _self = this;
			var loToobarLabel = new sap.m.Toolbar({
				width: "100%"
			}).addStyleClass("OutOfOfficeWebLabelToolbar");

			var loLabelOOO = new sap.m.Label({
				text: "Out of Office"
			}).addStyleClass("OutOfOfficeWebLabelOOO");
			loToobarLabel.addContent(loLabelOOO);

//			Defining the switch
			var loSwitch = new sap.m.Switch({
				state: false,
				customTextOn: goBundle.getText("ON"),
				customTextOff: goBundle.getText("OFF"),
				change: function(ioEvent) {
					_self.onChangeSwitch();

					var laPanel = _self.getPanelContainer().getItems()[0].getItems();
					var rbFlag = false;
					for (var i = 0; i < laPanel.length; i++) {
						var loPanel = laPanel[i];
						var loCheckBoxState = laPanel[i].getHeaderToolbar().getContent()[1].getSelected();
						if (loCheckBoxState) {
							rbFlag = true
//							_self.getFooterBar().setVisible(true);
						} else {

						}
					}
					if (rbFlag){
						_self.getFooterBar().setVisible(true);
					}else {
						_self.getFooterBar().setVisible(false);
					}

				}
			});

//			Adding the Switch and Label
			this.options.switchButton = loSwitch;
			loToobarLabel.addContent(loSwitch);
			this.options.switchToolbar = loToobarLabel;
		},

		/**
		 *On Change of the state of the switch
		 */
		onChangeSwitch: function() {
			if (this.getSwitchButton().getState()) {
				this.getPanelContainer().setVisible(true);
			} else {
				this.getPanelContainer().setVisible(false);
			}
		},

		/**
		 * Getting Success Factor Data
		 * 
		 * @returns {sap.ui.model.json.JSONModel}
		 */
		getModelData: function() {
			var _self = this;
			var loParam = {
					url: getUrl("SFUserData")+"110769')/manager",//goConfig.userId + "')/manager", TODO:
					async: true,
					username : goConfig.sfUserName,
					password: goConfig.sfPassword
//					username : goConfig.userId,
//					password: goConfig.password
			};
			//	Display busy indicator, while fetching data
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [this.getBodyContainer()]
			};
			//	Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				success: function(ioData, isTextStatus, ioJqXHR) {
					var loName = ioData.d.firstName + ioData.d.lastName;
					var loDes = ioData.d.title;
					var loEmpId = ioData.d.userId;
					var loParam = {
							url: getUrl("SFUserData") + loEmpId + "')/directReports",
							async: false,
							username : goConfig.sfUserName,
							password: goConfig.sfPassword
//							username : goConfig.userId,
//							password: goConfig.password
					};
					var loSFAjaxCall = new framework.ajax({
						param: loParam ,
						localBusyIndicator: loLocalBusyIndicator,
						success: function(ioData, isTextStatus, ioJqXHR) {
							var loSFData = ioData.d;
							// Add a blank space at beginning
							loSFData.results.unshift({userId:"Select Substitute",firstName:"",lastName:""})
							_self.getSFModelData(loSFData);
						},
						error: function(ioJqXHR, isTextStatus, isErrorThrown) {
							_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
						}
					});
					loSFAjaxCall.call();
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Get the SF Model Data
		 * 
		 * @param {Controller} ioEvent Event Controller
		 */
		getSFModelData: function(ioEvent) {
			var _self = this;
			var loSFModel = new sap.ui.model.json.JSONModel();
			loSFModel.setData(ioEvent);
			this._oSFData = loSFModel;

		},

		/**
		 * Creating Panels for the Initial Load with Success Factor Data
		 */
		createPanels: function() {
			var _self = this;
			var loPanelVBox = this.getPanelContainer();
			loPanelVBox.destroyItems();
			var loPanel = new sap.m.VBox({
				items: [new sap.m.Panel({
					expandable: true, // boolean, since 1.22
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"),
						}).addStyleClass("OutOfOfficePanelText"),
						_self._getCheckBox()
						]
					}),
					expand: function(ioEvent) {
						_self.onExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true,
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT"),//"Discount Orders",
						}).addStyleClass("OutOfOfficePanelText"),
						_self._getCheckBox()
						]
					}),
					expand: function(ioEvent) {
						_self.onExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true,
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [
						          new sap.m.Text({
						        	  text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED"),//"Damaged Orders",
						          }).addStyleClass("OutOfOfficePanelText"),
						          _self._getCheckBox()
						          ]
					}),
					expand: function(ioEvent) {
						_self.onExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true, // boolean, since 1.22
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [
						          new sap.m.Text({
						        	  text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"),//"Material Return",
						          }).addStyleClass("OutOfOfficePanelText"),
						          _self._getCheckBox()
						          ]
					}),
					expand: function(ioEvent) {
						_self.onExpand(ioEvent);
					}
				})
				]
			});
			loPanelVBox.addItem(loPanel);
		},

		/**
		 * User input box for Start data, End Date and Reason
		 * 
		 * @returns {object|sap.m.VBox}
		 */
		_getVBox: function() {
			var _self = this;
			var loStartDatePicker = new sap.m.DatePicker({
				change: function(ioValue) {
					_self.onSDateChange(ioValue);
				}
			});

			var loEndDatePicker = new sap.m.DatePicker({
				change: function(ioValue) {
					_self.onEDateChange(ioValue);
				}
			});
			
			return new sap.ui.layout.form.SimpleForm({
				content : [
				           new sap.m.Label({
				        	   text: goBundle.getText("START_DATE")
				           }),
				           loStartDatePicker,
				           new sap.m.Label({
								text: goBundle.getText("END_DATE")
							}),
						   loEndDatePicker,
						   new sap.m.Label({
								text: goBundle.getText("REASON")
							}),
						   new sap.m.Input({
								width: "100%",
								maxLength: 25 ,
								change: function(ioEvent) {
									_self._oReason = ioEvent.getSource().getValue();
								}
							}),
							new sap.m.Label({
					        	text: goBundle.getText("SUB1")
					        }),
					        _self._getDropDown(),
//					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput(),
					        
					        new sap.m.Label({
					        	text: goBundle.getText("SUB2")
					        }),
					        _self._getDropDown(),
//					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
							
				           
				           ]
			});
			
		},

		/**
		 * Select for Showing Substitute Data
		 * 
		 * @returns {object|sap.m.Select}
		 */
		_getDropDown: function() {
			return new sap.m.Select({
				autoAdjustWidth : true,
				items: {
					path: '/results',
					template: new sap.ui.core.Item({
						key: '{userId}',
						text: '{userId}' + ' ' + '{firstName}' + " " + '{lastName}',
					})
				},
				change: function(ioEvent) {
					var loKey = this.getSelectedKey();
					if (loKey === "Select Substitute") {
						this.getParent().getFields()[1].setEnabled(true);
					} else {
						this.getParent().getFields()[1].setEnabled(false);
					}

				}
			}).addStyleClass("OutOfOfficeDateBlock");
		},

		/**
		 * Input field for Pid
		 * 
		 * @returns {object|sap.m.Input}
		 */
		_getInput: function() {
			var _self = this;
			return new sap.m.Input({
				placeholder: goBundle.getText("PID"),
				enabled: false,
				change: function(ioEvent) {
					_self.onInputChange(ioEvent);
				}
			}).addStyleClass("OutOfOfficeDateBlock");
		},

		/**
		 * On change of the Pid
		 * 
		 * @param [Object] ioEvent
		 */
		onInputChange: function(ioEvent) {
			var loInput = ioEvent.getSource();
			var loEmpId = loInput.getValue().substring(1).replace(/^[0]+/g, "");
			var loSelect = ioEvent.getSource().getParent().getFields()[0];
			var loParam = {
					url: getUrl("SFUserData")+ loEmpId + "')",
					async: true,
					username : goConfig.sfUserName,
					password: goConfig.sfPassword
//					username : goConfig.userId,
//					password: goConfig.password
			};

			if (loInput.getValue()){

				var loAjaxCall = new framework.ajax({
					param: loParam,
					success: function(ioData) {
						if (loInput.getValue()) {
							loInput.setValueState("None");
							loSelect.setEnabled(false);
						}
					},
					error: function() {
						loInput.setValue("");
						if (!loInput.getValue()) {
							loInput.setValueState("Error");

						}
					}
				});
				loAjaxCall.call();

			} else {
				loSelect.setEnabled(true);
			}
		},

		/**
		 * Check Box for Panel 
		 * 
		 * @returns {object|sap.m.CheckBox}
		 */
		_getCheckBox: function() {
			var _self = this;
			iCheck = 0;
			return new sap.m.CheckBox({
				select: function(ioEvent) {
					if (this.getSelected() == true) {
						iCheck++;
						_self.getFooterBar().setVisible(true);
					} else {
						iCheck = iCheck - 1;
						if (iCheck == 0) {
							_self.getFooterBar().setVisible(false);
						}
					}
				}
			}).addStyleClass("OutOfOfficeMobileCheckBox");
		},

		/**
		 * On expand of the Panel
		 * 
		 * @param [Object]ioEvent
		 */
		onExpand: function(ioEvent) {
			var _self = this;
			if (ioEvent.getSource().getExpanded() == true) {
//				iCheck = 0;
				var loModel = _self.getSFData();
				ioEvent.getSource().removeAllContent();
				ioEvent.getSource().insertContent(_self._getVBox(), 0).setModel(loModel);

				var loSDatePicker = ioEvent.getSource().getContent()[0].getContent()[1];
				var loEDatePicker = ioEvent.getSource().getContent()[0].getContent()[3];
				var loReason = ioEvent.getSource().getContent()[0].getContent()[5];
				var loSDate = _self.getStartDate();
				var loEDate = _self.getEndDate();
				var loRes = _self.getReason();

				if (loSDatePicker.getValue()==="" && loSDate != null ) {
					loSDatePicker.setDateValue(loSDate);
				}
				if (loEDatePicker.getValue()==="" && loEDate != null ) {
					loEDatePicker.setDateValue(loEDate);
				}
				if (loReason.getValue()==="" && loRes != null ) {
					loReason.setValue(loRes);
				}
			}
		},

		/**
		 * On Start Date Change 
		 * 
		 * @param [object] ioEvent Object for Start date Input
		 */
		onSDateChange: function(ioEvent) {
			ioEvent.oSource.setValueState("None");
			var oDate = ioEvent.oSource.mProperties.dateValue;
			var oSdate = oDate.getTime();//oDate.getDate() + "-" + oDate.getMonth() + "-" + oDate.getFullYear();
			var oTdate = new Date();
			var oCDate = oTdate.setHours(0,0,0,0);//oTdate.getDate() + "-" + oTdate.getMonth() + "-" + oTdate.getFullYear();
			if (oSdate < oCDate) {
				jQuery(function() {
					jQuery.sap.require('sap.m.MessageBox');

					function fnCallbackMessageBox(oAction) {
						console.log(oAction);
					}
					sap.m.MessageBox.show(
							goBundle.getText("DATE_ERROR"), {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Warning",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: fnCallbackMessageBox
							});
				});
				ioEvent.getSource().setValue();
			} else {
				var loValue = this.getStartDate();
				if (loValue === null) {
					this._oStartDate = oDate;
				}
			}
		},

		/**
		 * On End Date Change 
		 * 
		 * @param [object] ioEvent Object for End Date Input 
		 */
		onEDateChange: function(ioEvent) {
			ioEvent.oSource.setValueState("None");
			var loSdate = ioEvent.getSource().getParent().getParent().getFormElements()[0].getFields()[0].getDateValue();
			var oSdate = loSdate.getTime();//loSdate.getDate() + "-" + loSdate.getMonth() + "-" + loSdate.getFullYear();
			var loEdate = ioEvent.oSource.mProperties.dateValue;
			var oEdate = loEdate.getTime();//loEdate.getDate() + "-" + loEdate.getMonth() + "-" + loEdate.getFullYear();
			if (oEdate < oSdate) {
				jQuery(function() {
					jQuery.sap.require('sap.m.MessageBox');

					function fnCallbackMessageBox(oAction) {
						console.log(oAction);
					}
					sap.m.MessageBox.show(
							goBundle.getText("END_DATE_ERROR"), {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Warning",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: fnCallbackMessageBox
							});
				});
				ioEvent.getSource().setValue();
			}else {
				var loValue = this.getEndDate();
				if (loValue === null) {
					this._oEndDate = loEdate;
				}
			}
		},

		/**
		 * Creating Panels for showing Backend Data
		 */
		createDataPanel: function() {
			var _self = this;
			var loPanelVBox = this.getPanelContainer();
			loPanelVBox.destroyItems();
			var loPanel = new sap.m.VBox({
				items: [new sap.m.Panel({
					expandable: true,
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"),//"Credit Blocked Orders",
						}).addStyleClass("OutOfOfficePanelText"),
						_self._getCheckBox()
						]
					}),
					expand: function(ioEvent) {
						_self.onPanelExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true,
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT"),//"Discount Orders",
						}).addStyleClass("OutOfOfficePanelText"),
						_self._getCheckBox()
						]
					}),
					expand: function(ioEvent) {
						_self.onPanelExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true, // boolean, since 1.22
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [new sap.m.Text({
							text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED"),//"Damaged Orders",
						}).addStyleClass("OutOfOfficePanelText"),
						_self._getCheckBox()
						]
					}),
					expand: function(ioEvent) {
						_self.onPanelExpand(ioEvent);
					}
				}),
				new sap.m.Panel({
					expandable: true,
					expanded: false,
					headerToolbar: new sap.m.Toolbar({
						width: "95%",
						active: true,
						content: [
						          new sap.m.Text({
						        	  text: goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"),//"Material Return",
						          }).addStyleClass("OutOfOfficePanelText"),
						          _self._getCheckBox()
						          ]
					}),
					expand: function(ioEvent) {
						_self.onPanelExpand(ioEvent);
					}
				})
				]
			});
			loPanelVBox.addItem(loPanel);
		},

		/**
		 * On expand of the Panel
		 * 
		 * @param [Object] ioEvent
		 */
		onPanelExpand: function(ioEvent) {
			var _self = this;
			var loGetDocType = ioEvent.oSource.getHeaderToolbar().getContent()[0].getText();
			var loCheckBox = ioEvent.oSource.getHeaderToolbar().getContent()[1];
			var k;
			if (ioEvent.getSource().getExpanded() === true) {
				var loData = _self.getOOOData();
				var loModel = _self.getSFData();
				ioEvent.getSource().removeAllContent();
				ioEvent.getSource().insertContent(_self._getPanelBox().setModel(loModel));

				for (var i = 0; i < loData.d.results.length; i++) {
					var loDocType = _self.getDocumentTitle(loData.d.results[i].documentType);
					if (loDocType === loGetDocType) {
						var loSdate = ioEvent.getSource().getContent()[0].getContent()[1];
						loSdate.setDateValue(new Date(parseInt(loData.d.results[i].startDate.match(/\d+/)[0])));
						var loEdate = ioEvent.getSource().getContent()[0].getContent()[3];
						loEdate.setDateValue(new Date(parseInt(loData.d.results[i].endDate.match(/\d+/)[0])));
						loCheckBox.setSelected(true);
						var loReason = ioEvent.getSource().getContent()[0].getContent()[5];
						loReason.setValue(loData.d.results[i].reason);

						if (loData.d.results[i].sequenceNo === "1") {
							k = 7;
						} else {
							k = 10;
						}
						if (ioEvent.getSource().getContent().length != 0) {
							var loSelect = ioEvent.getSource().getContent()[0].getContent()[k];
							var loInput = ioEvent.getSource().getContent()[0].getContent()[k+1];
							var loSubId = loData.d.results[i].substituteId;
							var laSubId = [];
							for (var j = 0; j < loSelect.getItems().length; j++) {
								laSubId.push(loSelect.getItems()[j].getKey());
							}
							if (laSubId.indexOf(loSubId) >= 0) {
								loSelect.setSelectedKey(loSubId);
//								break;
							} else {
								loInput.setValue(loSubId);
								loInput.setEnabled(true);
								loSelect.setEnabled(false);
							}
						}
//						k++;
					}

				}
			} else {
				//				loBusyDig.close();
			}
			if (ioEvent.getSource().getContent().length === 0) {
				_self.onExpand(ioEvent);
			}
		},

		/**
		 * Creating the Content of the Panel
		 * 
		 * @returns {object|sap.m.VBox}
		 */
		_getPanelBox: function() {
			var _self = this;
			var loStartDatePicker = new sap.m.DatePicker({
				change: function(ioValue) {
					_self.onSDateChange(ioValue);
				}
			});

			var loEndDatePicker = new sap.m.DatePicker({
				change: function(ioValue) {
					_self.onEDateChange(ioValue);
				}
			});
			
			return new sap.ui.layout.form.SimpleForm({
				content : [
				           new sap.m.Label({
				        	   text: goBundle.getText("START_DATE")
				           }),
				           loStartDatePicker,
				           new sap.m.Label({
								text: goBundle.getText("END_DATE")
							}),
						   loEndDatePicker,
						   new sap.m.Label({
								text: goBundle.getText("REASON")
							}),
						   new sap.m.Input({
								width: "100%",
								maxLength: 25 ,
								change: function(ioEvent) {
									_self._oReason = ioEvent.getSource().getValue();
								}
							}),
							new sap.m.Label({
					        	text: goBundle.getText("SUB1")
					        }),
					        _self._getDropDown(),
//					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput(),
					        
					        new sap.m.Label({
					        	text: goBundle.getText("SUB2")
					        }),
					        _self._getDropDown(),
//					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
							
				           
				           ]
			});
			
		},

		/**
		 * Select for showing Substitute
		 * 
		 * @returns {object|sap.m.Select}
		 */
		_getPanelDropDown: function() {
			return new sap.m.Select({
				maxWidth: "50%",
				items: {
					path: '/results', //'/KEY',
					template: new sap.ui.core.Item({
						key: '{userId}',
						text: '{userId}' + ' ' + '{firstName}' + " " + '{lastName}',
					}),
				},
				change: function(ioEvent) {
					var loKey = this.getSelectedKey();
					if (loKey === "Select Substitute") {
						this.getParent().getItems()[3].setEnabled(true);
					} else {
						this.getParent().getItems()[3].setEnabled(false);
					}
//					this.getParent().getItems()[3].setEditable(false);
				}
			}).addStyleClass("OutOfOfficeDateBlock");
		},

		/**
		 * Creating the panels on the Basis of data
		 */
		createAllPanels: function() {
			var _self = this;
			if (this.getOOOData().d && this.getOOOData().d.results.length !== 0) {
				_self.getSwitchButton().setState(true);
				this.createDataPanel();
				_self.getPanelContainer().setVisible(true);
			} else {
				this.getPanelContainer().setVisible(false);
				this.createPanels();
			}
		},

		/**
		 * Get Backend Data
		 * 
		 * @returns {object|Array}
		 */
		getOOOData: function() {
			var _self = this;
			var raData = [];
			var loParam = {
					url: getUrl("outOfOfficeGetData"),
					async: false
			};
			//	Display busy indicator, while fetching data
			var loLocalBusyIndicator = {
					show: true,
					delay: 10,
					instance: [this.getBodyContainer()]
			};
			//	Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParam,
				localBusyIndicator: loLocalBusyIndicator,
				success: function(ioData, isTextStatus, ioJqXHR) {
					raData = ioData;
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();

			return raData;
		},

		/**
		 * ajax error response, while fetching data from system.
		 * 
		 * @param {object} ioJqXHR is response
		 * @param {String} isTextStatus is error message status
		 * @param {String} isErrorThrown thrown the message if it is error
		 */
		onErrorGetData: function(ioJqXHR, isTextStatus, isErrorThrown) {
			sap.m.MessageToast.show(goBundle.getText("UNABLE_DATA_FETCH_SF_DATA"));
		},

		/**
		 * Get Title 
		 * 
		 * @param [string] isDocumentType
		 * 
		 * @returns {String}
		 */
		getDocumentTitle: function(isDocumentType) {
			var rsDocumentTitle = "";
			switch (isDocumentType) {
			case "CREDIT_RELEASE":
				rsDocumentTitle = goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT");
				break;
			case "DISC_ORDER":
				rsDocumentTitle = goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT");
				break;
			case "DAMAGED_ORDER":
				rsDocumentTitle = goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED");
				break;
			case "MATERIAL_RETURN":
				rsDocumentTitle = goBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL");
				break;
			default:
				rsDocumentTitle = isDocumentType;
			}

			return rsDocumentTitle;
		},

		/**
		 * Creating footer and Add it in the Page
		 */
		createFooter: function() {
			var _self = this;
			var loFooterBar = new sap.m.Bar({
				visible: false,
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

		onPressSettings: function() {

		},

		/**
		 * On Page Refresh
		 */
		onPressRefresh: function() {
			this.createAllPanels();
			this.getFooterBar().setVisible(false);
		},

		/**
		 * On Press of the Submit
		 * 
		 * @param [object] ioEvent
		 */
		onPressSubmit: function(ioEvent) {
			_self = this;
			this.busyDialog = new sap.m.BusyDialog();

			if (this.validateInputs()) {
				var laOutOfOfficeSubstitutes = this.readOutOfOfficeSubstitutes();
				var laBatchRequest = [];
				var loHeaders = {
						"X-SMP-APPCID": goConfig.smpAppCID
				};
				var loParam = {
						json: true,
						user: goConfig.userId,
						password: goConfig.password,
						headers: loHeaders
				};
				var loModel = new sap.ui.model.odata.ODataModel(getUrl("batchProcess"), loParam);

				for (var i in laOutOfOfficeSubstitutes) {
					var loData = laOutOfOfficeSubstitutes[i];
					laBatchRequest.push(loModel.createBatchOperation(
							"/OutOfOfficeSet('0000000')", "PUT", loData));
				}

				loModel.setUseBatch(true);
				loModel.addBatchChangeOperations(laBatchRequest);

				this.busyDialog.open();
				loModel.submitBatch(function(iaResult) {
					_self.busyDialog.close();
					var lsString = "";
					try {
						lsString = iaResult.__batchResponses[0].response.body;
					} finally {
						if (lsString) {
							sap.m.MessageToast.show(goBundle.getText("OUT_OF_OFFICE_EXCEPTION"));
						} else {
							sap.m.MessageToast.show(goBundle.getText("OUT_OF_OFFICE_SUCCESS"));						
						}
					}
				}, function(ioError) {
					_self.busyDialog.close();
					sap.m.MessageToast.show(goBundle.getText("OUT_OF_OFFICE_FAILURE"));
				});

				if (this.getSwitchButton().getState()) {
					loOutOfOfficeChanges = {
							status: true,
							data: laOutOfOfficeSubstitutes
					};
				} else {
					loOutOfOfficeChanges = {
							status: false
					};
				}
				//Here use loOutOfOfficeChanges to pass te data to the backend
				//Once the service call is Success, then refresh the body with this.onPressRefresh()

				console.log(laOutOfOfficeSubstitutes);

				//Make the save Service call and then refresh the data
				this.onPressRefresh();
			}
		},

		/**
		 * Validation of Inputs
		 * 
		 * @returns {Boolean|rbValidateFlag}
		 */
		validateInputs : function() {
			var rbValidateFlag = true;
			var loBlock = this.getPanelContainer().getItems()[0].getItems();
			for (var i = 0; i < loBlock.length; i++) {
				if (loBlock[i].getHeaderToolbar().getContent()[1].getSelected()) {
					if (loBlock[i].getContent()[0].getContent()[1].getValue()==="") {
						loBlock[i].getContent()[0].getContent()[1].setValueState("Error");
						rbValidateFlag = false;
					} else {
						loBlock[i].getContent()[0].getContent()[1].setValueState("None");
					}
					if (loBlock[i].getContent()[0].getContent()[3].getValue()==="") {
						loBlock[i].getContent()[0].getContent()[3].setValueState("Error");
						rbValidateFlag = false;
					} else {
						loBlock[i].getContent()[0].getContent()[3].setValueState("None");
					}
//					if (loBlock[i].getContent()[0].getItems()[2].getValue() === "") {
//					loBlock[i].getContent()[0].getItems()[2].setValueState("Error");
//					rbValidateFlag = false;
//					} else {
//					loBlock[i].getContent()[0].getItems()[2].setValueState("None");
//					}
					var loSelectSub1 = loBlock[i].getContent()[0].getContent()[7];
					var loSelectSub2 = loBlock[i].getContent()[0].getContent()[10];
					if (loSelectSub1.getEnabled() && loSelectSub2.getEnabled()){
						if (loSelectSub1.getSelectedItem().getText() === loSelectSub2.getSelectedItem().getText()) {
							sap.m.MessageToast.show(goBundle.getText("VALIDATION"));
							loSelectSub2.setSelectedKey("");
							rbValidateFlag = false;
						}
					}


				}
			}

			return rbValidateFlag;
		},

		/**
		 * Get the type of the Document
		 *  
		 * @param [String] isDocumentType
		 * 
		 * @returns {String}
		 */
		getDocumentType: function(isDocumentType) {
			switch (isDocumentType) {
			case "Credit Blocked Orders":
				return "CREDIT_RELEASE";
			case "Damaged Orders":
				return "DAMAGED_ORDER";
			case "Discount Orders":
				return "DISC_ORDER";
			case "Material Return":
				return "MATERIAL_RETURN";
			}
		},

		/**
		 * Creating the Payload for Out of Office
		 * 
		 * @returns {Array} raOutOfOfficeData : Payload Array
		 */
		readOutOfOfficeSubstitutes: function() {
			var _self = this;
			var raOutOfOfficeData = [];
			if (this.getSwitchButton().getState() === true) {
				for (var i = 0; i < this.getPanelContainer().getItems()[0].getItems().length; i++) {
					if (this.getPanelContainer().getItems()[0].getItems()[i].getContent().length !== 0) {
						for (var j = 7; j < this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent().length; j++) {
							var loItems = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent();
							var loDocType = _self.getDocumentType(this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[0].getText());
							var loCheckBox = this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[1];
							var loLabel = loItems[j].getSelectedItem().getText();
							if (loCheckBox.getSelected() === true) {
								var laVContent = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent();
								var loSdate = "/Date(" + laVContent[1].getDateValue().getTime() + ")/";
								var loEdate = "/Date(" + laVContent[3].getDateValue().getTime() + ")/";
								var loReason = laVContent[5].getValue();
								var loSelect = laVContent[j];
								var loTitle = "";
								if (loSelect.getEnabled() && loLabel != "Select Substitute  "){

									var loID = loLabel.split(" ")[0].replace(/\s+/g, '');
									var loFname = loLabel.split(" ")[1];
									var loLname = loLabel.split(" ")[2];
									for (var k in loSelect.getModel().oData.results) {
										if (loSelect.getModel().oData.results[k].userId === loID){
											loTitle = loSelect.getModel().oData.results[k].title;
											break;
										}
									}
									var loUserfName = "";
									var loUserlName = "";

									for (var l in loSelect.getModel().oData.results) {
										if (loSelect.getModel().oData.results[l].userId === goConfig.userId){  //.substring(1).replace(/^[0]+/g, "") TODO:
											loUserfName = loSelect.getModel().oData.results[l].firstName;
											loUserlName = loSelect.getModel().oData.results[l].lastName;
											break;
										}
									}
									if (j === 7) {
										var loSequenceNo = "1"
									} else {
										var loSequenceNo = "2"
									}

									var loSubstituteNode = {
											"UserID": goConfig.userId,
											"documentType": loDocType,
											"startDate": loSdate, //"/Date(1446748200000)/",
											"sequenceNo": loSequenceNo,
											"endDate": loEdate, //"/Date(1447957800000)/",
											"substituteId": loID,
											"reason": loReason,
											"userLname": loUserlName,
											"userFname": loUserfName,
											"userTitle": goConfig.userDesignation,
											"subLname": loFname,
											"subFname": loLname,
											"subtTitle": loTitle,
											"isDelete": ""
									};
									raOutOfOfficeData.push(loSubstituteNode);

								} else if (!loSelect.getEnabled()) {
									var loID = loItems[j+1].getValue();
									var loFname = " ";
									var loLname = " ";
									var loUserfName = "";
									var loUserlName = "";

									for (var l in loSelect.getModel().oData.results) {
										if (loSelect.getModel().oData.results[l].userId === goConfig.userId){  //.substring(1).replace(/^[0]+/g, "") TODO:
											loUserfName = loSelect.getModel().oData.results[l].firstName;
											loUserlName = loSelect.getModel().oData.results[l].lastName;
											break;
										}
									}
									if (j === 7) {
										var loSequenceNo = "1"
									} else {
										var loSequenceNo = "2"
									}

									var loSubstituteNode = {
											"UserID": goConfig.userId,
											"documentType": loDocType,
											"startDate": loSdate, //"/Date(1446748200000)/",
											"sequenceNo": loSequenceNo,
											"endDate": loEdate, //"/Date(1447957800000)/",
											"substituteId": loID,
											"reason": loReason,
											"userLname": loUserlName,
											"userFname": loUserfName,
											"userTitle": goConfig.userDesignation,
											"subLname": loFname,
											"subFname": loLname,
											"subtTitle": loTitle,
											"isDelete": ""
									};
									raOutOfOfficeData.push(loSubstituteNode);
								}
							}
							j = j + 2;
						}
					}
				}
			} else {
				var loPanelItems = this.getPanelContainer().getItems()[0];
				for (var i = 0; i < this.getPanelContainer().getItems()[0].getItems().length; i++) {
					//					var laSubstitutes = [];
					//					var loPanel = 
					if (this.getPanelContainer().getItems()[0].getItems()[i].getContent().length != 0) {
						for (var j = 7; j < this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent().length; j++) {
							var loItems = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent();
							var loDocType = _self.getDocumentType(this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[0].getText());
							var loCheckBox = this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[1];
							var loLabel = loItems[j].getSelectedItem().getText();
							if (loCheckBox.getSelected() === true) {
								var laVContent = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getContent();
								var loSdate = "/Date(" + laVContent[1].getDateValue().getTime() + ")/";
								var loEdate = "/Date(" + laVContent[3].getDateValue().getTime() + ")/";
								var loReason = laVContent[5].getValue();
								var loSelect = laVContent[j];
								var loTitle = "";
								if (loSelect.getEnabled() && loLabel != "Select Substitute  "){

									var loID = loLabel.split(" ")[0].replace(/\s+/g, '');
									var loFname = loLabel.split(" ")[1];
									var loLname = loLabel.split(" ")[2];
									for (var k in loSelect.getModel().oData.results) {
										if (loSelect.getModel().oData.results[k].userId === loID){
											loTitle = loSelect.getModel().oData.results[k].title;
											break;
										}
									}
									var loUserfName = "";
									var loUserlName = "";

									for (var l in loSelect.getModel().oData.results) {
										if (loSelect.getModel().oData.results[l].userId === goConfig.userId){  //.substring(1).replace(/^[0]+/g, "") TODO:
											loUserfName = loSelect.getModel().oData.results[l].firstName;
											loUserlName = loSelect.getModel().oData.results[l].lastName;
											break;
										}
									}
									if (j === 7) {
										var loSequenceNo = "1"
									} else {
										var loSequenceNo = "2"
									}

									var loSubstituteNode = {
											"UserID": goConfig.userId,
											"documentType": loDocType,
											"startDate": loSdate, //"/Date(1446748200000)/",
											"sequenceNo": loSequenceNo,
											"endDate": loEdate, //"/Date(1447957800000)/",
											"substituteId": loID,
											"reason": loReason,
											"userLname": loUserlName,
											"userFname": loUserfName,
											"userTitle": goConfig.userDesignation,
											"subLname": loFname,
											"subFname": loLname,
											"subtTitle": loTitle,
											"isDelete": "true"
									};
									raOutOfOfficeData.push(loSubstituteNode);

								} else if (!loSelect.getEnabled()) {
									var loID = loItems[j+1].getValue();
									var loFname = " ";
									var loLname = " ";
									var loUserfName = "";
									var loUserlName = "";

//									for (var l in loSelect.getModel().oData.results) {
//										if (loSelect.getModel().oData.results[l].userId === goConfig.userId){  //.substring(1).replace(/^[0]+/g, "") TODO:
//											loUserfName = loSelect.getModel().oData.results[l].firstName;
//											loUserlName = loSelect.getModel().oData.results[l].lastName;
//											break;
//										}
//									}
									if (j === 7) {
										var loSequenceNo = "1"
									} else {
										var loSequenceNo = "2"
									}

									var loSubstituteNode = {
											"UserID": goConfig.userId,
											"documentType": loDocType,
											"startDate": loSdate, //"/Date(1446748200000)/",
											"sequenceNo": loSequenceNo,
											"endDate": loEdate, //"/Date(1447957800000)/",
											"substituteId": loID,
											"reason": loReason,
											"userLname": loUserlName,
											"userFname": loUserfName,
											"userTitle": goConfig.userDesignation,
											"subLname": loFname,
											"subFname": loLname,
											"subtTitle": loTitle,
											"isDelete": "true"
									};
									raOutOfOfficeData.push(loSubstituteNode);
								}
							}
							j = j + 2;
						}
					}
				}
			}

			return raOutOfOfficeData;
		}
};