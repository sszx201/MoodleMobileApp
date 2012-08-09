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
				initialize: 'loadAccountData'
			},
   			save: {
				tap: 'saveAccountData'
			}	
		}
	},

	loadAccountData: function () {
		var form = this.getForm();	
		var account_store = Ext.data.StoreManager.lookup('aaiaccount_store');
		if(account_store.getCount() > 0) {
			// Update the form with account data.
			form.setRecord( Ext.create('MoodleMobApp.model.AaiAccount', account_store.first().getData()) );
		}
	},

	saveAccountData: function () {
		var form = this.getForm();	
		// store account data
		var account_store = Ext.data.StoreManager.lookup('aaiaccount_store');
		account_store.removeAll();
		account_store.add(form.getValues());
		account_store.sync();

		// set user accounttype setting
		var settings_store = Ext.data.StoreManager.lookup('settings_store'); 
		settings_store.data.first().getData().accounttype = 'aai';
		settings_store.first().setDirty();
		settings_store.sync();

		// Mask the form
		form.setMasked({
			xtype: 'loadmask',
			message: 'Saving...'
		});

		// Put it inside a timeout so it feels like it is going to a server.
		setTimeout(function() {
			// Unmask the formpanel
			form.setMasked(false);
			location.reload();
		}, 1000);
	},

 	// check if the AAI account is the one set
	isActiveAccount: function () {
		var settings_store = Ext.data.StoreManager.lookup('settings_store'); 
		if ( settings_store.data.first().getData().accounttype == 'aai') {
			return true;	
		} else {
			return false;	
		}
	},

	init: function(app) {
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			// create the account store
			var account_store = Ext.data.StoreManager.lookup('aaiaccount_store');

			var parameters = new Object();
			parameters.username = account_store.first().getData().username;
			parameters.password = account_store.first().getData().password;
			parameters.idp = account_store.first().getData().homeorganisation;

			var auth_url = MoodleMobApp.Config.getAaiAuthUrl();

			this.authenticate(auth_url, parameters);
		}
	},
  
});
