Ext.define('MoodleMobApp.controller.ManualAccount', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.ManualAccount',
		'MoodleMobApp.store.ManualAccount',
		'MoodleMobApp.model.Course',
		'MoodleMobApp.store.Courses',
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
		settings_store.data.first().getData().accounttype = 'manual';
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
		if ( settings_store.data.first().getData().accounttype == 'manual') {
			return true;	
		} else {
			return false;	
		}
	},

	init: function(app) {
		// create the account store
		var account_store = Ext.create('MoodleMobApp.store.ManualAccount'); 
		account_store.load();
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			this.authenticate(function(){ console.log('Manual authentication completed; Course list refreshed;'); });
		}
	},

	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These data are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function(successCallbackFunction) {
		var account_store = Ext.data.StoreManager.lookup('manualaccount_store');
		var username = account_store.first().getData().username;
		var password = account_store.first().getData().password;
		var auth_url = MoodleMobApp.Config.getManualAuthUrl();
			auth_url+= '?username='+username;
			auth_url+= '&password='+password;

		var store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.Course',
			proxy: {
				type: 'ajax',
				url : auth_url, 
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				reader: {
					type: 'json'
				}
			}
		});

		store.load({
			callback: function(records, operation, success) {
				// check if there are any exceptions 
				if(this.first() == undefined){
					Ext.Msg.alert(
						'Manual Authentication Failed',
						'The manual Authentication has failed.'
					);
				} else if( this.first().raw.exception == undefined) {
					// store the username in the Session
					MoodleMobApp.Session.setUsername(username);
					// process courses
					var courses_store = Ext.data.StoreManager.lookup('courses');
					// purge old content
					courses_store.removeAll();
					// add all new courses
					this.each(
						function(item) {
							courses_store.add( item.getData() );
						}
					);

					// prepare to write
					courses_store.each(
						function() { 
							this.setDirty();
						}
					);

					// call the successCallbackFunction when data have been written
					courses_store.addListener('write', successCallbackFunction);
					// store data
					courses_store.sync();
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			}
		});
	}
	
});
