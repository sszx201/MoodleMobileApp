//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'MoodleMobApp': 'app',
    'Supsi':   'extensions/supsi'
});
//</debug>

Ext.application({
    name: 'MoodleMobApp',

    requires: [
        'Ext.MessageBox',
		'Ext.TitleBar',
		'Ext.Img',
		'Ext.data.identifier.Uuid',
		'MoodleMobApp.Config',
		'MoodleMobApp.Session',
		'MoodleMobApp.FileSystem',
		'MoodleMobApp.WebService',
		'MoodleMobApp.store.HomeOrgs'
    ],

	models: [
		"MoodleMobApp.model.Settings",
		"MoodleMobApp.model.AaiAccount",
		"MoodleMobApp.model.ManualAccount"
	],

	views: [
		'MoodleMobApp.view.About',
		'MoodleMobApp.view.UsageAgreement',
		'MoodleMobApp.view.Settings',
		'MoodleMobApp.view.CourseNavigator',
		'MoodleMobApp.view.CourseList',
		'MoodleMobApp.view.Course',
		'MoodleMobApp.view.Scorm',
		'MoodleMobApp.view.FileSlot'
	],

	controllers: [
		'MoodleMobApp.controller.Init',
		'MoodleMobApp.controller.Updater',
		'MoodleMobApp.controller.UsageAgreement',
		'MoodleMobApp.controller.Settings',
		'MoodleMobApp.controller.AaiAccount',
		'MoodleMobApp.controller.ManualAccount',
		'MoodleMobApp.controller.CourseNavigator',
		'MoodleMobApp.controller.Assignment', // legacy assignment
		'MoodleMobApp.controller.Assign',
		'MoodleMobApp.controller.Forum',
		'MoodleMobApp.controller.Folder',
		'MoodleMobApp.controller.Resource',
		'MoodleMobApp.controller.Choice',
		'MoodleMobApp.controller.Url',
		'MoodleMobApp.controller.Page',
		'MoodleMobApp.controller.Book',
		'MoodleMobApp.controller.Scorm',
		'MoodleMobApp.controller.ScormMetadataPanel',
		'MoodleMobApp.controller.ScormSettings',
		'MoodleMobApp.controller.ScormPlayer',
		'MoodleMobApp.controller.Quiz',
		'MoodleMobApp.controller.Workshop',
		'MoodleMobApp.controller.Database',
		'MoodleMobApp.controller.Glossary',
		'MoodleMobApp.controller.Wiki',
		'MoodleMobApp.controller.Feedback',
		'MoodleMobApp.controller.FileBrowser',
		'MoodleMobApp.controller.Downloader'
	],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
		// app log
		console._log = console.log;
		console.log = function(msg){
			if(MoodleMobApp.Config.getVerbose()) {
				console._log(msg);
			}
		};

		console._error = console.error;
		console.error = function(msg, obj){
			if(MoodleMobApp.Config.getVerbose()) {
				console._error(msg, obj);
			}
		};

		// add the architecture related extensions
		// this code is located under js/[arch]/extensions.js
		addExtensions();

        // Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingHeader').destroy();
		Ext.fly('appLoadingIndicator').destroy();

		// check if the usage agreement has been accepted or the account has been set
		if( MoodleMobApp.Session.getSettingsStore().first().getData().usageagreement == false ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.UsageAgreement'));
		} else if( MoodleMobApp.Session.getSettingsStore().first().getData().accounttype == '' ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.Settings'));
		} else {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.CourseNavigator'));
		}

		// Catch anchor clicks. Force opening in new windows.
		Ext.Viewport.element.dom.addEventListener('click', function (e) {
			if (e.target.tagName !== 'A') {
				return;
			} else {
				e.preventDefault();
				var href = e.target.getAttribute('href');
				window.open(href, '_blank');
			}
		}, false);

		// The previous click listener is not enough to cover all the cases
		// where the app content is replaced do to the window.location.href navigation.
		// So this piece of code warns the user when the navigation breaks the app.
		// This happens with the youtube videos where the window.location.href is used
		// to navigate to the youtube page.
		window.onbeforeunload = function (e) {
			var message = "This content is going to be loaded in place of the app content. After the page has been loaded navigating back to the app is not going to be possible anymore.",
			e = e || window.event;
			// For IE and Firefox
			if (e) {
			  e.returnValue = message;
			}

			// For Safari
			return message;
		};

		// periodic network checker
		setInterval(MoodleMobApp.app.isConnectionAvailable, 1000);
		MoodleMobApp.app.isContentUpdatedInterval = setInterval(MoodleMobApp.app.isContentUpdated, 1000);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

	isLoadMaskVisible: function() {
		return Ext.Viewport.getActiveItem().getMasked() == null || Ext.Viewport.getActiveItem().getMasked().isHidden();
	},

	showLoadMask: function(msg) {
		Ext.Viewport.getActiveItem().setMasked({
			xtype: 'loadmask',
			message: msg
		});
	},

	updateLoadMaskMessage: function(msg) {
		Ext.Viewport.getActiveItem().getMasked().setMessage(msg);
	},

	hideLoadMask: function() {
		if(Ext.Viewport.getActiveItem().setMasked != undefined) {
			Ext.Viewport.getActiveItem().setMasked(false);
		}
	},

	formatDate: function(timestamp) {
		var date = new Date(timestamp*1000);
		//return date.toLocaleString();
		var curr_day = date.getDate();
		var sup = "";
		if (curr_day == 1 || curr_day == 21 || curr_day ==31) {
		   sup = "st";
		} else if (curr_day == 2 || curr_day == 22) {
		   sup = "nd";
		} else if (curr_day == 3 || curr_day == 23) {
		   sup = "rd";
		} else {
		   sup = "th";
		}
		var curr_month = date.getMonth();
		var curr_year = date.getFullYear();
		var curr_hour = date.getHours();
		if(curr_hour < 10) {
			curr_hour = '0' + curr_hour;
		}
		var curr_min = date.getMinutes();
		if(curr_min < 10) {
			curr_min = '0' + curr_min;
		}
		var formated_date = curr_day + "<sup>" + sup + "</sup> ";
			formated_date+= Ext.Date.monthNames[curr_month] + " " + curr_year + " ";
			formated_date+= curr_hour + ":" + curr_min;
		return formated_date;
	},

	sendEmail: function(to) { },
	sendSms: function(to) { },
	phone: function(num) { },
	startSkype: function(list) { },

	openURL: function(urladdr) {
		console.log('===> Opening URL: '+urladdr);
		return window.open(urladdr, '_blank', 'location=yes,enableViewportScale=yes');
	},

	// this functionality dependes on the platform
	openFile: function(path, mimetype) { },

	// this functionality dependes on the platform
	calculateDownloadPercentage: function(progressEvent) { },

	isConnectionAvailable: function() {
		if (
			navigator.userAgent.match(/(iPhone|iPod|iPad)/) ||
			navigator.userAgent.match(/Android/)
		) { // check connection
			//console.log(':::::::: CONNECTION CHECK :: Connection type: ' + navigator.connection.type);
			if(navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN ) {
				if(!MoodleMobApp.Session.getConnectionAvailabilityWarningIssued()) {
					Ext.Msg.alert(
						'Connection',
						'No connection available. Cannot contact the server.'
					);
					// hide the loading screen if available
					// in order to avoid the loading screen blocking the app
					MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(true);
				}
				MoodleMobApp.app.hideLoadMask();
				return false;
			} else {
				MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(false);
				return true;
			}
		} else { // assume the app runs on the pc browser
			return true;
		}
	},

	isContentUpdated: function() {
		if(MoodleMobApp.Session.getContentUpdateStatus() == false && MoodleMobApp.app.isConnectionAvailable()) {
			// register that the content has been updated in the session
			MoodleMobApp.Session.setContentUpdateStatus(true);
			clearInterval(MoodleMobApp.app.isContentUpdatedInterval);
			MoodleMobApp.app.getController('ManualAccount').attemptAuthentication();
			MoodleMobApp.app.getController('AaiAccount').attemptAuthentication();
		}
	}
});
