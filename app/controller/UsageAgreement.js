Ext.define('MoodleMobApp.controller.UsageAgreement', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			agree: '#usageagreement_panel button[action=agree]',
			disagree: '#usageagreement_panel button[action=disagree]'
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
		location.reload();
	},

	registerDisagreement: function() {
		console.log('user disagreed');
	}
	
});
