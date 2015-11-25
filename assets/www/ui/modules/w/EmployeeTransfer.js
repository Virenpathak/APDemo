//Declare
jQuery.sap.declare("modules.w.EmployeeTransfer");
//Require
jQuery.sap.require("modules.SettingsIconAction");

//CONSTRUCTOR
modules.w.EmployeeTransfer = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 * object instance methods
 */
modules.w.EmployeeTransfer.prototype = {
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
			this.options.salesOfficePanel = null;
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
		 * Title for Employee Transfer from internationalization
		 */
		setPageTitle: function() {
			this.getTitle().setText(goBundle.getText("EMPLOYEE_TRANSFER"));
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
		 * Returns sales office panel for this instance
		 * 
		 * @returns sales office panel
		 */
		getSalesOfficePanel: function() {
			return this.options.salesOfficePanel;
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
			var loVBox = new sap.m.VBox();
			this.options.bodyContainer = loVBox;

			this.getEmployeeTransferData();
		},

		/**
		 * On click of submit button, get all data from transfer input field and pass the data to back end system 
		 * 
		 * @param {object} ioRMTransferSales is data object
		 */
		createSalesOffice: function(ioRMTransferSales) {
			var _self = this;

			var loRMForm = new sap.ui.layout.form.SimpleForm({
				layout: "GridLayout",
				width: "100%"
			}).addStyleClass("employeeTransferRMform");

			var loAMForm = new sap.ui.layout.form.SimpleForm({
				layout: "GridLayout",
				width: "100%"
			}).addStyleClass("employeeTransferAMform");

			var loSalesOffice = ioRMTransferSales.d;
			var loRMTitle = new sap.m.Text({
				text : "Region Manager"
			}).addStyleClass("employeeTransferRMtitle");
			loRMForm.addContent(loRMTitle);
			for (var i = 0; i < loSalesOffice.results.length; i++) {

				if (loSalesOffice.results[i].isRM == "X") {
					var loRMlabel = new sap.m.Label({
						text: loSalesOffice.results[i].soText
					}).addStyleClass("employeeTransferRMlabel");
					var loRMinput = new sap.m.Input({
						value: loSalesOffice.results[i].empId,
						placeholder : "Enter P-ID",
						change: function(ioEvent) {
							_self.onChangeRegionalManagerInput(ioEvent);
						}
					}).addStyleClass("employeeTransferRMinput");
					loRMForm.addContent(loRMlabel);
					loRMForm.addContent(loRMinput);
				} 
			}
			var loAMTitle = new sap.m.Text({
				text : "Area Manager"
			}).addStyleClass("employeeTransferAMtitle");
			loAMForm.addContent(loAMTitle);
			for (var i = 0; i < loSalesOffice.results.length; i++) {
				if (loSalesOffice.results[i].isRM != "X") {
					var loAMTitle = new sap.ui.core.Title({
						text : ""
					});
					var loLabel = new sap.m.Label({
						text: loSalesOffice.results[i].soText
					}).addStyleClass("salesOfficeLabel");
					var loInput = new sap.m.Input({
						value: loSalesOffice.results[i].empId,
						placeholder : "Enter P-ID",
						change: function(ioEvent) {
							_self.onChangeSalesOfficeUserInput(ioEvent);
						}
					}).addStyleClass("salesOfficeInput");
					loAMForm.addContent(loLabel);
					loAMForm.addContent(loInput);
				}
			}
			this.options.salesOfficePanel = loRMForm;
			this.options.salesOfficePanel = loAMForm;
			this.options.page.addContent(loRMForm);
			this.options.page.addContent(loAMForm);
		},

		/**
		 * Calling success factor for getting all employee details and validating input fields for Regional manager. If it is
		 * regional manager and valid user it will get success, if it is false will get error response with validation
		 */
		onChangeRegionalManagerInput: function(ioEvent) {
			var loInput = ioEvent.getSource();
			var loEmpId = ioEvent.getSource().getValue().substring(1).replace(/^[0]+/g, "");
			var loParam = {
					url: getUrl("SFUserData") + loEmpId + "')?$format=JSON",
					type: "GET",
					aync: true,
					username : goConfig.sfUserName,
					password: goConfig.sfPassword
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				success: function(ioData) {
					loInput.setValue(_self.checkUserIdFormat(loEmpId));
					loInput.setValueState("None");
				},
				error: function(ioError) {
					loInput.setValue("");
					if (!loInput.getValue()) {
						loInput.setValueState("Error");
					}
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Calling success factor for getting all employee details and validating input fields for Regional manager. If it is
		 * valid user it will get success, if it is false will get error response with validation
		 */
		onChangeSalesOfficeUserInput: function(ioEvent) {
			var loInput = ioEvent.getSource();
			var loInputEmpId = ioEvent.getParameter("element");
			var loEmpId = ioEvent.getSource().getValue().substring(1).replace(/^[0]+/g, "");	
			var loParam = {
					url: getUrl("SFUserData") + loEmpId + "')?$format=JSON",
					type: "GET",
					aync: true,
					username : goConfig.sfUserName,
					password: goConfig.sfPassword
			};	
			var loAjaxCall = new framework.ajax({
				param: loParam,
				success: function(ioData) {
					loInput.setValue(_self.checkUserIdFormat(loEmpId));
					if (loInput.getValue()) {
						loInput.setValueState("None");
					}
				},
				error: function(ioError) {
					loInput.setValue("");
					if (!loInput.getValue()) {
						loInput.setValueState("Error");
					}
				}
			});
			loAjaxCall.call();
		},

		/**
		 * Check the user Id formating to P<8 digit number>
		 * 
		 * @param {String} ioNum importing number with or without P
		 * 
		 * @returns {String} is number in format P<8 digit number>
		 */
		checkUserIdFormat: function (ioNum) {
			var loTemp = "";
			var loSize = 8;
			if (ioNum.length <= 9 ) {
				if(ioNum.charAt(0).toUpperCase() == "P") {
					if (parseInt(ioNum.slice(1)).toString() == "NaN" ) {

						return "";
					}
					loTemp = parseInt(ioNum.slice(1))+"";
				} else {
					if (parseInt(ioNum).toString() == "NaN" ) {

						return "";
					}
					loTemp = parseInt(ioNum)+"";
				}
				while (loTemp.length < loSize ) loTemp = "0" + loTemp;

				return "P" + loTemp;
			} else {

				return "";
			}
		},

		/**
		 * Perform form validation
		 * 
		 * @returns {Boolean} rbValidateFlag is result of validation
		 */
		getFormValidation: function() {
			var rbValidateFlag = true;

			var loRMformInput = this.options.page.getContent()[0].getContent()[2];
			if(loRMformInput.getValue() === "") {
				rbValidateFlag = false;
				loRMformInput.setValueState("Error");
			} else {
				loRMformInput.setValueState("None");
			}

			var loAMformInput = this.options.page.getContent()[1].getContent();
			for(var i=2; i<loAMformInput.length; i++) {
				if(loAMformInput[i].getValue() === "") {
					rbValidateFlag = false;
					loAMformInput[i].setValueState("Error");
				} else {
					loAMformInput[i].setValueState("None");
				}
				i++;
			}
			return rbValidateFlag;
		},

		/**
		 * ajax call
		 * 
		 * Get employee transfer data.
		 * 
		 */
		getEmployeeTransferData: function() {
			var _self = this;
			var loParam = {
					url: getUrl("employeeTransfer"),
					aync: true
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				success: function(ioData, isTextStatus, ioJqXHR) {
					if (ioData) {
						_self.createSalesOffice(ioData);
					} else {
						_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
					}
				},
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
				contentRight: [
				               new sap.m.Button({
				            	   text: goBundle.getText("SUBMIT"),
				            	   width: "150px",
				            	   type: "Accept",
				            	   press: function(ioEvent) {
				            		   _self.onPressSubmit(ioEvent);
				            	   }
				               })
				               ]
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
		 * On click of submit button, get the data from RM and AM field and update the data in back end system
		 * 
		 * @param {Event} ioEvent is the fired event
		 */
		onPressSubmit: function(ioEvent) {
			var _self = this;
			this.busyDialog = new sap.m.BusyDialog();

			if(_self.getFormValidation()) {
				var loPayload = this.generatePayload();
				var laBatchRequest = [];
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
				var loModel = new sap.ui.model.odata.ODataModel(
						getUrl("batchProcess"), loParam);

				for (var i in loPayload) {
					var loData = loPayload[i];
					laBatchRequest.push(loModel.createBatchOperation(
							"/EmployeeTransferSet('0000000')", "PUT", loData));
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
							sap.m.MessageToast.show(goBundle.getText("TRANSFER_EXCEPTION"));
						} else {
							sap.m.MessageToast.show(goBundle.getText("TRANSFER_SUCCESS"));						
						}
					}
				}, function(ioError) {
					_self.busyDialog.close();
					sap.m.MessageToast.show(goBundle.getText("TRANSFER_FAILURE"));
				});
			}
		},

		/**
		 * Generate the pay load data
		 * 
		 * @returns {Array} raTransferData is returning the data object
		 */
		generatePayload: function() {
			var raTransferData = [];
			var loGetUserData = this.options.page.getContent();
			if (loGetUserData) {
				var loTransferData = {};
				loTransferData.UserId = goConfig.userId;
				loTransferData.isRM = "X";
				if (loGetUserData[0] instanceof sap.m.Label) {
					loTransferData.soText = loGetUserData[0].getText();
				}
				if (loGetUserData[1] instanceof sap.m.Input) {
					loTransferData.empId = loGetUserData[1].getValue();
				}
				raTransferData.push(loTransferData);
			}

			var loGetPanel = this.getSalesOfficePanel().getContent();
			for (var i = 1; i < loGetPanel.length; i = i + 2) {
				var loTransferData = {};
				loTransferData.UserId = goConfig.userId;
				loTransferData.isRM = "";
				if (loGetPanel[i] instanceof sap.m.Label) {
					loTransferData.soText = loGetPanel[i].getText();
				}
				if (loGetPanel[i + 1] instanceof sap.m.Input) {
					loTransferData.empId = loGetPanel[i + 1].getValue();
				}
				raTransferData.push(loTransferData);
			}

			return raTransferData;
		}
};