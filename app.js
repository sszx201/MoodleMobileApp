Ext.application({

	name: 'MoodleMobApp',

	requires: [
		'MoodleMobApp.Config',
		'MoodleMobApp.WebService',
		'Ext.MessageBox',
		'Ext.TitleBar',
		'Ext.data.identifier.Uuid',
		'MoodleMobApp.store.account.HomeOrgs',
		'MoodleMobApp.store.course.Courses',
		'MoodleMobApp.store.course.EnrolledUsers',
		'MoodleMobApp.store.Users',
	],

	models: [
		"MoodleMobApp.model.Settings",
	],

	stores: [
		'MoodleMobApp.store.Settings',
	],
	
	views: [
		'MoodleMobApp.view.UsageAgreement',
		'MoodleMobApp.view.account.Choice',
		'MoodleMobApp.view.Main',
		'MoodleMobApp.view.course.ModuleList',
	],

	controllers: [
		"MoodleMobApp.controller.Init", 
		"MoodleMobApp.controller.Main",
		"MoodleMobApp.controller.UsageAgreement", 
		"MoodleMobApp.controller.account.Choice", 
		'MoodleMobApp.controller.account.Aai',
		'MoodleMobApp.controller.account.Manual',
		'MoodleMobApp.controller.course.Navigator',
	],

	icon: {
		57: 'resources/icons/Icon.png',
		72: 'resources/icons/Icon~ipad.png',
		114: 'resources/icons/Icon@2x.png',
		144: 'resources/icons/Icon~ipad@2x.png'
	},

	phoneStartupScreen: 'resources/loading/Homescreen.jpg',
	tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

	launch: function() {
		// hook up stores
		var settings_store = Ext.data.StoreManager.lookup('settings_store');

		// Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingIndicator').destroy();

		if( settings_store.first().getData().usageagreement == false ) {
			Ext.Viewport.add( Ext.create('MoodleMobApp.view.UsageAgreement') );
		} else if( settings_store.first().getData().accounttype == '' ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.account.Choice'));
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
	}
});
