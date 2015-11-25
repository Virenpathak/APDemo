//Declare
jQuery.sap.declare("modules.w.DynamicTable");

//Constructor
modules.w.DynamicTable = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 *  Object Instance Methods
 */
modules.w.DynamicTable.prototype = {
		defaultSettings: {
			title: "Title",
			documentType: "",
			showTitle: false,
			showToolbar: false,
			selectionMode: "MultiToggle",
			height: "100%",
			width: "100%",
			columnWidth: "80px",
			excludeTableColumnNames: ["__metadata", "NavCreditBlockToDueDatePayment"],
			tableData: [],
			tableConfigData: [],
			columnHeaderColor: "80px",
			maxItemSelection: 2,
			rowSelectionChange: function() {},
			cellClick: function() {}
		},

		getTitle: function() {
			return this.options.title;
		},

		setTitle: function(isTitle) {
			this.options.title = isTitle;
		},

		getDocumentType: function() {
			return this.options.documentType;
		},

		setDocumentType: function(isDocumentType) {
			this.options.documentType = isDocumentType;
		},

		getShowTitle: function() {
			return this.options.showTitle;
		},

		setShowTitle: function(ibShowTitle) {
			this.options.showTitle = ibShowTitle;
		},

		getShowToolbar: function() {
			return this.options.showToolbar;
		},

		setShowToolbar: function(ibShowToolbar) {
			this.options.showToolbar = ibShowToolbar;
		},

		getSelectionMode: function() {
			return this.options.selectionMode;
		},

		setSelectionMode: function(isSelectionMode) {
			this.options.selectionMode = isSelectionMode;
		},

		getHeight: function() {
			return this.options.height;
		},

		setHeight: function(isHeight) {
			this.options.height = isHeight;
		},

		getWidth: function() {
			return this.options.width;
		},

		setWidth: function(isWidth) {
			this.options.width = isWidth;
		},

		getColumnWidth: function() {
			return this.options.columnWidth;
		},

		setColumnWidth: function(isColumnWidth) {
			this.options.columnWidth = isColumnWidth;
		},

		getExcludeTableColumnNames: function() {
			return this.options.excludeTableColumnNames;
		},

		setExcludeTableColumnNames: function(iaExcludeTableColumnNames) {
			this.options.excludeTableColumnNames = iaExcludeTableColumnNames;
		},

		getTableData: function() {
			return this.options.tableData;
		},

		setTableData: function(iaTableData) {
			this.options.tableData = iaTableData;
		},

		getTableConfigData: function() {
			return this.options.tableConfigData;
		},

		setTableConfigData: function(iaTableConfigData) {
			this.options.tableConfigData = iaTableConfigData;
		},

		getTableData: function() {
			return this.options.tableData;
		},

		setTableData: function(iaTableData) {
			this.options.tableData = iaTableData;
		},

		getColumnHeaderColor: function() {
			return this.options.columnHeaderColor;
		},

		setColumnHeaderColor: function(isColumnHeaderColor) {
			this.options.columnHeaderColor = isColumnHeaderColor;
		},

		getMaxItemSelection: function() {
			return this.options.maxItemSelection;
		},

		setMaxItemSelection: function(iiMaxItemSelection) {
			this.options.maxItemSelection = iiMaxItemSelection;
		},

		/**
		 * Initialize module
		 */
		init: function() {
			var loTableoModel = new sap.ui.model.json.JSONModel();
			this._TableModel = loTableoModel;
			this._oSelectedOrder = null;
			this._oTable = null;
			this.createTable();
		},

		/**
		 * Get the selected order
		 */
		getSelectedOrder: function() {
			return this._oSelectedOrder;
		},

		/**
		 * Set the selected order 
		 */
		setSelectedOrder: function(ioSelectedOrder) {
			this._oSelectedOrder = ioSelectedOrder;
		},

		/* Custom Getter & Setter */
		/**
		 * Returns table element for this instance
		 * 
		 * @returns {object|sap.ui.table.Table}
		 */
		getTable: function() {
			return this._oTable;
		},

		/**
		 * Returns table model element for this instance
		 * 
		 * @returns {object|sap.ui.model.json.JSONModel}
		 */
		getTableModel: function() {
			return this._TableModel;
		},

		/**
		 * Creates table object with required styling, custom events and aggregations
		 * 
		 * @return {object|sap.ui.table.Table}
		 * 			roTable the table object
		 */
		createTable: function() {
			var _self = this;
			// Create the table object and add the custom events
			var roTable = new sap.ui.table.Table({
				enableColumnFreeze : true,
				selectionBehavior: sap.ui.table.SelectionBehavior.RowSelector,
				visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
				enableSelectAll: false,
				selectionMode: this.getSelectionMode(),
				// Selection of table row
				rowSelectionChange: function(ioEvent) {
					if (_self.getDocumentType() !== goOrderType.OrderStatusSearch) {
						_self.options.rowSelectionChange(ioEvent);
					}
				},
				cellClick : function(ioEvent) {
					_self.options.cellClick(ioEvent);
				}
			});

			// If Toolbar  is to be displayed, create and set the Toolbar object
			if (this.getShowToolbar()) {
				roTable.setToolbar(new sap.m.Toolbar({
					width: "100%"
				}));
				roTable.getToolbar().addStyleClass("dynamicTableToolbar");

				if (this.getShowTitle()) {
					roTable.getToolbar().addContent(new sap.m.Label({
						text: this.getTitle()
					}).addStyleClass("dynamicTableTitleText"));
				}
			}

			// After rendering set the custom styling to column headers of the table
			roTable.addDelegate({
				onAfterRendering: function() {
					_self.changeTableHeaderColor();
				}
			});

			this._oTable = roTable;
			this.getTable().setModel(this.getTableModel());
			if (this.getTableData()) {
				this.updateTableRows(this.getTableData());
			}
			roTable.bindAggregation("rows", "/rows");

			return roTable;
		},

		/**
		 * Update the table columns and rows
		 * 
		 * @param : {object|JSON Array}
		 * 			iaTableData the array of data to be displayed in table
		 */
		updateTableRows: function(iaTableData) {
			this.setTableData([]);
			this.setTableData(iaTableData);
			this.updateTableColumns();
			this.getTable().getModel().setProperty("/rows", iaTableData);
		},

		/**
		 * Update the characteristics of table columns
		 * 
		 * @return : {object|JSON Array}
		 * 			roColumn the array of columns to be aggregated into table objects
		 */
		updateTableColumns: function() {
			var _self = this;
			var loTableoModel = this.getTableModel();
			loTableoModel.setProperty("/columns", this.getColumnIdArray());

			// Bind the table 
			this.getTable().bindAggregation("columns", "/columns", function(index, context) {
				var lsColumnId = context.getObject().columnId;
				var lsVisible = context.getObject().visible;
				// If checkbox needed, 
				if (context.getObject().columnId === "rmApprReqd") {
					// Add the checkbox as a column to table 
					var roColumn = new sap.ui.table.Column({
						resizable: true,
						template: _self.isMultipleLevelApproval(lsColumnId),
						width: "40px",
						visible: lsVisible,
						customData: [new sap.ui.core.CustomData({
							key: "sequence"
								//						value : lsSequence,
						}), new sap.ui.core.CustomData({
							key: "type"
								//						value : lsType,
						}), new sap.ui.core.CustomData({
							key: "id",
							value: lsColumnId
						})]
					});

					return roColumn;
				} else {
					// If not a checkbox, add the columns normal text column
					var lsColumnName = context.getObject().columnName;
					var lsColumnWidth = context.getObject().width;
					var lsHAlign = "Begin";
					if (context.getObject().type === "INTEGER") {
						lsHAlign = "End";
					}
					var lsSequence = null;
					var lsType = null;

					if (context.getObject().sequence) {
						lsSequence = context.getObject().sequence;
					}
					if (context.getObject().type) {
						lsType = context.getObject().type;
					}
					//				var lsColumnWidth = "150px";	//context.getObject().width;

					var roColumn = new sap.ui.table.Column({
						resizable: true,
						width: lsColumnWidth,
						hAlign: lsHAlign,
						label: lsColumnName,
						tooltip : lsColumnName,
						// If column has a date, convert date to format DD-MM-YYYY
						template: _self.getLabelForColumns(lsColumnId),
						width: lsColumnWidth,
						visible: lsVisible,
						// Add custom data for adding sequence, type and id of column
						customData: [new sap.ui.core.CustomData({
							key: "sequence",
							value: lsSequence
						}), new sap.ui.core.CustomData({
							key: "type",
							value: lsType
						}), new sap.ui.core.CustomData({
							key: "id",
							value: lsColumnId
						})]
					});

					return roColumn;
				}
			});
		},

		/**
		 * Checks if multiple approval required
		 * 
		 * @returns {String} displays icon if multiple approval required 
		 */
		isMultipleLevelApproval : function (isColumnId) {
			return new sap.ui.core.Icon().bindProperty("src", isColumnId, function(isText) {
				if (isText === 'X'){
					return "sap-icon://hr-approval";
				} else {
					return "";
				}
			});
		},

		/**
		 * Return the label with tooltip for the columns of table
		 * 
		 * @return {sap.m.Label} roLabal is label for columns of table
		 */
		getLabelForColumns : function (isColumnId) {
			var roLabel = new sap.m.Label().bindProperty("text", isColumnId, function(isText) {
				if (isText) {
					if (isText.indexOf("/Date(") !== -1) {
						var lsDate = isText.replace("/Date(", "");
						lsDate = lsDate.replace(")/", "");
						if (parseInt(lsDate, 10) > 0) {
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
							return "";
						}
					} else {
						return isText;
					}
				}
			}).addStyleClass("dynamicTableCellText");

			roLabel.bindProperty("tooltip", isColumnId, function(isText) {
				if (isText) {
					if (isText.indexOf("/Date(") !== -1) {
						var lsDate = isText.replace("/Date(", "");
						lsDate = lsDate.replace(")/", "");
						if (parseInt(lsDate, 10) > 0) {
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
							return "";
						}
					} else {
						return isText;
					}
				}
			}).addStyleClass("dynamicTableCellText");

			return roLabel;
		},

		/**
		 * Get the field array from the JSON data to be displayed
		 * 
		 * @return : {object|JSON Array}
		 * 			raColumns the array of keys if the JSON data array
		 */
		getColumnIdArray: function() {
			var laColumns = [];
			if (this.getTableData()) {
				// Loop through the table data to get all the columns in the input data
				for (var keys in this.getTableData()[0]) {
					var loColumn = {};
					if (this.getExcludeTableColumnNames().indexOf(keys) === -1) {
						loColumn.columnId = keys;
						laColumns.push(loColumn);
					}
				}

				//Get Column Names
				laColumns = this.columnIdToNameMapping(laColumns);

				//Sort Column order on Sequence
				laColumns = this.sortByKey(laColumns, "sequence");
				var raColumns = [];
				if (this.getDocumentType() === goOrderType.CreditBlockedOrders) {
					raColumns = [{
						columnId: "rmApprReqd",
						visible: true
					}];
				}
				for (var i = 0; i < laColumns.length; i++) {
					raColumns.push(laColumns[i]);
				}

				return raColumns;
			}
		},

		/**
		 * Mapping the keys of the data JSON to the columns fields based on the configuration for the fields.
		 * 
		 * @param : {object|JSON Array}
		 * 			iaColumns the array of keys in JSON data to be displayed
		 * 
		 * @return : {object|JSON Array}
		 * 			raColumns the array of columns to displayed in table with there configurations
		 */
		columnIdToNameMapping: function(iaColumns) {
			var raColumns = [];
			// Loop thorough all the fields of the imported JSON data
			for (var i = 0; i < iaColumns.length; i++) {
				if (this.getTableConfigData().length > 0) {
					for (var j = 0; j < this.getTableConfigData().length; j++) {
						var loColumn = {};
						// If configurations exists for the document type. If yes, loop through the fields of the blocks of that document type
						if (this.getTableConfigData()[j].documentType.toUpperCase() === this.getDocumentType().toUpperCase()) {
							for (var k = 0; k < this.getTableConfigData()[j].blockFields.length; k++) {
								// If configuration exist for the field, check if its valid for table display and other configuration of columns
								if (iaColumns[i].columnId === this.getTableConfigData()[j].blockFields[k].fieldId &&
										this.getTableConfigData()[j].blockFields[k].w.visibleInTable == true) {
									loColumn.columnId = this.getTableConfigData()[j].blockFields[k].fieldId;
									loColumn.columnName = this.getTableConfigData()[j].blockFields[k].displayText;

									if (this.getTableConfigData()[j].blockFields[k].w.visibleInTable == false) {
										loColumn.visible = false;
									} else {
										loColumn.visible = true;
									}

									if (this.getTableConfigData()[j].blockFields[k].fieldType) {
										loColumn.type = this.getTableConfigData()[j].blockFields[k].fieldType;
									}

									if (this.getTableConfigData()[j].blockFields[k].w.widthInWebTable) {
										loColumn.width = this.getTableConfigData()[j].blockFields[k].w.widthInWebTable;
									} else {
										loColumn.width = this.getColumnWidth();
									}

									if (this.getTableConfigData()[j].blockFields[k].w.sequenceInWebTab) {
										loColumn.sequence = this.getTableConfigData()[j].blockFields[k].w.sequenceInWebTab;
									}
									raColumns.push(loColumn);
									break;
								}
							}
						}
					}
				} else {
					// If no configuration exists, show all fields
					loColumn.columnName = iaColumns[i].columnId;
					raColumns.push(loColumn);
				}
			}

			return raColumns;
		},

		/**
		 * Sorting a JSON array
		 * 
		 * @param : {array|JSON array}
		 * 			iaInput array to be sorted
		 * 
		 * @param : {string}
		 * 			isKey Key based on which data in array has to be sorted
		 * 
		 * @return : {integer} if x < y returns -1, else if x > y, returns 1 otherwise 0 
		 */
		sortByKey: function(iaInput, isKey) {
			return iaInput.sort(function(a, b) {
				var x = a[isKey];
				var y = b[isKey];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		},

		/**
		 * Changing the styling of column headers of table
		 */
		changeTableHeaderColor: function() {
			var loTable = this.getTable();
			for (var i = 0; i < loTable.getColumns().length; i++) {
				var lsColumnId = loTable.getColumns()[i].getId();
				$("#" + lsColumnId).addClass("tableHeader");
			}
		}
};