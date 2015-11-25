jQuery.sap.declare("framework.ajax");

//CONSTRUCTOR
framework.ajax = function(options) {
	this.options = jQuery.extend(true, this.defaultSettings, options);
};

//Object Instance Methods
framework.ajax.prototype = {
		defaultSettings : {
			param : {
				url : "",
				contentType : "application/atom+xml",
				dataType : "JSON",
				type : "GET",
				async : false,
				data : null,
				username : "",
				password: "",
				headers: {
//					"Authorization": "Basic " + btoa(" virendrap : password@1"),
					"X-SMP-APPCID" : "50c61866-de1f-4760-b9f0-f12a3eba0437"
				},
//				timeout : null,	//Not sure on Default value
				statusCode : {}
			},
			localBusyIndicator : {
				show : false,
				delay : 10,
				instance : []
			},
			busyDialog : {
				show : false,
				busyDialogTimeout : 5000,	//milliseconds
			},
			callCounter : 0,
			onBeforeSendCallback : function(ioJqXHR, ioSettings) {
				this.beforeSend();
			},
			success : function(ioData, isTextStatus, ioJqXHR) {},
			error : function(ioJqXHR, isTextStatus, isErrorThrown) {},
			complete : function(ioJqXHR, isTextStatus) {}
		},

		call : function(ioParam) {
			var _self = this;
			var loAjaxParam = ioParam;
			if (!loAjaxParam) {
				loAjaxParam = this.options.param;
			} else {
				if (loAjaxParam.contentType === undefined) {
					loAjaxParam.contentType = "application/atom+xml";
				}
				if (loAjaxParam.dataType === undefined) {
					loAjaxParam.dataType = "JSON";
				}
				if (loAjaxParam.async === undefined) {
					loAjaxParam.async = "false";
				}
			}

			if (loAjaxParam.url) {
				jQuery.ajax({
					url: loAjaxParam.url,
					contentType : loAjaxParam.contentType,
					dataType : loAjaxParam.dataType,
					type : loAjaxParam.type,
					async :	loAjaxParam.async,
					username : loAjaxParam.username,
					password : loAjaxParam.password,
					headers: loAjaxParam.headers,
					data : loAjaxParam.data,
//					timeout : ioParam.timeout,	//Not sure on Default value

					beforeSend : function(ioJqXHR, ioSettings) {
						_self.beforeSend(ioJqXHR, ioSettings);
					},

					success: function(data, textStatus, jqXHR) {
						_self.success(data, textStatus, jqXHR);
					},

					error : function(jqXHR, textStatus, errorThrown) {
						_self.error(jqXHR, textStatus, errorThrown);
					},

					complete : function(jqXHR, textStatus) {
						_self.complete(jqXHR, textStatus);
					}
				});
			}
		},

		success : function(ioData, isTextStatus, ioJqXHR) {
			this.options.success(ioData, isTextStatus, ioJqXHR);
		},

		error : function(ioJqXHR, isTextStatus, isErrorThrown) {
			this.options.error(ioJqXHR, isTextStatus, isErrorThrown);
		},

		complete : function(ioJqXHR, isTextStatus) {
			if (this.options.localBusyIndicator.show === true && this.options.localBusyIndicator.instance) {
				for (var i=0;i<this.options.localBusyIndicator.instance.length;i++) {
					this.options.localBusyIndicator.instance[i].setBusy(false);
				}
			}
			this.options.complete(ioJqXHR, isTextStatus);
		},

		beforeSend : function(ioJqXHR, ioSettings) {
			if (this.options.localBusyIndicator.show === true && this.options.localBusyIndicator.instance) {
				for (var i=0;i<this.options.localBusyIndicator.instance.length;i++) {
					this.options.localBusyIndicator.instance[i].setBusyIndicatorDelay(this.options.localBusyIndicator.delay);
					this.options.localBusyIndicator.instance[i].setBusy(true);
				}
			}
		},

		busyDialog : function() {
			if (giBusyCounter !== null) {
				giBusyCounter++;
			}
			this.options.busy = new sap.m.BusyDialog({});

			return this.options.busy;
		}
};