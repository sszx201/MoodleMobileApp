Ext.define('MoodleMobApp.controller.ManualAccount', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.User',
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

		window.cookies.clear(function() {
			console.log('Cookies cleared!');
		});

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
	},

	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These info are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function(auth_url, parameters) {
		// show the course navigator
		var courseNavigatorShown = false;
		Ext.Viewport.getItems().each(function(item){
			if(item.xtype == 'coursenavigator') {
				Ext.Viewport.setActiveItem(item);
				courseNavigatorShown = true;
			}
		});

		if(!courseNavigatorShown) {
			var courseNavigator = Ext.create('MoodleMobApp.view.CourseNavigator');
			// ios 7 bar fix
			if( window.device != undefined && parseInt(window.device.version) > 6 ) {
				courseNavigator.setStyle('margin-top: 20px;');
			}
			Ext.Viewport.add(courseNavigator);
			Ext.Viewport.setActiveItem(courseNavigator);
		}

		// proceed if the connection is available
		if(MoodleMobApp.app.isConnectionAvailable()) {
			MoodleMobApp.app.showLoadMask('Authenticating...');

			Ext.Ajax.request({
				url: auth_url,
				disableCaching: false,
				method: 'POST',
				scope: this,
				params: parameters,
				success: function(response, opts) {
					MoodleMobApp.app.hideLoadMask();
					var data = Ext.decode(response.responseText);
					if(data.exception == undefined) {
						// store the username in the Session
						MoodleMobApp.Session.setUser(Ext.create('MoodleMobApp.model.User', data.user));

						// remove old entries
						MoodleMobApp.Session.getCoursesStore().removeAll();
						MoodleMobApp.Session.getCoursesStore().getProxy().clear();

						// add the new entries
						for(var id in data.courses) {
							data.courses[id].modulestatus = '<img src="resources/images/sync.png" />';
							MoodleMobApp.Session.getCoursesStore().add(data.courses[id]);
						}
						// store data
						MoodleMobApp.Session.getCoursesStore().sync();
					} else {
						Ext.Msg.alert(
							'Exception: ' + data.exception,
							'Error: ' + data.message,
							function() {
								MoodleMobApp.app.getController('CourseNavigator').showSettings();
							}
						);
					}
				},
				failure: function(response, opts) {
					MoodleMobApp.app.hideLoadMask();
					Ext.Msg.alert(
						'Authentication request failed',
						'Response status: ' + response.status,
						function() {
							MoodleMobApp.app.getController('CourseNavigator').showSettings();
						}
					);
				}
			});
		}
	}
});
