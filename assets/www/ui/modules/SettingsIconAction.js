jQuery.sap.declare("modules.SettingsIconAction");

//CONSTRUCTOR
modules.SettingsIconAction = function(options) {
	this.options = jQuery.extend({}, this.defaultSettings, options);

	//	Initialize the form Layout
	this.init();
};

//object instance methods
modules.SettingsIconAction.prototype = {
		defaultSettings: {
			page: ""
		},

		/**
		 * Get the action button
		 * 
		 * @returns {sap.m.ActionSheet} is the Action button
		 */
		getActionSheet: function() {
			return this.options.actionSheet;
		},

		/**
		 * Get the Out of office button
		 * 
		 * @returns {sap.m.Button} is out of office button
		 */
		getOOOButton: function() {
			return this.options.oOOButton;
		},

		/**
		 * Get the Transfer Button
		 * 
		 * @returns {sap.m.Button}
		 */
		getTransferButton: function() {
			return this.options.transferButton;
		},

		/**
		 * Get the Push Notification Button
		 * 
		 * @returns {sap.m.Button} is push notification
		 */
		getPushNotificationButton: function() {
			return this.options.pushNotificationButton;
		},

		/**
		 * Get he logout button
		 * 
		 * @returns {sap.m.Button} is logout button
		 */
		getLogoutButton: function() {
			return this.options.logoutButton;
		},

		/**
		 * Initialize the form layout
		 */
		init: function() {
			this.options.actionSheet = null;
			this.options.roOOOButton = null;
			this.options.transferButton = null;
			this.options.pushNotificationButton = null;
			this.options.logoutButton = null;

			this.createActionSheet();
		},

		/**
		 * Create Action Sheet
		 */
		createActionSheet : function() {
			var loActionSheet = new sap.m.ActionSheet({
				buttons: [
				          this.createOOOButton(),
				          this.createTransferButton(),
				          this.createPushNotificationButton(),
				          this.createLogoutButton()]
			});
			this.options.actionSheet = loActionSheet;
			this.setButtonVisibility();
		},

		/**
		 * Create Out of office button
		 * 
		 * @returns {sap.m.Button} roOOOButton is out of office button
		 */
		createOOOButton : function() {
			var _self = this;
			var roOOOButton = new sap.m.Button({
				text: goBundle.getText("OUT_OF_OFFICE"),
				press: function(ioEvent) {
					_self.onPressOutOfOffice(ioEvent);
				}
			});
			this.options.oOOButton = roOOOButton;

			return roOOOButton;
		},

		/**
		 * Create Transfer button
		 * 
		 * @returns {sap.m.Button} roTransferButton is Transfer Button
		 */
		createTransferButton : function() {
			var _self = this;
			var roTransferButton = new sap.m.Button({
				text: goBundle.getText("EMPLOYEE_TRANSFER"),
				press: function(ioEvent) {
					_self.onPressEmployeeTransfer(ioEvent);
				}
			});
			this.options.transferButton = roTransferButton;

			return roTransferButton;
		},

		/**
		 * Create push notification button
		 * 
		 * @returns {sap.m.Button} roPushNotificationButton is Push notification button
		 */
		createPushNotificationButton : function() {
			var _self = this;
			var roPushNotificationButton = new sap.m.Button({
				text: goBundle.getText("PUSH_NOTIFICATION"),
				press: function(ioEvent) {
					_self.onPressPushNotification(ioEvent);
				}
			});
			this.options.pushNotificationButton = roPushNotificationButton;

			return roPushNotificationButton;
		},

		/**
		 * Create the logout button
		 * 
		 * @returns {sap.m.Button} roLogoutButton is the Logout button 
		 */
		createLogoutButton : function() {
			var _self = this;
			var roLogoutButton = new sap.m.Button({
				text: goBundle.getText("LOGOUT"),
				press: function() {
					_self.onPressLogout();
				}
			});
			this.options.logoutButton = roLogoutButton;

			return roLogoutButton;
		},

		/**
		 * On click of Out of Office button in action sheet, it will routing to out of office view
		 * 
		 * @param {Event} ioEvent the fired event
		 */
		onPressOutOfOffice: function(ioEvent) {
			if (this.options.page) {
				var loView = this.options.page.getParent();
				var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
				loRouter.navTo("OutOfOffice");
			}
		},

		/**
		 * On click of Employee Transfer button in action sheet, it will routing to employee transfer view
		 * 
		 * @param {Event} ioEvent the fired event
		 */
		onPressEmployeeTransfer: function(ioEvent) {
			if (this.options.page) {
				var loView = this.options.page.getParent();
				var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
				loRouter.navTo("EmployeeTransfer");
			}
		},

		/**
		 * On click of Push Notification button in action sheet, it will routing to push notification view
		 * 
		 * @param {Event} ioEvent the fired event
		 */
		onPressPushNotification: function(ioEvent) {
			var loView = this.options.page.getParent();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(loView);
			loRouter.navTo("PushNotification");
		},

		/**
		 * Event handler for logout button
		 * 
		 * @param {Object} ioEvent is Event handler Object
		 */
		onPressLogout: function(ioEvent) {
			if (this.options.page) {
				goConfig.smpAppCID = "";
				goConfig.userId = "";
				goConfig.password = "";
				window.location.href = "../index.html?loginKey=0";
			}
		},
		
		/**
		 * Delete the cookie created by batch process
		 */
		deleteCookie: function() {
			var loCookies = document.cookie;

			for (var i = 0; i < loCookies.split(";").length; ++i)
			{
				var loCurentCookie = loCookies[i];
				var pos = loCurentCookie.indexOf("=");
				var name = pos > -1 ? loCurentCookie.substr(0, pos) : loCurentCookie;
				document.cookie = name + new Date().toGMTString();
			}
		},

		/**
		 * Set the visibility of the buttons based on app type
		 */
		setButtonVisibility : function() {
			if (goConfig.appType === "w") {
				this.getOOOButton().setVisible(true);
				if (goConfig.userDesignation === "RM") {
					this.getTransferButton().setVisible(true);
				}else {
					this.getTransferButton().setVisible(false);
				}
				this.getPushNotificationButton().setVisible(false);
			} else {
				this.getOOOButton().setVisible(true);
				this.getTransferButton().setVisible(false);
				this.getPushNotificationButton().setVisible(true);
			}
		}
};