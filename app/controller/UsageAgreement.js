Ext.define('MoodleMobApp.controller.UsageAgreement', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			agree: 'usageagreement button[action=agree]',
			disagree: 'usageagreement button[action=disagree]'
		},
		control: {
		   agree:  {
				tap: 'registerAgreement'
		   },
		   disagree: {
		   		tap: 'registerDisagreement'
		  }
		}
	},

	registerAgreement: function() {
		MoodleMobApp.Session.getSettingsStore().load();
		MoodleMobApp.Session.getSettingsStore().first().set('usageagreement', true);
		MoodleMobApp.Session.getSettingsStore().sync();
		//location.reload();
		Ext.Viewport.removeAt(0);
		var settings = Ext.create('MoodleMobApp.view.Settings') 
		if( window.device != undefined && parseInt(window.device.version) > 6 ) {
			settings.setStyle('margin-top: 20px;');
		}
		Ext.Viewport.add(settings);
	},

	registerDisagreement: function() {
		Ext.Msg.confirm(
			'Exit',
			'Would you like to close the app?',
			function(btn) {
				if(btn == 'yes') {
					navigator.app.exitApp();
				}
			}
		);
	}
	
});
