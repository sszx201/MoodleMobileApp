Ext.define('MoodleMobApp.controller.ManualAccount', {
	extend: 'MoodleMobApp.controller.Account',

	requires: [
		'MoodleMobApp.model.ManualAccount'
	],
   	
	config: {
		refs: {
			navigator: 'coursenavigator',
			form: 'manualaccount',
			save: 'manualaccount button[action=save]'
		},

		control: {
			form: {
				initialize: 'loadAccountData'
			},
   			save: {
				tap: 'saveAccountData'
			}	
		}
	},

	loadAccountData: function () {
		var form = this.getForm();	
		if(MoodleMobApp.Session.getManualAccountStore().getCount() > 0) {
			// Update the form with account data.
			form.setRecord( Ext.create('MoodleMobApp.model.ManualAccount', MoodleMobApp.Session.getManualAccountStore().first().getData()) );
		}
	},

	saveAccountData: function () {
		var form = this.getForm();	
		// store account data
		MoodleMobApp.Session.getManualAccountStore().removeAll();
		MoodleMobApp.Session.getManualAccountStore().add(form.getValues());
		MoodleMobApp.Session.getManualAccountStore().sync();

		// set user accounttype setting
		MoodleMobApp.Session.getSettingsStore().data.first().set('accounttype', 'manual');
		MoodleMobApp.Session.getSettingsStore().first().setDirty();
		MoodleMobApp.Session.getSettingsStore().sync();

		if(typeof this.getNavigator() == 'object') {
			this.getNavigator().pop();
		}
		// authenticate
		this.attemptAuthentication();
	},

	// check if the Manual account is the one set
	isActiveAccount: function () {
		if(MoodleMobApp.Session.getSettingsStore().data.first().get('accounttype') == 'manual') {
			return true;	
		} else {
			return false;	
		}
	},

	attemptAuthentication: function() {
		// if the account is the active one
		// authenticate and get the course data
		if(this.isActiveAccount()) {
			var parameters = {
				username: MoodleMobApp.Session.getManualAccountStore().first().get('username'),
				password: MoodleMobApp.Session.getManualAccountStore().first().get('password')
			};
			var auth_url = MoodleMobApp.Config.getManualAuthUrl();

			this.authenticate(auth_url, parameters);
		}
	}
});
