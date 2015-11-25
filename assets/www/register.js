/*
 * @File For Registering User on SMP
*/
var db;
applicationContext = null;

window.onerror = onError;

function onError(msg, url, line) {
    var idx = url.lastIndexOf("/");
    var file = "unknown";
    if (idx > -1) {
        file = url.substring(idx + 1);
    }
    alert("An error occurred in " + file + " (at line # " + line + "): " + msg);
    return false; //suppressErrorAlert;
}

function register() {

	if (applicationContext) { 
                
                  read();          		
              } 
              
             else{
  	       
              var appId = "com.asianpaints.docrelease";              
              
              // Optional initial connection context
              var context = {
                  "serverHost": "apsmpdev.asianpaints.com", //"172.20.1.49", //Place your SMP 3.0 server name here
                  "https": "false",
                  "serverPort": "8080",
                  "user": "", //Since the application com.mycompany.logon uses the No Authentication Challenge provider, any user name and password will work.
                  "password": "", //once set can be changed by calling sap.Logon.changePassword()
                  "communicatorId": "REST"
              };
              

              sap.Logon.init(logonSuccessCallback, logonErrorCallback, appId, context);
              }
}


function logonSuccessCallback(result) {
	console.log("logonSuccessCallback " + JSON.stringify(result));
	
	applicationContext = result;
	
	registerForPush();
}

 function registerForPush() {
                var nTypes = sap.Push.notificationType.SOUNDS | sap.Push.notificationType.ALERT;
                sap.Push.registerForNotificationTypes(nTypes, regSuccess, regFailure, processNotification, "ap-project-1061");  //GCM Sender ID, null for APNS
            }

 function regSuccess(result) {
  console.log("Successfully registered: " + JSON.stringify(result));
  
  sap.m.MessageToast.show("Application Successfully Registered",{
  	        width: "20em",
  	       });
    
    aViewData = [{"userId":applicationContext.registrationContext.user,"password":applicationContext.registrationContext.password,"appCId":applicationContext.applicationConnectionId}];
    
     insert();
    
    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData({data:aViewData});
    
   	 sap.ui.getCore().setModel(oModel);
    
    sap.ui.localResources("loginscreen");
					var app = new sap.m.App({initialPage:"idlogin1"});
					var page = sap.ui.view({id:"idlogin1", viewName:"loginscreen.login", type:sap.ui.core.mvc.ViewType.XML});
					app.addPage(page);
					app.placeAt("content");
 }
            
  function regFailure(errorInfo) {
  alert("Error while registering.  " + JSON.stringify(errorInfo));
  console.log("Error while registering.  " + JSON.stringify(errorInfo));
  }

function processNotification(notification) {
	alert("in process");
                alert("in processNotification: " + JSON.stringify(notification));
                console.log("Received a notifcation: " + JSON.stringify(notification));
 }
   
function processMissedNotification(notification) {

    alert("In processMissedNotification " + JSON.stringify(notification));
    console.log("In processMissedNotification");
    console.log("Received a missed notification: " + JSON.stringify(notification));
            }

            function checkForNotification() {
                sap.Push.checkForNotification(processMissedNotification);
            }
            
function logonErrorCallback(error) {   //this method is called if the user cancels the registration.
    console.log("An error occurred:  " + JSON.stringify(error));
    if (device.platform == "Android") {  //Not supported on iOS
        navigator.app.exitApp();
    }
}

function unRegister() {
    if (applicationContext == null) {
        alert("Not Registered");
        return;
    }
    sap.Logon.core.deleteRegistration(logonUnregisterSuccessCallback, unRegisterErrorCallback);
}

function unRegisterErrorCallback(error) {
    console.log("An error occurred:  " + JSON.stringify(error));
}

function onDeviceReady() {
		if (sap.Logger) {
                    sap.Logger.setLogLevel(sap.Logger.DEBUG);  //enables the display of debug log messages from the Kapsel plugins.
                    sap.Logger.debug("Log level set to DEBUG");
                }
                
         db = window.sqlitePlugin.openDatabase("AsianPaints", "1.0", "APDRA", -1);
         db.transaction(function(tx) {
        	 
        	tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATA (id integer primary key, isLogin integer, appId text, userId text, pwd text)');
         	tx.executeSql("SELECT appId,userId,pwd from APPDATA;", [], function(tx, res) {
         		
         		var len = res.rows.length;
         
               if(len>0){
            	   
               applicationContext = res.rows.item(0).appId;
               var id = res.rows.item(0).userId;
               var kp = res.rows.item(0).pwd;
            
               }
               register();
            },null);
         	
           
         });
      }

function read(){

	var appCId,userId, pwd, isLogin;
	db.transaction(function(tx) {
    
    	tx.executeSql("SELECT id, isLogin, appId, userId, pwd from APPDATA;", [], function(tx, res) {
          console.log("res.rows.length: " + res.rows.length + " -- should be 1");
          
          appCId = res.rows.item(0).appId;
          userId = res.rows.item(0).userId;
          pwd = res.rows.item(0).pwd;
          isLogin = res.rows.item(0).isLogin;
        	
       });
      
    });
    
    setTimeout(function(){
    
    var SearchString = window.location.search.substring(1);
    if(SearchString){
    	var keyValue = SearchString.split('='); 
    	update(keyValue[1]);
    	isLogin = keyValue[1];
    }
 	
    aViewData = [{"userId":userId,"password":pwd,"appCId":appCId}];
    
   	 var oModel = new sap.ui.model.json.JSONModel();
   	 oModel.setData({data:aViewData});
    
   	 sap.ui.getCore().setModel(oModel);
   	 if(isLogin == 0){
   	 
   	 				sap.ui.localResources("loginscreen");
					var app = new sap.m.App({initialPage:"idlogin1"});
					var page = sap.ui.view({id:"idlogin1", viewName:"loginscreen.login", type:sap.ui.core.mvc.ViewType.XML});
					app.addPage(page);
					app.placeAt("content");   	 
   	 }
   	 else{
   	 	window.location.href = "ui/index_m.html?uId="+userId+"&appCid="+appCId+"&pwd="+pwd;
   	 }
     
    
    },1000);
		
	
}


function insert(){
		
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATA (id integer primary key, isLogin integer, appId text, userId text, pwd text)');
		
        tx.executeSql("INSERT INTO APPDATA (appId, isLogin, userId, pwd) VALUES (?,?,?,?)", [applicationContext.applicationConnectionId, 0, applicationContext.registrationContext.user, applicationContext.registrationContext.password], function(tx, res) {
	
        }, function(e) {
          console.log("ERROR: ", e.message);
        });
});
}

function update(val){
		db.transaction(function(tx) {
        tx.executeSql("UPDATE APPDATA SET isLogin = ? WHERE id =?", [val,1], function(tx, res) {
        }, function(e) {
          console.log("ERROR: ", e.message);
        });
});
}
