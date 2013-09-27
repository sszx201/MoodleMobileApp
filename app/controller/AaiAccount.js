Ext.define('MoodleMobApp.controller.AaiAccount', {
	extend: 'MoodleMobApp.controller.Account',

	config: {
		models: [
			'MoodleMobApp.model.AaiAccount',
		],

		refs: {
			form: '#aaiaccount_form',
			save: '#aaiaccount_form button[action=save]'
		},

		control: {
			form: {
				initialize: 'loadAccountData',
			},
   			save: {
				tap: 'saveAccountData'
			}	
		}
	},

	loadHomeOrganisationValues: function() {
		//var homeOrgField = this.getForm().getItems().getItems().getAt(2);
		var homeOrgField = this.getForm().down('#homeorganisation');
		if(homeOrgField.getStore() == null) {
				var homeorgs_store = Ext.create('MoodleMobApp.store.HomeOrgs');
				// wait for the interface to be shown; fix for the first time the application is loaded
				//setTimeout(function() { MoodleMobApp.app.showLoadMask('Loading Home Organisations.'); }, 200);
				//homeorgs_store.on('load', function(store){ MoodleMobApp.app.hideLoadMask(); }, this, {single: true});
				homeorgs_store.load();
				homeOrgField.setStore(homeorgs_store);
		}
	},

	loadAccountData: function () {
		if(MoodleMobApp.Session.getAaiAccountStore().getCount() > 0) {
			var form = this.getForm();	
			// Update the form with account data.
			form.setRecord( Ext.create('MoodleMobApp.model.AaiAccount', MoodleMobApp.Session.getAaiAccountStore().first().getData()) );
		}
		this.loadHomeOrganisationValues();
	},

	saveAccountData: function () {
		var form = this.getForm();	
		// store account data
		MoodleMobApp.Session.getAaiAccountStore().removeAll();
		MoodleMobApp.Session.getAaiAccountStore().add(form.getValues());
		MoodleMobApp.Session.getAaiAccountStore().sync();

		// set user accounttype setting
		MoodleMobApp.Session.getSettingsStore().first().set('accounttype', 'aai');
		MoodleMobApp.Session.getSettingsStore().sync();

		MoodleMobApp.app.showLoadMask('Saving...');

		// Put it inside a timeout so it feels like it is going to a server.
		setTimeout(function() {
			// Unmask the formpanel
			MoodleMobApp.app.hideLoadMask();
			location.reload();
		}, 1000);
	},

 	// check if the AAI account is the one set
	isActiveAccount: function () {
		if(MoodleMobApp.Session.getSettingsStore().first().get('accounttype') == 'aai') {
			return true;	
		} else {
			return false;	
		}
	},

	init: function(app) {
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			var parameters = new Object();
			parameters.username = MoodleMobApp.Session.getAaiAccountStore().first().get('username');
			parameters.password = MoodleMobApp.Session.getAaiAccountStore().first().get('password');
			parameters.idp = MoodleMobApp.Session.getAaiAccountStore().first().get('homeorganisation');

			var auth_url = MoodleMobApp.Config.getAaiAuthUrl();

			this.authenticate(auth_url, parameters);
		}
	},
  
});
