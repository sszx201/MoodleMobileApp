Ext.define('MoodleMobApp.controller.ManualAccount', {
	extend: 'MoodleMobApp.controller.Account',

	requires: [
		'MoodleMobApp.model.ManualAccount',
	],
   	
	config: {
		refs: {
			form: '#manualaccount_form',
			save: '#manualaccount_form button[action=save]'
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
		var account_store = Ext.data.StoreManager.lookup('manualaccount_store');
		if(account_store.getCount() > 0) {
			// Update the form with account data.
			form.setRecord( Ext.create('MoodleMobApp.model.ManualAccount', account_store.first().getData()) );
		}
	},

	saveAccountData: function () {
		var form = this.getForm();	
		// store account data
		var account_store = Ext.data.StoreManager.lookup('manualaccount_store');
		account_store.removeAll();
		account_store.add(form.getValues());
		account_store.sync();

		// set user accounttype setting
		var settings_store = Ext.data.StoreManager.lookup('settings_store'); 
		settings_store.data.first().set('accounttype', 'manual');
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

	// check if the Manual account is the one set
	isActiveAccount: function () {
		var settings_store = Ext.data.StoreManager.lookup('settings_store');
		if(settings_store.data.first().get('accounttype') == 'manual') {
			return true;	
		} else {
			return false;	
		}
	},

	init: function(app) {
		// if the account is the active one
		// authenticate and get the course data
		if(this.isActiveAccount()) {
			var account_store = Ext.data.StoreManager.lookup('manualaccount_store');

			var parameters = new Object();
			parameters.username = account_store.first().get('username');
			parameters.password = account_store.first().get('password');

			var auth_url = MoodleMobApp.Config.getManualAuthUrl();

			this.authenticate(auth_url, parameters);
		}
	},

});
