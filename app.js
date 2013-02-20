//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'MoodleMobApp': 'app'
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
		'MoodleMobApp.WebService',
		'MoodleMobApp.store.HomeOrgs',
    ],

	models: [
		"MoodleMobApp.model.Settings",
		"MoodleMobApp.model.AaiAccount",
		"MoodleMobApp.model.ManualAccount",
	],

	views: [
		'MoodleMobApp.view.UsageAgreement',
		'MoodleMobApp.view.AccountChoice',
		'MoodleMobApp.view.Main',
		'MoodleMobApp.view.Course',
		'MoodleMobApp.view.CourseList',
		'MoodleMobApp.view.Shell',
	],

	controllers: [
		'MoodleMobApp.controller.Init',
		'MoodleMobApp.controller.Main',
		'MoodleMobApp.controller.UsageAgreement', 
		'MoodleMobApp.controller.User', 
		'MoodleMobApp.controller.AccountChoice', 
		'MoodleMobApp.controller.Account',
		'MoodleMobApp.controller.AaiAccount',
		'MoodleMobApp.controller.ManualAccount',
		'MoodleMobApp.controller.CourseNavigator',
		'MoodleMobApp.controller.Assignment',
		'MoodleMobApp.controller.Forum',
		'MoodleMobApp.controller.Folder',
		'MoodleMobApp.controller.Resource',
		'MoodleMobApp.controller.Choice',
		'MoodleMobApp.controller.Url',
		'MoodleMobApp.controller.Shell',
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
        // Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingIndicator').destroy();

		if( MoodleMobApp.Session.getSettingsStore().first().getData().usageagreement == false ) {
			Ext.Viewport.add( Ext.create('MoodleMobApp.view.UsageAgreement') );
		} else if( MoodleMobApp.Session.getSettingsStore().first().getData().accounttype == '' ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.AccountChoice'));
		} else {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.Main'));
		}
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

	openFile: function(path, mimetype){
		var protocol = 'file:///';
		var store = 'sdcard'
		window.plugins.webintent.startActivity(
			{
				action: WebIntent.ACTION_VIEW,
				type: mimetype,
				url: protocol+store+path,
  			}, 
			function () {}, 
			function () {
				Ext.Msg.alert('File Error', 'Failed to open:'+path+' via Android Intent');
  			});
	},


	// file is an object such as:
	// {"name": "filename", "id": "file id number", "mime":"mime/type"}
	getFile: function(file) {
		this.showLoadMask('');

		// success function
		var successFunc = function(result) {
			// download mask code
			if(result.progress < 100){ // update the progress
				MoodleMobApp.app.updateLoadMaskMessage(result.progress+' %');
			} else { // remove the mask
				MoodleMobApp.app.hideLoadMask();
			}

			if(result.progress == 100 && result.status == 1) {
				var filePath = '/'+MoodleMobApp.Config.getFileCacheDir()+'/'+file.name;
				MoodleMobApp.app.openFile(filePath, file.mime);
			}

			if(MoodleMobApp.Config.getVerbose()) {
				console.log(JSON.stringify(result));
			}
		};

		// fail function
		var failFunc = function(){
			Ext.Msg.alert(
				'File download error',
				'Failed to download the file: ' + file.name
			);
		};

		MoodleMobApp.WebService.getFile(
			file,
			MoodleMobApp.Config.getFileCacheDir(),
			successFunc, 
			failFunc,
			MoodleMobApp.Session.getCourse().get('token')
		);
	},

	openURL: function(urladdr){

		if(MoodleMobApp.Config.getVerbose()) {
			console.log('===> Opening URL: '+urladdr);
		}

		window.plugins.webintent.startActivity(
			{
				action: WebIntent.ACTION_VIEW,
				url: urladdr,
  			}, 
			function () {}, 
			function () {
				Ext.Msg.alert('URL Error', 'Failed to open:'+path+' via Android Intent');
  			});
	},

	sendEmail: function(to, subject, body) {
		var extras = {};
		extras[WebIntent.EXTRA_SUBJECT] = subject;
		extras[WebIntent.EXTRA_TEXT] = body;
		var successFunc = function() {};
		// fail function
		var failFunc = function(){
			Ext.Msg.alert(
				'Sending e-mail error',
				'Failed to open the mail client and send a mail to: ' + to
			);
		};

		window.plugins.webintent.startActivity(
			{
				url: to,
				action: WebIntent.ACTION_SEND,
				type: 'text/plain',
				extras: extras
			},
			successFunc,
			failFunc
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
		Ext.Viewport.getActiveItem().setMasked(false);
	}

});
