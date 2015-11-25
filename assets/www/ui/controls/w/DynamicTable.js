//Declare
jQuery.sap.declare("controls.w.DynamicTable");

/**
 * The DynamicTable control is the base class of DynamicTable. It provides functionality to add dynamically table and its contents by via ajax service calls.
 * This is done by using standard Table control sap.ui.table.Table and sap.ui.table.Column. It provides a mechanism for adding table and its entries
 * using  json structure containing data and the UI configuration. 
 * 
 * <ul>
 * <li>Properties
 * <ul>
 * <li>title : string (default: 'Title') The title of the Table.</li>
 * <li>documentType : string (default: '') The document type data to be displayed.</li>
 * <li>showTitle : boolean (default: false) True if the title should be showed, false otherwise.</li>
 * <li>showToolbar : boolean (default: false) True if the toolbar should be showed, false otherwise.</li>
 * <li>selectionMode : sap.ui.table.SelectionMode (default: 'Multi') The selection mode allowed for the table control.</li>
 * <li>height : sap.ui.core.CSSSize (default: '100%') The height of table displayed.</li>
 * <li>width : sap.ui.core.CSSSize (default: '100%') The width of table displayed.</li>
 * <li>columnWidth : sap.ui.core.CSSSize (default: '80Px') The column width of table columns displayed if column width not specified.</li>
 * <li>excludeTableColumnNames : object (default: ["__metadata"]) The object representing the column names to be excluded out of imported json structure using service URL.</li>
 * <li>tableData : object (default: {}) The object representing the array of data to be displayed in the table</li>
 * <li>tableConfigData : object (default: {}) The object representing the array of configuration data for rendering the table.</li>
 * <li>columnHeaderColor : object (default: []) The object representing header columns CSS color properties.</li>
 * <li>maxItemSelection : integer (default: 5) This represents the maximum selection of items available in table.</li>
 * </ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>sort : Raised when sorting is triggered for table column.</li>
 * <li>columnMove : Raised when columns moved to different position TODO:  Is this needed</li>
 * <li>rowSelectionChange : Raised when the filter item was reset.</li>
 * <li>onSelectTableRowCheckBox : Raised when the checkbox is checked in table against the line item.</li>
 * </ul>
 * </li>
 * </ul>
 * 
 * @class
 * @extends sap.ui.core.Control
 * @name controls.w.DynamicTable
 */
sap.ui.core.Control.extend("controls.w.DynamicTable", {
	metadata: {
		properties: {
			"title": {
				type: "string",
				defaultValue: "Title"
			},
			"documentType": {
				type: "string",
				defaultValue: ""
			},
			"showTitle": {
				type: "boolean",
				defaultValue: false
			},
			"showToolbar": {
				type: "boolean",
				defaultValue: false
			},
			"selectionMode": {
				type: "sap.ui.table.SelectionMode",
				defaultValue: "Multi"
			},
			"height": {
				type: "sap.ui.core.CSSSize",
				defaultValue: "100%"
			},
			"width": {
				type: "sap.ui.core.CSSSize",
				defaultValue: "100%"
			},
			"columnWidth": {
				type: "sap.ui.core.CSSSize",
				defaultValue: "80px"
			},
			"excludeTableColumnNames": {
				type: "object",
				defaultValue: ["__metadata", "NavCreditBlockToDueDatePayment"]
			},
			"tableData": {
				type: "object"
			},
			"tableConfigData": {
				type: "object"
			},
			"columnHeaderColor": {
				type: "object",
				defaultValue: []
			},
			"maxItemSelection": {
				type: "integer",
				defaultValue: 2
			}
		},
		events: {
			"sort": {},
			"columnMove": {},
			"rowSelectionChange": {},
			"onSelectOrderNum": {}
		}
	},

	/**
	 * Initialize the control and its internal aggregations.
	 */
	init: function() {
		var loTableoModel = new sap.ui.model.json.JSONModel();
		this._TableModel = loTableoModel;
		this._oSelectedOrder = null;
		this._oTable = null;
		this.createTable();
	},

	getSelectedOrder: function() {
		return this._oSelectedOrder;
	},

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
	 * Returns selected table data
	 * 
	 * @returns {object|JSON Array}
	 */
	getSelectedTableData: function() {
		return this.selectedTableData;
	},

	/**
	 * Returns selected table data
	 * 
	 * @returns {object|JSON Array}
	 */
	setSelectedTableData: function(ioSelectedTableData) {
		this.selectedTableData = ioSelectedTableData;
	},

	/**
	 * Creates table object with required styling, custom events and aggregations
	 * 
	 * @return {object|sap.ui.table.Table}
	 * 			roTable the table object
	 */
	createTable: function() {
		var _self = this;
		if (sap.ui.getCore().byId(this.getId() + "_table")) {
			sap.ui.getCore().byId(this.getId() + "_table").destroy();
		}

		// Create the table object and add the custom events
		var roTable = new sap.ui.table.Table({
			id: this.getId() + "_table",
			fixedColumnCount: 1,
			selectionBehavior: sap.ui.table.SelectionBehavior.RowSelector,
			visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			enableSelectAll: false,
			selectionMode: _self.getSelectionMode(),
			sort: function(ioEvent) {
				_self.fireSort();
			},
			columnMove: function(ioEvent) {
				_self.fireColumnMove();
			},
			// Selection of table row
			rowSelectionChange: function(ioEvent) {
				if (_self.getDocumentType() != goOrderType.OrderStatusSearch) {
					var liIndex = ioEvent.getParameter('rowIndex');
					if (ioEvent.getSource().isIndexSelected(liIndex)) {
						var loContext = ioEvent.getSource().getContextByIndex(liIndex);
						var lsPath = loContext.sPath;
						var lobj = ioEvent.getSource().getModel().getProperty(lsPath);
						_self.setSelectedTableData(lobj);
						_self.fireRowSelectionChange(ioEvent);

					}
				}
			}
		});
		roTable.setVisibleRowCount(18);

		// If toolbar  is to be displayed, create and set the toolbar object
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
			if (context.getObject().columnId === "rmApprReq") {
				var loIcon = new sap.ui.core.Icon({
					src: "sap-icon://hr-approval"
				});
				// Add the checkbox as a column to table 
				var roColumn = new sap.ui.table.Column({
					id: _self.getId() + "_" + lsColumnId,
					resizable: true,
					template: loIcon,
//					bindProperty("src", lsColumnId, function(isText) {
//					if (isText) {
//					return isText;
//					}
//					}).addStyleClass("dynamicTableCellText"),
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
			} else if (context.getObject().columnId === "orderNo") {
				var loLink = new sap.m.Link({
//					selected: context.getObject().selected,
					press: function(ioEvent) {
						var loSelectedNode = ioEvent.getSource().getBindingContext().getObject();
						_self.setSelectedOrder(loSelectedNode);
						_self.fireOnSelectOrderNum();
					}
				});

				// Add the checkbox as a column to table 
				var roColumn = new sap.ui.table.Column({
					id: _self.getId() + "_" + lsColumnId,
					resizable: true,
					label: "ORDER NUM",
					tooltip : "ORDER NUM",
					template: loLink.bindProperty("text", lsColumnId, function(isText) {
						if (isText) {
							return isText;
						}
					}).addStyleClass("dynamicTableCellText"),
					width: "100px",
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
					id: _self.getId() + "_" + lsColumnId,
					resizable: true,
					width: lsColumnWidth,
					label: lsColumnName,
					tooltip : lsColumnName,
					// If column has a date, convert date to format DD-MM-YYYY
					template: _self.getLabalForColumns(lsColumnId),
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
	 * Return the label with tooltip for the columns of table
	 * 
	 * @return {sap.m.Label} roLabal is label for columns of table
	 */
	getLabalForColumns : function (isColumnId) {
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
			if (this.getDocumentType() !== "OrderStatusSearch") {
				raColumns = [{
					columnId: "rmApprReq"
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
	},

});