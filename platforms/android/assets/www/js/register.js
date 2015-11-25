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
    
function logonUnregisterSuccessCallback(result) {
    alert("Successfully Unregistered");
    applicationContext = null;
    //sap.Logon.unlock(function () {},function (error) {});
}



function register() {
		setTimeout(function(){	
  	       if (applicationContext) {
                //  alert("Already Registered");
                  
               window.location.href = "login/index.html";
          		
              }
  	       else{	       
  	       
              var appId = "com.asianpaints.docrelease"; // Change this to app id on server              
              
              // Optional initial connection context
              var context = {
                  "serverHost": "apsmpdev.asianpaints.com", //Place your SMP 3.0 server name here
                  "https": "false",
                  "serverPort": "8080",
                  "user": "virendrap", //Since the application com.mycompany.logon uses the No Authentication Challenge provider, any user name and password will work.
                  "password": "password@1", //once set can be changed by calling sap.Logon.changePassword()
                  "communicatorId": "REST"
              };
              

              sap.Logon.init(logonSuccessCallback, logonErrorCallback, appId, context);
          
              //sap.Logon.unlock(logonSuccessCallback, errorCallback);  //No need to call this as init shows the register/unlock screen when called.
          }
          },2000);
}


function logonSuccessCallback(result) {
    alert("Successfully Registered");
    applicationContext = result;
    
    insert();
    
     window.location.href = "login/index.html";

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
	
         db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);
         db.transaction(function(tx) {
        	 
        	tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATA (id integer primary key, appId text)');
         	tx.executeSql("SELECT appId from APPDATA;", [], function(tx, res) {
         		
         		var len = res.rows.length,i;
         
               if(len>0){
            	   
               applicationContext = res.rows.item(0).appId;
            
               }
               register();
            },null);
         	
           
         });
      }

function read(){
	db.transaction(function(tx) {
    	
    	tx.executeSql("SELECT appId from APPDATA;", [], function(tx, res) {
        	alert("tx"+res);
          console.log("res.rows.length: " + res.rows.length + " -- should be 1");
          appId = res.rows.item(0).appId;
          alert("appId-->"+appId);
       });
      
    });
	
}


function insert(){	
	
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATA (id integer primary key, appId text)');

        tx.executeSql("INSERT INTO APPDATA (appId) VALUES (?)", [applicationContext.applicationConnectionId], function(tx, res) {
      

        }, function(e) {
          console.log("ERROR: " + e.message);
        });
});
}
