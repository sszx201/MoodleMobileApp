Ext.define('MoodleMobApp.controller.AaiAccount', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AaiAccount',
		],

		stores: [
			'MoodleMobApp.store.AaiAccount',
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
		// create the account store
		var account_store = Ext.create('MoodleMobApp.store.AaiAccount'); 
		account_store.load();
		// if the account is the active one
		// authenticate and get the course data
		if( this.isActiveAccount() ) {
			// create the account store
			this.authenticate(function(){ console.log('Aai authentication completed; Course list refreshed;'); });
		}
	},

	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These data are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function(successCallbackFunction) {
		// hook up the account store
		var account_store = Ext.data.StoreManager.lookup('aaiaccount_store');
		var auth_url = MoodleMobApp.Config.getAaiAuthUrl();
			auth_url+= '?username='+account_store.first().getData().username;
			auth_url+= '&password='+account_store.first().getData().password;
			auth_url+= '&idp='+account_store.first().getData().homeorganisation;
		var store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.course.Course',
			proxy: {
				type: 'ajax',
				url : auth_url, 
				reader: {
					type: 'json'
				}
			}
		});

		store.load({
			callback: function(records, operation, success) {
				// check if there are any exceptions 
				if( this.first().raw.exception == undefined) {
					// hook up the courses store
					var courses_store = Ext.data.StoreManager.lookup('courses');
					// add all new courses
					this.each(
						function(item) {
							var itemData = item.getData();
							// check the modification time
							if( courses_store.getById(itemData.id).getData().timemodified != itemData.timemodified ) {
								console.log('course id: ' + itemData.id + ' has been modified');	
								itemData.notify_modification = true;
							}
							courses_store.add( itemData );
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
					// write
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
