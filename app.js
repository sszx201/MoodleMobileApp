Ext.application({
    models: ["Settings"],

    name: 'MoodleMobApp',

    requires: [
        'Ext.MessageBox',
		'Ext.data.identifier.Uuid'
    ],
	
    views: [
		'MoodleMobApp.view.Main',
        'MoodleMobApp.view.account.Aai',
        'MoodleMobApp.view.account.Manual',
        'MoodleMobApp.view.account.Choice'
	],

    controllers: [
		"MoodleMobApp.controller.Main",
		"MoodleMobApp.controller.account.Choice", 
		"MoodleMobApp.controller.UsageAgreement", 
		"MoodleMobApp.controller.Settings", 
		'MoodleMobApp.controller.account.Aai',
		'MoodleMobApp.controller.account.Manual'
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
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
		var settings_store = Ext.create('MoodleMobApp.store.Settings');
		settings_store.load();

		if( settings_store.first().getData().usageagreement == false ) {
        	Ext.Viewport.add( Ext.create('MoodleMobApp.view.UsageAgreement') );
		} else if( settings_store.first().getData().accounttype == '' ) {
        	Ext.Viewport.add(Ext.create('MoodleMobApp.view.account.Choice'));
		} else {
        	Ext.Viewport.add(Ext.create('MoodleMobApp.view.Main'));
		}

        // Initialize the main view
		//var aai_account_form = Ext.create('MoodleMobApp.view.account.Aai');
        //Ext.Viewport.add( aai_account_form );
		//var manual_account_form = Ext.create('MoodleMobApp.view.account.Manual');
        //Ext.Viewport.add( manual_account_form );
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
