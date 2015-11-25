//Declare
jQuery.sap.declare("modules.DocumentList");

//CONSTRUCTOR
modules.DocumentList = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

/**
 * Internationalization resource bundle
 */
var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
var oBundle = jQuery.sap.resources({
	url: "i18n/i18n.properties",
	locale: sLocale
});

/**
 * Menu list item displayed with document order name and icon's as well as number orders for each
 */
modules.DocumentList.prototype = {
		defaultSettings: {
			aDocumentTypes: [{
				id: goOrderType.CreditBlockedOrders,
				title: oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_CREDIT"),
				icon: "../ui/img/m/ic_block_black_24dp_2x.png"
			}, {
				id: goOrderType.DiscountOrders,
				title: oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DISCOUNT"),
				icon: "../ui/img/m/ic_redeem_black_24dp_2x.png"
			}, {
				id: goOrderType.DamagedOrders,
				title: oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_DAMAGED"),
				icon: "../ui/img/m/ic_report_problem_black_24dp_2x.png"
			}, {
				id: goOrderType.MaterialReturn,
				title: oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_MATERIAL"),
				icon: "../ui/img/m/ic_find_replace_black_24dp_2x.png"
			}
			],

			aCounters: [{
				id: goOrderType.CreditBlockedOrders,
				counter: 24
			}, {
				id: goOrderType.DiscountOrders,
				counter: 2
			}, {
				id: goOrderType.DamagedOrders,
				counter: 6
			}, {
				id: goOrderType.MaterialReturn,
				counter: 9
			}],
			oSelected: {
				id: goOrderType.CreditBlockedOrders,
				selected: true
			}
		},

		/**
		 * Initialize the control and its internal aggregations.
		 */
		init: function() {
			var loList = this.createList();
			this.options.menuList = loList;
		},

		/**
		 * rendering the list item menu
		 * 
		 * @returns {object} roList is returning the list object
		 */
		render: function() {
			var roList = this.options.menuList;
			this.handleListClick(roList.getSelectedItem());

			return roList;
		},

		/**
		 * Creates list for document order menu, internal events and aggregation
		 *  
		 * @returns {sap.m.List} roList is object for list
		 */
		createList: function() {
			var _self = this;
			var roList = new sap.m.List({
				mode: sap.m.ListMode.SingleSelectMaster,
				select: function(ioEvent) {
					_self.handleListClick(ioEvent.getSource().getSelectedItem());
				}
			});

			var loTemplate = new sap.m.StandardListItem({
				title: "{title}",
				counter: "{counter}",
				selected: "{selected}",
				icon: "{icon}"
			});
			if (goConfig.appType === "w" && this.options.aDocumentTypes.length < 5) {
				var loOrderStatusSearch = {};
				loOrderStatusSearch.id = "orderStatusSearch";
				loOrderStatusSearch.title = oBundle.getText("DOCUMENT_LIST_DOC_TYPES_TITLE_ORDERSTATUS");
				loOrderStatusSearch.icon = "../ui/img/m/ic_search_black_24dp_2x.png";
				this.options.aDocumentTypes.push(loOrderStatusSearch);
			}
			goModel.setProperty("/documentTypes", this.options.aDocumentTypes);
			roList.setModel(goModel);
			roList.bindAggregation("items", "/documentTypes", loTemplate);
			//Update the Selected Item for web, If mobile, set item selection to false
			this.setSelected(this.options.oSelected);				

			return roList;
		},

		/**
		 * On click of any menu list, it will navigating to the corresponding document order list or table.
		 *  
		 * @param {object} loSelectedItem is object of menu list
		 */
		handleListClick: function(loSelectedItem) {
			var loMenu = sap.ui.getCore().byId("__xmlview0");
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loMenu);
			var loContext = loSelectedItem.getBindingContext();
			var loPath = loContext.sPath;
			var loIndexOf = loPath.lastIndexOf('/') + 1;
			var loIndexValue = loPath.substring(loIndexOf, loPath.length);
			loRouter.navTo("DocumentOrders", {
				docOrder: loIndexValue
			});
		},

		/**
		 * Each document order have corresponding order counts in this list
		 *  
		 * @param {Interger} laCounters is documemnt orders counter
		 */
		updateCounter: function(laCounters) {
			for (var i = 0; i < laCounters.length; i++) {
				for (var j = 0; j < goModel.getData().documentTypes.length; j++) {
					if (laCounters[i].id === goModel.getData().documentTypes[j].id) {
						goModel.getData().documentTypes[j].counter = laCounters[i].counter;
						break;
					}
				}
			}
			goModel.refresh();
		},

		/**
		 * Set the selected item.
		 * 
		 * @param {object} loSelected is selected menu item in list
		 */
		setSelected: function(loSelected) {
			for (var i = 0; i < goModel.getData().documentTypes.length; i++) {
				if (goModel.getData().documentTypes[i].id === loSelected.id) {
					goModel.getData().documentTypes[i].selected = loSelected.selected;
				}
			}
			goModel.refresh();
		}
};