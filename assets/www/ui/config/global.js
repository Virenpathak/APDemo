//Required
jQuery.sap.require("framework.ajax");
//Declare
jQuery.sap.declare("asianpaints.dra.config.global");

//Model object
var goModel = new sap.ui.model.json.JSONModel();

// LoginData Object
var oLoginDataModel = sap.ui.getCore().getModel("loginDataModel").getProperty("/data");
var sUser = oLoginDataModel[0].userId;
var sAppCid = oLoginDataModel[0].appCID;
var sPsswd = oLoginDataModel[0].psswd;

//General application configuration
var goConfig = {
		// ipAddress : "http://localhost:52341",
		// "http://172.25.110.149:8080", //"http://localhost:57035", //"http://172.25.10.102:8000",
		isSessionActive: false,
		ipAddress: "http://apsmpdev.asianpaints.com:8080",
		appType: "m", //m or w
		appData: "live", //mock or live
		smpAppCID: sAppCid, //window.localStorage.getItem("appcid"), //"50c61866-de1f-4760-b9f0-f12a3eba0437",
		userId: sUser.toUpperCase(), // window.localStorage.getItem("user").toUpperCase(), //"P00110370", //"P00114444";//"VIRENDRAP";P00110371;CHAITHANYA
		password: sPsswd, //window.localStorage.getItem("password"), //"password@1",
		maxItemSelected: 5,
		userDesignation: "",
		systemId: "",
		sfUserName: "",
		sfPassword: ""
};

//Is Refresh required
var goIsRefreshRequired = true;

//Language Locale settings
var gsLocale = sap.ui.getCore().getConfiguration().getLanguage();
//i18n Bundle object
var goBundle = jQuery.sap.resources({
	url: "i18n/i18n.properties",
	locale: gsLocale
});

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

jQuery.sap.require("modules.GetInitData");
//Function to get URL
function getUrl(isUrl) {
	return goUrl[isUrl][goConfig.appData];
};

//Busy indicator
function getBusy() {
	var roBusy = new sap.m.BusyDialog();

	return roBusy;
};

//List for application service URL's 
var goUrl = {
		configurationData: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/UserConfigurationSet",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/ConfigurationData.json"
		},
		CreditBlockedOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/CreditBlockedSet?" +
			"$filter=UserID eq '" + goConfig.userId + "' and DocType eq 'CREDIT_RELEASE'",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/CreditBlockedOrders.json"
		},
		DiscountOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DiscountOrderHeaderSet" +
			"?$filter=UserID eq '" + goConfig.userId +
			"' and DocType eq 'DISC_ORDER'&$expand=NavDiscountOrderHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/DamagedOrders.json"
		},
		DamagedOrders: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DamagedOrderHeaderSet" +
			"?$filter=UserID eq '" + goConfig.userId + "' and DocType eq 'DAMAGED_ORDER'" +
			"&$expand=NavDamagedOrderHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/DiscountOrders.json"
		},
		MaterialReturn: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/MaterialReturnHeaderSet" +
			"?$filter=UserID eq '" + goConfig.userId + "' and DocType eq 'MATERIAL_RETURN'" +
			"&$expand=NavMaterialReturnHeaderToItem&$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/MaterialReturn.json"
		},
		outOfOfficeGetData: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/OutOfOfficeSet?$filter=UserID eq '" + goConfig.userId 
			+ "'&$format=json",
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
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/OrderStatusSearchSet" + "?$filter=UserID eq '" + goConfig.userId + "'",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/OrderStatusSearch.json"
		},
		pushNotification: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/PushNotificationSettingSet('" + goConfig.userId + "')?$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/PushNotification.json"
		},
		employeeDetail: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/BackendConfigurationSet?$filter=UserID eq '" + goConfig.userId + "' &$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/EmployeeDetail.json"
		},
		employeeTransfer: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/EmployeeTransferSet?$filter=empId eq '" + goConfig.userId + "' &$format=json",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/EmployeeTransfer.json"
		},
		SFUserData:{
//			live: goConfig.ipAddress + "/com.successfactor.dev/User('",
			live: "https://hcm8preview.sapsf.com/odata/v2/User('",
			mock: "https://hcm8preview.sapsf.com/odata/v2/User('"
		},
		batchProcess: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease"
		},
		PaymentDueDetails: {
			live: goConfig.ipAddress + "/com.asianpaints.docrelease/DueDatePaymentSet?$filter=companyCode eq '",
			mock: goConfig.ipAddress + "/AsianPaints_DRA/ui/framework/mockData/PaymentDueDetails.json"
		},
		IPAddress: {
			live: goConfig.ipAddress + "/ipmac/GetIPMacAddress"
		},
		deleteAllHTTPCookies: {
			live: goConfig.ipAddress + "/cookiedel/DeleteSessionCookies"
		}
};

//Service call to initially load all the Configuration data
var loInitData = new modules.GetInitData();
//Change the default appType settings based on device
goConfig.appType = loInitData.updateAppType();
//get the users IP address and mac Address
goConfig.systemId = loInitData.getIPAddress(this.getUrl("IPAddress"));
//Get the system IP Address
var gaBlockFieldsDetails = loInitData.formatInitData(this.getUrl("configurationData"));

//Getting application specific configuration from back-end
goConfig = loInitData.getAppConfiguration(this.getUrl("employeeDetail"), goConfig);

//Document list object
jQuery.sap.require("modules.DocumentList");
var goDocumentList = new modules.DocumentList();