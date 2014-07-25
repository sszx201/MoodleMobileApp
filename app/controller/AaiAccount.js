Ext.define('MoodleMobApp.controller.AaiAccount', {
	extend: 'MoodleMobApp.controller.Account',

	config: {
		models: [
			'MoodleMobApp.model.AaiAccount'
		],

		refs: {
			navigator: 'coursenavigator',
			form: 'aaiaccount',
			save: 'aaiaccount button[action=save]'
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

	loadHomeOrganisationValues: function() {
		//var homeOrgField = this.getForm().getItems().getItems().getAt(2);
		var homeOrgField = this.getForm().down('#homeorganisation');
		if(homeOrgField.getStore() == null) {
				var homeorgs_store = Ext.create('MoodleMobApp.store.HomeOrgs');
				homeorgs_store.getProxy().setUrl(MoodleMobApp.Config.getHomeOrgsUrl());
				// wait for the interface to be shown; fix for the first time the application is loaded
				setTimeout(function() {
					if(homeorgs_store.getCount() == 0) {
						MoodleMobApp.app.showLoadMask('Loading Home Organisations.');
					}
				}, 200);
				homeorgs_store.on('load', function(store){
					MoodleMobApp.app.hideLoadMask();
					homeOrgField.setStore(store);
					this.selectHomeOrganisation();
				},
				this,
				{single: true});
				// ask for home organisations list
				homeorgs_store.load();
		} else {
			this.selectHomeOrganisation();
		}
	},

	selectHomeOrganisation: function () {
		var homeOrgField = this.getForm().down('#homeorganisation');
		if(MoodleMobApp.Session.getAaiAccountStore() == null || MoodleMobApp.Session.getAaiAccountStore().getCount() == 0) {
			homeOrgField.setValue(MoodleMobApp.Config.getDefaultIDP());
		} else {
			homeOrgField.setValue(MoodleMobApp.Session.getAaiAccountStore().first().get('homeorganisation'));
		}
	},

	loadAccountData: function () {
		if(MoodleMobApp.Session.getAaiAccountStore().getCount() > 0) {
			var form = this.getForm();	
			// Update the form with account data.
			form.setRecord( Ext.create('MoodleMobApp.model.AaiAccount', MoodleMobApp.Session.getAaiAccountStore().first().getData()) );
		}
		// proceed if the connection is available
		if(MoodleMobApp.app.isConnectionAvailable()) {
			this.loadHomeOrganisationValues();
		}
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

		if(typeof this.getNavigator() == 'object') {
			this.getNavigator().pop();
		}

		// authenticate
		this.attemptAuthentication();
	},

 	// check if the AAI account is the one set
	isActiveAccount: function () {
		if(MoodleMobApp.Session.getSettingsStore().first().get('accounttype') == 'aai') {
			return true;	
		} else {
			return false;	
		}
	},

	attemptAuthentication: function() {
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			var parameters = {
				username: MoodleMobApp.Session.getAaiAccountStore().first().get('username'),
				password: MoodleMobApp.Session.getAaiAccountStore().first().get('password'),
				idp: MoodleMobApp.Session.getAaiAccountStore().first().get('homeorganisation')
			};
			var auth_url = MoodleMobApp.Config.getAaiAuthUrl();

			this.authenticate(auth_url, parameters);
		}
	}
  
});
