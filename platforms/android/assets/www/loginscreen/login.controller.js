sap.ui.controller("loginscreen.login", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf loginscreen.login
*/
	onInit: function() {
	
	
	
	var oLoginData = sap.ui.getCore().getModel().getProperty("/data");
	
	//var isLoginKey = sap.ui.getCore().getModel().getProperty("/isLoginData")[0].isLogin; 
	//alert("isLoginKey"+isLoginKey);  	 

	sap.ui.getCore().byId("idlogin1--userId").setValue(oLoginData[0].userId);
	sap.ui.getCore().byId("idlogin1--password").setValue(oLoginData[0].password);
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf loginscreen.login
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf loginscreen.login
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf loginscreen.login
*/
//	onExit: function() {
//
//	}
	
	onLogin:function(){	
	var oLoginBusyDialg = new sap.m.BusyDialog("loginBusyDlg");
	oLoginBusyDialg.open();
	var userId = sap.ui.getCore().byId("idlogin1--userId").getValue();
	var psswd = sap.ui.getCore().byId("idlogin1--password").getValue();
	
	var oLoginData = sap.ui.getCore().getModel().getProperty("/data"); 	
	
	var appCID = oLoginData[0].appCId;
	
	if(userId == oLoginData[0].userId && psswd == oLoginData[0].password ){
		var isLogin = 1;
		update(isLogin);
		setTimeout(function(){
		if(sap.ui.Device.system.desktop){

        	window.location.href = "ui/index.html";
        }
        else {
        	
        	if(sap.ui.Device.os.android){
        		
        		var aViewData = [{"userId":userId,"password":psswd,"appCId":oLoginData[0].appCId}];
        		window.location.href = "ui/index_m.html?uId="+userId+"&appCid="+appCID+"&pwd="+psswd;
        	}
        }
        }, 1000);
		
	}else{
		
		sap.m.MessageToast.show("Invalid Credentials!!!");
	}
		
	} 

});