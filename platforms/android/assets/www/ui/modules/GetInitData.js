jQuery.sap.declare("modules.GetInitData");

//CONSTRUCTOR
modules.GetInitData = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

//object instance methods
modules.GetInitData.prototype = {
		defaultSettings: {},

		/**
		 * Initialize the form layout
		 */
		init: function() {
			this._oData = null;
		},

		/**
		 * Set the data for this instance
		 * 
		 * @param ioData data object to be set to instance
		 */
		setData: function(ioData) {
			this._oData = ioData;
		},

		/**
		 * Return the set data object
		 * 
		 * @returns {object}
		 */
		getData: function() {
			return this._oData;
		},

		/**
		 * Get the UI configuration data array
		 * 
		 * @param ioServiceUrl Service URL for configuration
		 * 
		 * @returns {object} Array of JSON objects containing configuration for UI elements
		 */
		getConfigData: function(ioServiceUrl) {
			var loJsonModel = this.getDataFromService(ioServiceUrl);

			if (loJsonModel && loJsonModel.d) {
				return loJsonModel.d.results;
			}
		},

		/**
		 * Get the data from service URL using an ajax call
		 * 
		 * @param ioServiceUrl Service URL for configuration
		 * 
		 * @returns Service URL for configuration
		 */
		getDataFromService: function(ioServiceUrl) {
			var _self = this;
			var loParam = {
					url: ioServiceUrl,
					username: goConfig.userId,
					password: goConfig.password
			};
			var loAjaxCall = new framework.ajax({
				param: loParam,
				success: function(ioData, isTextStatus, ioJqXHR) {
					_self.setData(ioData);
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					_self.onErrorGetData(ioJqXHR, isTextStatus, isErrorThrown);
				}
			});
			loAjaxCall.call();

			return _self.getData();
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
		onErrorGetData: function(ioJqXHR, isTextStatus, isErrorThrown) {
			sap.m.MessageToast.show(goBundle.getText("UNABLE_TO_FETCH_DATA"));
		},


		/**
		 * Get the basic app configuration
		 * 
		 * @param ioServiceUrl Service URL for app configuration
		 * 
		 * @returns {Object} is an object with basic app configuration
		 */
		getAppConfiguration: function(ioServiceUrl, ioConfig) {
			var rsAppConfigValue = {};
			var laAppConfigData = this.getConfigData(ioServiceUrl);

			for (var i = 0; i < laAppConfigData.length; i++) {
				if (laAppConfigData[i].name === "ISMANAGER") {
					ioConfig.userDesignation = laAppConfigData[i].value;
				} else if (laAppConfigData[i].name === "MASSAPPR") {
					ioConfig.maxItemSelected = laAppConfigData[i].value;
				} else if (laAppConfigData[i].name === "SFUSER") {
					ioConfig.sfUserName = laAppConfigData[i].value;
				} else if (laAppConfigData[i].name === "SFPASSWORD") {
					ioConfig.sfPassword = laAppConfigData[i].value;
				}
			}

			return ioConfig;
		},

		/**
		 * Formatting the initial configuration data
		 * 
		 * @param ioServiceUrl Service URL of configuration
		 * 
		 * @returns {object} Array of fields configuration
		 */
		formatInitData: function(ioServiceUrl) {
			var laConfigData = this.getConfigData(ioServiceUrl);
			var raOrderFieldsConfig = this.generateBlockData(laConfigData);

			return raOrderFieldsConfig;
		},

		/**
		 * Generate the configuration block data
		 * 
		 * @param iaConfig configuration array from service call
		 * 
		 * @returns {object} Block divided configuration data
		 */
		generateBlockData: function(iaConfig) {
			var raBlocks = this.generateFieldBlock(iaConfig);
			raBlocks.sort(this.sortFunctionForBlockId);

			return raBlocks;
		},

		/**
		 * Sorting function For BlockId
		 * 
		 * @param ioName1 First item of comparison
		 * @param ioName2 Second item of comparison
		 * 
		 * @returns {Number} Return -1 id name1 < name and 1 otherwise
		 */
		sortFunctionForBlockId: function(ioName1, ioName2) {
			if (ioName1.blockId < ioName2.blockId) {
				return -1;
			} else {
				return 1;
			}
		},

		/**
		 * Generate field individual blocks of fields
		 * 
		 * @param iaConfig array of configuration details from service call
		 * 
		 * @returns {Array} is array of Block structured configuration
		 */
		generateFieldBlock: function(iaConfig) {
			var raBlocks = [];
			if (iaConfig.length > 0) {
				for (var i = 0; i < iaConfig.length; i++) {
					var loBlock = {};
					loBlock.blockFields = [];
					var loField = {};
					loField.w = {};
					loField.m = {};
					var lvBlockPos = -1;
					for (var j = 0; j < raBlocks.length; j++) {
						if (raBlocks[j].blockId === iaConfig[i].blockId && raBlocks[j].documentType === iaConfig[i].documentType) {
							lvBlockPos = j;
							break;
						}
					}
					if (lvBlockPos !== -1) {
						loField.fieldId = iaConfig[i].fieldId;
						loField.displayText = iaConfig[i].displayText;
						loField.fieldType = iaConfig[i].fieldDataType;
						loField.sort = iaConfig[i].sort;
						loField.filter = iaConfig[i].filter;
						loField.category = parseInt(iaConfig[i].category);

						//Configurations for Web
						// Visibility in web detail
						if (iaConfig[i].visibleInWebDetail.toUpperCase() === "TRUE") {
							loField.w.visibleInDetail = true;
						} else {
							loField.w.visibleInDetail = false;
						}

						// Visibility in web table
						if (iaConfig[i].visibleInWebTable.toUpperCase() === "TRUE") {
							loField.w.visibleInTable = true;
						} else {
							loField.w.visibleInTable = false;
						}

						// Sequence in web table
						if (iaConfig[i].sequenceInWebTable) {
							loField.w.sequenceInWebTab = iaConfig[i].sequenceInWebTable;
						}

						// Width in web
						if (iaConfig[i].widthInWebTable) {
							loField.w.widthInWebTable = iaConfig[i].widthInWebTable;
						}

						// Configuration for Mobile
						// Position in mobile list
						if (iaConfig[i].positionInMobileList) {
							loField.m.positionInMobileList = iaConfig[i].positionInMobileList;
						}

						// Visibility in mobile detail
						if (iaConfig[i].visibleInMobDetail.toUpperCase() === "TRUE") {
							loField.m.visibleInDetail = true;
						} else {
							loField.m.visibleInDetail = false;
						}

						// Highlighting required for field or not
						if (iaConfig[i].specialTypeInMobile.toUpperCase() === "TRUE") {
							loField.m.specialType = true;
						} else {
							loField.m.specialType = false;
						}
						raBlocks[lvBlockPos].blockFields.sort(this.sortFunctionForCategory);
						raBlocks[lvBlockPos].blockFields.push(loField);
					} else {
						loField.fieldId = iaConfig[i].fieldId;
						loField.displayText = iaConfig[i].displayText;
						loField.fieldType = iaConfig[i].fieldDataType;
						loField.sort = iaConfig[i].sort;
						loField.filter = iaConfig[i].filter;
						loField.category = parseInt(iaConfig[i].category);

						//Configurations for Web
						// Visibility in web detail
						if (iaConfig[i].visibleInWebDetail.toUpperCase() === "TRUE") {
							loField.w.visibleInDetail = true;
						} else {
							loField.w.visibleInDetail = false;
						}

						// Visibility in web table
						if (iaConfig[i].visibleInWebTable.toUpperCase() === "TRUE") {
							loField.w.visibleInTable = true;
						} else {
							loField.w.visibleInTable = false;
						}

						// Sequence in web
						if (iaConfig[i].sequenceInWebTable) {
							loField.w.sequenceInWebTab = iaConfig[i].sequenceInWebTable;
						}

						// Width in web
						if (iaConfig[i].widthInWebTable) {
							loField.w.widthInWebTable = iaConfig[i].widthInWebTable;
						} else {
							loField.w.widthInWebTable = "70Px";
						}

						// Configuration for Mobile
						// Position in mobile list
						if (iaConfig[i].positionInMobileList) {
							loField.m.positionInMobileList = iaConfig[i].positionInMobileList;
						}

						// Visibility in mobile detail
						if (iaConfig[i].visibleInMobDetail.toUpperCase() === "TRUE") {
							loField.m.visibleInDetail = true;
						} else {
							loField.m.visibleInDetail = false;
						}

						// Highlighting required for field or not
						if (iaConfig[i].specialTypeInMobile.toUpperCase() === "TRUE") {
							loField.m.specialType = true;
						} else {
							loField.m.specialType = false;
						}
						loBlock.blockId = iaConfig[i].blockId;
						loBlock.documentType = iaConfig[i].documentType;
						loBlock.blockName = this.getBlockName(iaConfig[i].blockId);
						loBlock.blockFields.push(loField);
						raBlocks.push(loBlock);
					}
				}
			}

			return raBlocks;
		},

		/**
		 * Sorting function for Block Fields based on category ID
		 * 
		 * @param ioName1 First item of comparison
		 * @param ioName2 Second item of comparison
		 * 
		 * @returns {Number} Return -1 id name1 < name and 1 otherwise
		 */
		sortFunctionForCategory: function(ioName1, ioName2) {
			if (ioName1.category < ioName2.category) {
				return -1;
			} else {
				return 1;
			}
		},

		/**
		 * Get the block name based on block ID
		 * 
		 * @param loBlockId Block ID
		 * 
		 * @returns {String} is the Block description
		 */
		getBlockName: function(loBlockId) {
			switch (loBlockId.toString()) {
			case "1":
				return goBundle.getText("CUSTOMER_DETAILS");
			case "2":
				return goBundle.getText("CUSTOMER_CREDIT_DETAILS");
			case "3":
				return goBundle.getText("ORDER_DETAILS");
			case "4":
				return goBundle.getText("ORDER_PENDING_FOR_APPROVAL");
			case "5":
				return goBundle.getText("REFERENCE_DETAILS");
			case "6":
				return goBundle.getText("ITEM_DETAILS");
			case "7":
				return goBundle.getText("SKU_LINE_ITEMS");
			case "8":
				return goBundle.getText("APPROVAL");
			case "9":
				return goBundle.getText("DUE_DATE_DETAILS");
			default:
				return goBundle.getText("BLOCK_NAME_NOT_SATISFIED");
			}
		},

		/**
		 * Update the order count for Document List
		 * 
		 * @param ioDocumentList Document List instance
		 * @param iaData JSON structure for document list counter 
		 */
		updateOrderCounts: function(ioDocumentList, iaData) {
			var laOrderCount = [];
			var loOrderCount = {};
			// Add count of Credit Blocked Order
			loOrderCount.id = goOrderType.CreditBlockedOrders;
			loOrderCount.counter = iaData[0].CRCount;
			laOrderCount.push(loOrderCount);
			loOrderCount = {};

			// Add count of Damaged Order
			loOrderCount.id = goOrderType.DiscountOrders;
			loOrderCount.counter = iaData[0].DamCount;
			laOrderCount.push(loOrderCount);
			loOrderCount = {};

			// Add count of Discount Order
			loOrderCount.id = goOrderType.DamagedOrders;
			loOrderCount.counter = iaData[0].DiscCount;
			laOrderCount.push(loOrderCount);
			loOrderCount = {};

			// Add count of Material Order
			loOrderCount.id = goOrderType.MaterialReturn;
			loOrderCount.counter = iaData[0].MRVCount;
			laOrderCount.push(loOrderCount);
			loOrderCount = {};

			ioDocumentList.updateCounter(laOrderCount);
		},

		/**
		 * Check is device is a mobile, tablet or Desktop
		 * 
		 * @returns {String} is type of application/Device type to be loaded, m - Mobile and Tablet and w - Web
		 */
		updateAppType : function() {
			if (sap.ui.Device.system.desktop) {
				return "w";
			} else if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
				return "m";
			}
		},

		/**
		 * Get the System IP Address
		 * 
		 * @returns {JSON Object} roData is returned json object with IP address details
		 */
		getIPAddress: function(lsServiceURL) {
			var _self = this;
			var roData = {};
			//calling service URL based on the document type
			var loParamIP = {
					url: lsServiceURL,
					async: false
			};
			//Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParamIP,
				success: function(ioData, isTextStatus, ioJqXHR) {
					roData =  ioData;
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					sap.m.MessageToast.show(goBundle.getText("UNABLE_TO_FETCH_DATA"));
				}
			});
			loAjaxCall.call();
			return roData;
		},

		/**
		 * Get the System IP Address 
		 */
		deleteSessionHTTPCookies: function(lsServiceURL) {
			var _self = this;
			//calling service URL based on the document type
			var loParamIP = {
					url: lsServiceURL,
					async: false
			};
			//Ajax service call
			var loAjaxCall = new framework.ajax({
				param: loParamIP,
				success: function(ioData, isTextStatus, ioJqXHR) {
					// Cookies Deleted successfully
				},
				error: function(ioJqXHR, isTextStatus, isErrorThrown) {
					sap.m.MessageToast.show(goBundle.getText("COOKIE_DELETE_FAILED"));
				}
			});
			loAjaxCall.call();
		},
};