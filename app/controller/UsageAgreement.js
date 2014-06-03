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
		Ext.Viewport.add(Ext.create('MoodleMobApp.view.Settings'));
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
