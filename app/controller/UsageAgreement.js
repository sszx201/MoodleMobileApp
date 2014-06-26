Ext.define('MoodleMobApp.controller.UsageAgreement', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			usageAgreement: 'usageagreement',
			agree: 'usageagreement button[action=agree]',
			disagree: 'usageagreement button[action=disagree]'
		},
		control: {
		   usageAgreement:  {
				show: 'initUsageAgreement'
		   },
		   agree:  {
				tap: 'registerAgreement'
		   },
		   disagree: {
		   		tap: 'registerDisagreement'
		  }
		}
	},

	initUsageAgreement: function() {
		if( window.device != undefined && parseInt(window.device.version) > 6 ) {
			this.getUsageAgreement().setStyle('margin-top: 20px;');
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
