//Required
jQuery.sap.require("framework.ajax");
//Declare
jQuery.sap.declare("asianpaints.dra.config.global");

//Model object
var goModel = new sap.ui.model.json.JSONModel();
//General application configuration
var goConfig = {
		//		ipAddress : "http://apsmpdev.asianpaints.com:8080",
		//		"http://172.25.110.149:8080", //"http://localhost:57035", //"http://172.25.10.102:8000",
		ipAddress: "http://apsmpdev.asianpaints.com:8080",
		appType: "w", //m or w
		appData: "live", //mock or live
		smpAppCID: "50c61866-de1f-4760-b9f0-f12a3eba0437"
};

//Language Locale settings
var gsLocale = sap.ui.getCore().getConfiguration().getLanguage();
//i18n Bundle object
var goBundle = jQuery.sap.resources({
	url: "i18n/i18n.properties",
	locale: gsLocale
});

//User logged
var goUserId = "P00110370"; //"P00114444";//"VIRENDRAP";P00110370
//Max selection available for the user in list and table landing screens
var giMaxItemSelection = 5;
//Global OData model
var goODataModel = null;

//Document order types
var goOrderType = {
		CreditBlockedOrders: "CreditBlockedOrders",
		DiscountOrders: "DiscountOrders",
		DamagedOrders: "DamagedOrders",
		MaterialReturn: "MaterialReturn",
		OrderStatusSearch: "OrderStatusSearch"
};

//User configurations from backend
var goUserConfig = {
		maxItemSelected: 5,
		userDesignation: ""
};

//List for application service URL's 
var goUrl = {
		configurationData: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/UserConfigurationSet",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/ConfigurationData.json"
		},
		CreditBlockedOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/CreditBlockedSet?" +
			"$filter=UserID eq '" + goUserId + "' and DocType eq 'CREDIT_RELEASE'",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/CreditBlockedOrders.json"
		},
		DiscountOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DiscountOrderHeaderSet" +
			"?$filter=UserID eq '" + goUserId +
			"' and DocType eq 'DISC_ORDER'&$expand=NavDiscountOrderHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/DamagedOrders.json"
		},
		DamagedOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DamagedOrderHeaderSet" +
			"?$filter=UserID eq '" + goUserId + "' and DocType eq 'DAMAGED_ORDER'" +
			"&$expand=NavDamagedOrderHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/DiscountOrders.json"
		},
		MaterialReturn: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/MaterialReturnHeaderSet" +
			"?$filter=UserID eq '" + goUserId + "' and DocType eq 'MATERIAL_RETURN'" +
			"&$expand=NavMaterialReturnHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/MaterialReturn.json"
		},
		outOfOfficeGetData: {
			live: "http://localhost:57037/AsianPaints_DRA/ui/framework/mockData/OutOfOfficeGetData.json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/OutOfOfficeGetData.json"
		},
		outOfOfficeStatus: {
			live: "http://localhost:57037/AsianPaints_DRA/ui/framework/mockData/OutOfOfficeStatus.json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/OutOfOfficeStatus.json"
		},
		outstandingInvoice: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/OutstandingSet",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/outstandingInvoice.json"
		},
		orderApproval: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease"
		},
		OrderStatusSearch: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/OrderStatusSearchSet" + "?$filter=UserID eq '" + goUserId + "'",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/OrderStatusSearch.json"
		},
		outOfOfficeGetData: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/OutOfOfficeGetData.json"
		},
		pushNotification: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/PushNotificationSettingSet('" + goUserId + "')?$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/PushNotification.json"
		},
		employeeDetail: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/BackendConfigurationSet?$filter=UserID eq '" + goUserId + "' &$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/EmployeeDetail.json"
		},
		employeeTransfer: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/EmployeeTransferSet?$filter=empId eq '" + goUserId + "' &$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/EmployeeTransfer.json"
		},
		batchProcess: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease"
		},
		PaymentDueDetails: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DueDatePaymentSet?" +
			"$filter=companyCode eq 'APIL' and dealerCode eq ",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/PaymentDueDetails.json"
		}
};

jQuery.sap.require("modules.GetInitData");

//Function to get URL
getUrl = function(isUrl) {
	return goUrl[isUrl][goConfig.appData];
};
//Busy indicator
getBusy = function() {
	var roBusy = new sap.m.BusyDialog();

	return roBusy;
};

jQuery.sap.require("modules.DocumentList");
//Document list object
var goDocumentList = new modules.DocumentList();

//Service call to initially load all the Configuration data
var loInitData = new modules.GetInitData();
var gaBlockFieldsDetails = loInitData.formatInitData(this.getUrl("configurationData"));

//Getting application specific configuration from back-end
goUserConfig = loInitData.getAppConfiguration(this.getUrl("employeeDetail"), goUserConfig);
giMaxItemSelection = goUserConfig.maxItemSelected;