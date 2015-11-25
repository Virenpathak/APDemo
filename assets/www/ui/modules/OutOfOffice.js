//Declare
jQuery.sap.declare("modules.OutOfOffice");
jQuery.sap.require("modules.SettingsIconAction");

//CONSTRUCTOR
modules.OutOfOffice = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

//object instance methods
modules.OutOfOffice.prototype = {
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
			this._oRefresh = null;
			this.options.switchButton = null;
			this.options.switchToolbar = null;
			this.options.panelContainer = null;
			this.options.footerBar = null;
			this.options.block = null;

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
		 * @returns {sap.m.Text}
		 */
		getTitle: function() {
			return this._oTitle;
		},

		/**
		 * Body Container 
		 * @returns
		 */
		getBodyContainer: function() {
			return this.options.bodyContainer;
		},

		/**
		 * 
		 */

		getSwitchToolbar: function() {
			return this.options.switchToolbar;
		},

		/**
		 * Menu Button 
		 * @returns {sap.m.Button}
		 */
		getMenuButton: function() {
			return this._oMenuButton;
		},

		/**
		 * Navigation Button for out of Office
		 * @returns {sap.m.Button} 
		 */
		getNavButton: function() {
			return this._oNavButton;
		},

		/**
		 * Setting Button for Out of Office
		 * @returns {sap.m.Button}
		 */
		getSettingsButton: function() {
			return this._oSettings;
		},

		/**
		 * Refresh Button for Out of Office 
		 * @returns {sap.m.Button}
		 */
		getRefreshButton: function() {
			return this._oRefresh;
		},

		/**
		 * Panel Container for Out of Office
		 * @returns {sap.m.VBox}
		 */
		getPanelContainer: function() {
			return this.options.panelContainer;
		},

		/**
		 * Switch for Setting out of Office ON or OFF
		 * @returns {sap.m.Switch}
		 */
		getSwitchButton: function() {
			return this.options.switchButton;
		},

		/**
		 * Footer Bar for Out Of Office 
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

			var loRefreshButton = new sap.m.Button({
				icon: "sap-icon://refresh",
				press: function(ioEvent) {
					_self.onPressRefresh(ioEvent);
				}
			});

			this._oRefresh = loRefreshButton;

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
				contentRight: [loRefreshButton, loSettingsButton]
			});

			this.options.page.setCustomHeader(loHeaderBar);

			this.setPageTitle();
		},

		/**
		 * Create the Body of Out of Office
		 */
		createBody: function() {
//			Defining the main VBox for the Body and add it in the Panel Container 
			var loVBox = new sap.m.VBox().addStyleClass("outOfOfficeBodyContainer");
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
			}).addStyleClass("outOfOfficeLabelToolbar");

			var loLabelOOO = new sap.m.Label({
				text: "Out of Office"
			}).addStyleClass("outOfOfficeLabelOOO");
			loToobarLabel.addContent(loLabelOOO);

//			Defining the switch
			var loSwitch = new sap.m.Switch({
				state: false,
				customTextOn: goBundle.getText("ON"),
				customTextOff: goBundle.getText("OFF"),
				change: function(ioEvent) {
					_self.onChangeSwitch();
					_self.getFooterBar().setVisible(true);
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
		 * @returns {sap.ui.model.json.JSONModel}
		 */
		getModelData: function() {
			var loPerm = {
					json : true,
					user : "P00110160@C0013041173T",
					password : "P00110160"
			};
			var loUmodel = new sap.ui.model.odata.ODataModel(
					"https://hcm8preview.sapsf.com/odata/v2/", loPerm);
			loUmodel.read("/User('110769')/manager", null, null, false, function(oData, oResponse) {
				var loName = oData.firstName + oData.lastName;
				var loDes = oData.title;
				var loEmpId = oData.userId;
				var loDmodel = new sap.ui.model.odata.ODataModel(
						"https://hcm8preview.sapsf.com/odata/v2/", true, "P00110160@C0013041173T", "P00110160");
				loDmodel.read("User('" + loEmpId + "')/directReports", null, null, false, function(ioData, ioResponse) {
					goSFData = ioData;
					//					goBusyDig.close();
				});
			});
			goSFModel = new sap.ui.model.json.JSONModel();
			goSFModel.setData(goSFData);

			return goSFModel;
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
						}).addStyleClass("outOfOfficePanelText"),
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
						}).addStyleClass("outOfOfficePanelText"),
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
						          }).addStyleClass("outOfOfficePanelText"),
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
						          }).addStyleClass("outOfOfficePanelText"),
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
			return new sap.m.VBox({
				items: [new sap.m.HBox({
					items: [new sap.m.HBox({
						alignItems: "Center",
						items: [new sap.m.Label({
							text: goBundle.getText("START_DATE")
						}).addStyleClass("OutOfOfficeDateBlock"),
						loStartDatePicker,
						]
					}),
					new sap.m.HBox({
						alignItems: "Center",
						items: [new sap.m.Label({
							text: goBundle.getText("END_DATE")
						}).addStyleClass("OutOfOfficeDateBlock"),
						loEndDatePicker
						]
					}).addStyleClass("OutOfOfficeRightBlock"),
					]
				}),
				new sap.m.Label({
					text: goBundle.getText("REASON")
				}).addStyleClass("OutOfOfficeDateBlock"),
				new sap.m.Input({
					width: "100%"
				}).addStyleClass("OutOfOfficeReasonBlock"),
				new sap.m.HBox({
					items: [
					        new sap.m.Label({
					        	text: goBundle.getText("SUB1")
					        }).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getDropDown(),
					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
					        ]
				}),
				new sap.m.HBox({
					items: [
					        new sap.m.Label({
					        	text: goBundle.getText("SUB2")
					        }).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getDropDown(),
					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
					        ]
				})
				]
			});
		},

		/**
		 * Select for Showing Substitute Data
		 * @returns {object|sap.m.Select}
		 */
		_getDropDown: function() {
			return new sap.m.Select({
				autoAdjustWidth : true,
				items: {
					path: '/results',
					template: new sap.ui.core.Item({
						key: '{userId}',
						text: '{userId}' + ':' + '{firstName}' + " " + '{lastName}',
					})
				},
				change: function(ioEvent) {
					this.getParent().getItems()[3].setEditable(false);
				}
			}).addStyleClass("OutOfOfficeDateBlock");
		},

		/**
		 * Input field for Pid
		 * @returns {object|sap.m.Input}
		 */
		_getInput: function() {
			var _self = this;
			return new sap.m.Input({
				placeholder: goBundle.getText("PID"),
				change: function(ioEvent) {
					_self.onInputChange(ioEvent);
				}
			}).addStyleClass("OutOfOfficeDateBlock");
		},

		/**
		 * On change of the Pid 
		 * @param [Object] ioEvent
		 */
		onInputChange: function(ioEvent) {
			var loInput = ioEvent.getSource();
			var loEmpId = loInput.getValue();
			var loSelect = ioEvent.getSource().getParent().getItems()[1];
			var loParam = {
					json : true,
					user : "P00110160@C0013041173T",
					password : "P00110160"
			};
			var loModel = new sap.ui.model.odata.ODataModel(
					"https://hcm8preview.sapsf.com/odata/v2/", loParam);

			if (loInput.getValue()){

				loModel.read("/User('"+ loEmpId + "')", null, null, false, function(ioData, ioResponse){
					loInput.setValueState("None");
					loSelect.setEnabled(false);
				},function(){
					loInput.setValueState("Error");
					loInput.setValue("");
				});

			}else {
				loSelect.setEnabled(true);
			}
		},

		/**
		 * Check Box for Panel 
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

					if (iCheck > 2) {
						sap.m.MessageToast.show('Cant select');
						this.setSelected(false);
						iCheck = iCheck - 1;
					}

				}
			});
		},

		/**
		 * On expand of the Panel
		 * @param [Object]ioEvent
		 */
		onExpand: function(ioEvent) {
			var _self = this;
			if (ioEvent.getSource().getExpanded() == true) {
				iCheck = 0;
				var loModel = goSFModel;
				ioEvent.getSource().removeAllContent();
				ioEvent.getSource().insertContent(_self._getVBox(), 0).setModel(loModel);
			} else {
				iCheck = 2;
			}
		},

		/**
		 * On Start Date Change 
		 * @param [object] ioEvent Object for Start date Input
		 */
		onSDateChange: function(ioEvent) {
			var oDate = ioEvent.oSource.mProperties.dateValue;
			var oSdate = oDate.getDate() + "-" + oDate.getMonth() + "-" + oDate.getFullYear();
			var oTdate = new Date();
			var oCDate = oTdate.getDate() + "-" + oTdate.getMonth() + "-" + oTdate.getFullYear();
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
			}
		},

		/**
		 * On End Date Change 
		 * @param [object] ioEvent Object for End Date Input 
		 */
		onEDateChange: function(ioEvent) {
			var loSdate = ioEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getDateValue();
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
							goBundle.getText("DATE_ERROR"), {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Warning",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: fnCallbackMessageBox
							});
				});
				ioEvent.getSource().setValue();
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
						}).addStyleClass("outOfOfficePanelText"),
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
						}).addStyleClass("outOfOfficePanelText"),
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
						}).addStyleClass("outOfOfficePanelText"),
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
						          }).addStyleClass("outOfOfficePanelText"),
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
		 * @param [Object] ioEvent
		 */
		onPanelExpand: function(ioEvent) {
			var _self = this;
			var loGetDocType = ioEvent.oSource.getHeaderToolbar().getContent()[0].getText();
			var loCheckBox = ioEvent.oSource.getHeaderToolbar().getContent()[1];
			var k = 4;
			if (ioEvent.getSource().getExpanded() === true) {
				var loData = _self.getOOOData();
				var loModel = goSFModel;
				ioEvent.getSource().removeAllContent();
				ioEvent.getSource().insertContent(_self._getPanelBox().setModel(loModel));

				for (var i = 0; i < loData.results.length; i++) {
					var loDocType = _self.getDocumentTitle(loData.results[i].documentType);
					if (loDocType === loGetDocType) {
						var loSdate = ioEvent.getSource().getContent()[0].getItems()[0].getItems()[0].getItems()[1];
						loSdate.setDateValue(loData.results[i].startDate);
						var loEdate = ioEvent.getSource().getContent()[0].getItems()[0].getItems()[1].getItems()[1];
						loEdate.setDateValue(loData.results[i].endDate);
						loCheckBox.setSelected(true);
						var loReason = ioEvent.getSource().getContent()[0].getItems()[2];
						loReason.setValue(raData.results[i].reason);

						if (k == 4) {
							k = 3;
						} else {
							k = 4;
						}
						if (ioEvent.getSource().getContent().length != 0) {
							var loSelect = ioEvent.getSource().getContent()[0].getItems()[k].getItems()[1];
							var loInput = ioEvent.getSource().getContent()[0].getItems()[k].getItems()[2];
							var loSubId = raData.results[i].substituteId;
							var laSubId = [];
							for (var j = 0; j < loSelect.getItems().length; j++) {
								laSubId.push(loSelect.getItems()[j].getKey());
							}
							if (laSubId.indexOf(loSubId)) {
								loSelect.setSelectedKey(loSubId);
							} else {
								loInput.setValue(loSubId);
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
			return new sap.m.VBox({
				items: [new sap.m.HBox({
					items: [new sap.m.HBox({
						alignItems: "Center",
						items: [new sap.m.Label({
							text: goBundle.getText("START_DATE"),
						}).addStyleClass("OutOfOfficeDateBlock"),
						loStartDatePicker
						]
					}),
					new sap.m.HBox({
						alignItems: "Center",
						items: [new sap.m.Label({
							text: goBundle.getText("END_DATE"),
						}).addStyleClass("OutOfOfficeDateBlock"),
						loEndDatePicker
						]
					}).addStyleClass("OutOfOfficeRightBlock")
					]
				}),
				new sap.m.Label({
					text: goBundle.getText("REASON"),
				}).addStyleClass("OutOfOfficeDateBlock"),
				new sap.m.Input({
					width: "100%"
				}).addStyleClass("OutOfOfficeReasonBlock"),
				new sap.m.HBox({
					items: [
					        new sap.m.Label({
					        	text: goBundle.getText("SUB1"),
					        }).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getPanelDropDown(),
					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
					        ]
				}),
				new sap.m.HBox({
					items: [
					        new sap.m.Label({
					        	text: goBundle.getText("SUB2"),
					        }).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getPanelDropDown(),
					        new sap.m.Label({text : goBundle.getText("OR")}).addStyleClass("OutOfOfficeSubBlock"),
					        _self._getInput()
					        ]
				})
				]
			});
		},

		/**
		 * Select for showing Substitute
		 * @returns {object|sap.m.Select}
		 */
		_getPanelDropDown: function() {
			return new sap.m.Select({
				maxWidth: "50%",
				items: {
					path: '/results', //'/KEY',
					template: new sap.ui.core.Item({
						key: '{userId}',
						text: '{userId}' + ' : ' + '{firstName}' + " " + '{lastName}',
					}),
				},
				change: function(ioEvent) {
					this.getParent().getItems()[3].setEditable(false);
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
			} else {
				this.getPanelContainer().setVisible(false);
				this.createPanels();
			}
		},

		/**
		 * Get Backend Data
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
					_self.onErrorGetTableData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();

			return raData;
		},

		/**
		 * Get Title 
		 * @param [string] isDocumentType
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


		onErrorGetData: function(ioJqXHR, isTextStatus, isErrorThrown) {
			sap.m.MessageToast.show(goBundle.getText("UNABLE_DATA_FETCH"));
		},

		/**
		 * On Press of the Submit 
		 * @param [object] ioEvent
		 */
		onPressSubmit: function(ioEvent) {
			if (this.validateInputs()) {
				var laOutOfOfficeSubstitutes = this.readOutOfOfficeSubstitutes();
				var laBatchRequest = [];
				var loHeaders = {
						"X-SMP-APPCID": goConfig.smpAppCID
				};
				var loModel = new sap.ui.model.odata.ODataModel(getUrl("batchProcess"), true, "virendrap", "password@1", loHeaders);

				for (var i in laOutOfOfficeSubstitutes) {
					var loData = laOutOfOfficeSubstitutes[i];
					laBatchRequest.push(loModel.createBatchOperation(
							"/OutOfOfficeSet('0000000')", "PUT", loData));
				}

				loModel.setUseBatch(true);
				loModel.addBatchChangeOperations(laBatchRequest);

				loModel.submitBatch(function(iaResult) {
					var lsMessage = "";
					var laResponse = iaResult.__batchResponses[0].__changeResponses;
					for (var i = 0; i < laResponse.length; i++) {
						if (laResponse[i].headers.failure_message) {
							lsMessage = goBundle.getText("UPDATE_FAIL");
						}
						if (laResponse[i].headers.success_message) {
							lsMessage = goBundle.getText("UPDATE");
						}
					}
					//				_self.laBusyDialogue.close();
					_self.onPressRefresh();
					sap.m.MessageToast.show(lsMessage);
				}, function(ioError) {
					//				_self.laBusyDialogue.close();
					console.log(ioError);
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
		 * @returns {Boolean|rbValidateFlag}
		 */
		validateInputs : function() {
			var rbValidateFlag = true;
			var loBlock = this.getPanelContainer().getItems()[0].getItems();
			for (var i = 0; i < loBlock.length; i++) {
				if (loBlock[i].getHeaderToolbar().getContent()[1].getSelected()) {
					if (loBlock[i].getContent()[0].getItems()[0].getItems()[0].getItems()[1].getValue()===' ') {
						loBlock[i].getContent()[0].getItems()[0].getItems()[0].getItems()[1].setValueState("Error");
						rbValidateFlag = false;
					} else {
						loBlock[i].getContent()[0].getItems()[0].getItems()[0].getItems()[1].setValueState("None");
					}
					if (loBlock[i].getContent()[0].getItems()[0].getItems()[1].getItems()[1].getValue()===' ') {
						loBlock[i].getContent()[0].getItems()[0].getItems()[1].getItems()[1].setValueState("Error");
						rbValidateFlag = false;
					} else {
						loBlock[i].getContent()[0].getItems()[0].getItems()[1].getItems()[1].setValueState("None");
					}
					if (loBlock[i].getContent()[0].getItems()[2].getValue() === ' ') {
						loBlock[i].getContent()[0].getItems()[2].setValueState("Error");
						rbValidateFlag = false;
					} else {
						loBlock[i].getContent()[0].getItems()[2].setValueState("None");
					}
					
				}
			}

			return rbValidateFlag;
		},

		/**
		 * Get the type of the Document 
		 * @param [String] isDocumentType
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
		 * Creating the Payload for Out of Office
		 * @returns {Array} raOutOfOfficeData : Payload Array
		 */
		readOutOfOfficeSubstitutes: function() {
			var _self = this;
			var raOutOfOfficeData = [];
			if (this.getSwitchButton().getState() === true) {
				for (var i = 0; i < this.getPanelContainer().getItems()[0].getItems().length; i++) {
					if (this.getPanelContainer().getItems()[0].getItems()[i].getContent().length !== 0) {
						for (var j = 3; j < this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems().length; j++) {
							var loItems = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems()[j];
							var loDocType = _self.getDocumentType(this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[0].getText());
							var loCheckBox = this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[1];
							if (loCheckBox.getSelected() === true) {
								var laVContent = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems();
								var loSdate = "/Date(" + laVContent[0].getItems()[0].getItems()[1].getDateValue().getTime() + ")/";
								var loEdate = "/Date(" + laVContent[0].getItems()[1].getItems()[1].getDateValue().getTime() + ")/";
								var loReason = laVContent[2].getValue();
								var loLabel = loItems.getItems()[1].getSelectedItem().getText()
								var loID = loLabel.split(":")[0];
								var loFname = loLabel.split(" ")[2];
								var loLname = loLabel.split(" ")[3];
								if (j === 3) {
									var loSequenceNo = "1"
								} else {
									var loSequenceNo = "2"
								}

								var loSubstituteNode = {
										"UserID": "VIRANDRAP",//goUserId
										"documentType": loDocType,
										"startDate": loSdate, //"/Date(1446748200000)/",
										"sequenceNo": loSequenceNo,
										"endDate": loEdate, //"/Date(1447957800000)/",
										"substituteId": loID,
										"reason": loReason,
										"userLname": "VIREN",
										"userFname": "PATHAK",
										"userTitle": "RM",
										"subLname": loFname,
										"subFname": loLname,
										"subtTitle": "RM",
										"isDelete": ""
								};
								raOutOfOfficeData.push(loSubstituteNode);
							}
						}
					}
				}
			} else {
				var loPanelItems = this.getPanelContainer().getItems()[0];
				for (var i = 0; i < this.getPanelContainer().getItems()[0].getItems().length; i++) {
					//					var laSubstitutes = [];
					//					var loPanel = 
					if (this.getPanelContainer().getItems()[0].getItems()[i].getContent().length != 0) {
						for (var j = 3; j < this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems().length; j++) {
							var loItems = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems()[j];
							var loDocType = _self.getDocumentType(this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[0].getText());
							var loCheckBox = this.getPanelContainer().getItems()[0].getItems()[i].getHeaderToolbar().getContent()[1];
							if (loCheckBox.getSelected() == true) {
								var laVContent = this.getPanelContainer().getItems()[0].getItems()[i].getContent()[0].getItems();
//								var loSdate = "/Date(" + laVContent[0].getItems()[0].getItems()[1].getDateValue().getTime() + ")/";
//								var loEdate = "/Date(" + laVContent[0].getItems()[1].getItems()[1].getDateValue().getTime() + ")/";
								var loReason = laVContent[2].getValue();
								var loLabel = loItems.getItems()[1].getSelectedItem().getText()
								var loID = loLabel.split(":")[0];
								var loFname = loLabel.split(" ")[2];
								var loLname = loLabel.split(" ")[3];
								if (j == 3) {
									var loSequenceNo = "1"
								} else {
									var loSequenceNo = "2"
								}

								var loSubstituteNode = {
										"UserID": "VIRANDRAP",//goUserId
										"documentType": loDocType,
//										"startDate": loSdate,
										"sequenceNo": loSequenceNo,
//										"endDate": loEdate,
										"substituteId": loID,
										"reason": loReason,
										"userLname": "VIREN",
										"userFname": "PATHAK",
										"userTitle": "RM",
										"subLname": loFname,
										"subFname": loLname,
										"subtTitle": "RM",
										"isDelete": "true"
								};
								raOutOfOfficeData.push(loSubstituteNode);
							}
						}
					}
				}
			}

			return raOutOfOfficeData;
		}
};