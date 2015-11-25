sap.ui.controller("views.OrderDetailsPage", {

	/**
	 * Initialization of controller
	 */
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
	},

	/**
	 * Handling the routing to the document order page
	 * 
	 * @param ioController Event controller object
	 */
	_handleRouteMatched: function(ioController) {
		if (ioController.getParameters().name === "OrderDetailsPage") {
			var laConfig = gaBlockFieldsDetails;
			var loData = sap.ui.getCore().byId("appView").getModel().getData().selectedRow;
			var laAllOrderData = sap.ui.getCore().byId("appView").getModel().getData().allOrderData;
			var loPage = this.getView().byId("idOrderDetail");
			loPage.destroyContent();
			if (goConfig.appType === "w") {
				jQuery.sap.require("modules.w.DocumentDetail");
				new modules.w.DocumentDetail({
					page: loPage,
					appType: goConfig.appType,
					documentType: this.getDocumentType(ioController),
					documentIndex:ioController.getParameters().arguments.docOrder,
					maxItemSelection: goConfig.maxItemSelected,
					data: loData,
					orderDetails: loData,
					allOrderData: laAllOrderData,
					documentData: this.generateBlockData(laConfig, loData, this.getDocumentType(ioController)) //this.getBlockArray()
				});
			} else if (goConfig.appType === "m") {
				jQuery.sap.require("modules.m.DocumentDetail");
				new modules.m.DocumentDetail({
					page: loPage,
					appType: goConfig.appType,
					documentType: this.getDocumentType(ioController),
					documentIndex:ioController.getParameters().arguments.docOrder,
					maxItemSelection: goConfig.maxItemSelected,
					data: loData,
					orderDetails: loData,
					documentData: this.generateBlockData(laConfig, loData, this.getDocumentType(ioController)) //this.getBlockArray()
				});
			}
		}
	},

	/**
	 * Generate the block data
	 * 
	 * @param iaConfig configuration array with all field configuration data
	 * @param ioData data to be displayed in details page
	 * @param ioDocumentType document order type
	 * 
	 * @return raBlcoks {Array} is array of blocks with data mapping for details page
	 */
	generateBlockData: function(iaConfig, ioData, ioDocumentType) {
		var laFields = [];
		for (var keys in ioData) {
			var loField = {};
			loField.fieldId = keys;
			loField.value = ioData[keys];
			laFields.push(loField);
		}

		var raBlocks = this.generateFieldBlock(laFields, iaConfig, ioDocumentType);
		raBlocks.sort(this.sortFunction);

		return raBlocks;
	},

	/**
	 * Sorting function
	 * 
	 * @param ioName1 First item of comparison
	 * @param ioName2 Second item of comparison
	 * 
	 * @returns {Number} Return -1 id name1 < name and 1 otherwise
	 */
	sortFunction: function(loName1, loName2) {
		if (loName1.blockId < loName2.blockId) {
			return -1;
		} else {
			return 1;
		}
	},

	/**
	 * Generating block fields data
	 * 
	 * @param iaConfig configuration array with all field configuration data
	 * @param ioData data to be displayed in details page
	 * @param ioDocumentType document order type
	 * 
	 * @return raBlcoks {Array} is array of blocks with data mapping for details page
	 */
	generateFieldBlock: function(iaFields, iaConfig, ioDocumentType) {
		var raBlocks = [];
		if (ioDocumentType) {
			for (var i = 0; i < iaFields.length; i++) {
				if (iaConfig.length > 0) {
					for (var j = 0; j < iaConfig.length; j++) {
						if (iaConfig[j].documentType.toUpperCase() === ioDocumentType.toUpperCase()) {
							var loBlock = {};
							var loField = {};
							for (var k = 0; k < iaConfig[j].blockFields.length; k++) {
								if (iaFields[i].fieldId === iaConfig[j].blockFields[k].fieldId) {
									if (iaConfig[j].blockFields[k][goConfig.appType].visibleInDetail === true) {
										iaConfig[j].blockFields[k].value = iaFields[i].value;
										loField = iaConfig[j].blockFields[k];
										if (this.getBlockIndex(raBlocks, iaConfig[j]) === -1) {
											loBlock.blockFields = [];
											loBlock.blockFields.push(loField);
											loBlock.blockName = iaConfig[j].blockName;
											loBlock.blockId = iaConfig[j].blockId;
											loBlock.documentType = iaConfig[j].documentType;
											raBlocks.push(loBlock);
										} else {
											raBlocks[this.getBlockIndex(raBlocks, iaConfig[j])].blockFields.push(loField);
											raBlocks[this.getBlockIndex(raBlocks, iaConfig[j])].blockFields.sort(this.sortFunctionForCategory);
										}
									}
									break;
								}
							}
						}
					}
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
	 * Get the block index where to be updated
	 * 
	 * @param iaBlocks config blocks already mapped
	 * @param ioConfig configuration array with all field configuration data
	 * 
	 * @return loBlockPos {Integer} is the block positon for the field id
	 */
	getBlockIndex: function(iaBlock, ioConfig) {
		var loBlockPos = -1;
		for (var j = 0; j < iaBlock.length; j++) {
			if (iaBlock[j].blockId === ioConfig.blockId && iaBlock[j].documentType === ioConfig.documentType) {
				loBlockPos = j;
				break;
			}
		}
		return loBlockPos;
	},

	/**
	 * Get the document type
	 * 
	 * @param Controller object
	 * 
	 * @return Order type description
	 */
	getDocumentType: function(ioController) {
		switch (ioController.getParameters().arguments.docOrder) {
		case "0":
			return goOrderType.CreditBlockedOrders;
		case "1":
			return goOrderType.DiscountOrders;
		case "2":
			return goOrderType.DamagedOrders;
		case "3":
			return goOrderType.MaterialReturn;
		}
	}
});