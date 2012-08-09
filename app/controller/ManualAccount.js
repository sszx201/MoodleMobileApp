Ext.define('MoodleMobApp.controller.ManualAccount', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.ManualAccount',
		'MoodleMobApp.model.Course',
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
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			this.authenticate();
		}
	},

	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These data are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function() {
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

					// remove courses the user is not enrolled in anymore
					courses_store.each(
						function(entry) {
							// refering as store because this has changed
							if(this.getById(entry.getData().id) === null) {
								courses_store.remove( entry );
							}
						}, this
					);

					// update local courses store
					this.each(
						function(entry) {
							if(courses_store.getById(entry.getData().id) === null) {
								courses_store.add( entry.getData() );
							} else {
								courses_store.getById(entry.getData().id).setData(entry.getData());
							}
						}
					);

					// prepare to write
					courses_store.each(
						function() { 
							this.setDirty();
						}
					);

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
	},

});
