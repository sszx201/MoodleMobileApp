Ext.define('MoodleMobApp.controller.AaiAccount', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.User',
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

	init: function() {
		MoodleMobApp.Session.setAaiController(this);
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

		window.cookies.clear(function() {
			console.log('Cookies cleared!');
		});

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
		if( this.isActiveAccount() ) {
			// init the jsessionId Check; this is used to check the authentication failures
			this.jsessionIdInitialized = false;

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

			// if the account is the active one
			// authenticate and get the course data
			if(MoodleMobApp.app.isConnectionAvailable()) {
				MoodleMobApp.app.showLoadMask('Authenticating...');
				//this.subwindow = window.open(MoodleMobApp.Config.getMoodleUrl(), '_blank', 'hidden=no');
				//this.subwindow.addEventListener('loadstop', this.getMoodleCookie);
				this.subwindow = window.open(MoodleMobApp.Config.getAaiAuthUrl(), '_blank', 'hidden=yes');
				//this.subwindow.addEventListener('loadstop', this.getToWAYFform);
				this.subwindow.addEventListener('loadstop', this.getToAuthenticationForm);
				this.subwindow.addEventListener('loadstop', this.checkAuthentication);
			}
		}
	},

	getMoodleCookie: function() {
		console.log(':: getting moodle cookie ::');
		MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().getMoodleCookie);
		MoodleMobApp.Session.getAaiController().subwindow.executeScript({
            code: "document.cookie;"
        }, function(val) {
			if(val != undefined && typeof val == "object" && val.length > 0) {
				document.cookie = val[0];
				if(MoodleMobApp.Session.getAaiAccountStore().first().get('moodlecookie') == val[0]) {
					console.log('user is authenticated, no need to store the cookie');
				} else {
					console.log('user is not authenticated, store the cookie and authenticate');
					MoodleMobApp.Session.getAaiAccountStore().first().set('moodlecookie', val[0]);
					MoodleMobApp.Session.getAaiAccountStore().sync();
					MoodleMobApp.Session.getAaiController().getToWAYFform();
				}
				console.log('output value');
				console.log(val);
				console.log('user data');
				console.log(MoodleMobApp.Session.getAaiAccountStore().first().getData());
			} else {
				Ext.Msg.alert(
					'AAI Error',
					'The moodle cookie has not been set.'
				);
				console.log('The moodle cookie has not been set.');
			}
        });
	},

	checkAuthentication: function() {
		MoodleMobApp.Session.getAaiController().subwindow.executeScript({
            code: "var cobject = {cookie: document.cookie, location: document.location.href}; cobject;"
        }, function(val) {
			if(val != undefined && typeof val == "object" && val.length > 0) {
				console.log('===> Authentication check');
				console.log(val);

				var clearListeners = function() {
					// clear all listeners
					MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().checkAuthentication);
					MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().getToAuthenticationForm);
					MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().submitAuthenticationForm);
				};
				if(val[0].cookie.indexOf('MoodleSession') != -1 && val[0].location.indexOf(MoodleMobApp.Config.getMoodleUrl()) == 0) {
					MoodleMobApp.app.hideLoadMask();
					MoodleMobApp.Session.getAaiAccountStore().first().set('moodlecookie', val[0].cookie);
					MoodleMobApp.Session.getAaiAccountStore().sync();
					console.log('User has been authenticated!!! yaaay');
					clearListeners();
					MoodleMobApp.Session.getAaiController().getUpdates();
				}

				// JSESSIONID check
				// this check is usefull to isolate the incorrect password or username case
				if( val[0].cookie.indexOf('JSESSIONID') == 0 ) {
					if(MoodleMobApp.Session.getAaiController().jsessionIdInitialized) {
						MoodleMobApp.app.hideLoadMask();
						clearListeners();
						Ext.Msg.alert('Authentication Error', 'Authentication failed. Please check your username and password.');
						// prompt the user data form so the user can insert the correct username and password
						MoodleMobApp.app.getController('CourseNavigator').showSettings();
					} else {
						MoodleMobApp.Session.getAaiController().jsessionIdInitialized = true;
					}
				}


			} else {
				Ext.Msg.alert(
					'AAI Error',
					'Authentication check mechanism failed. No output value.'
				);
			}
        });
	},

	getToWAYFform: function() {
		console.log(':: getting to the WAYF form ::');
		//MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().getMoodleCookie);
		MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().getToWAYFform);
		MoodleMobApp.Session.getAaiController().subwindow.addEventListener('loadstop', MoodleMobApp.Session.getAaiController().getToAuthenticationForm);
		MoodleMobApp.Session.getAaiController().subwindow.executeScript({
            code: "window.location.href = '" + MoodleMobApp.Config.getAaiAuthUrl() + "'"
        }, function(val) {
			if(val != undefined && typeof val == "object" && val.length > 0) {
				console.log('output value');
				console.log(val);
			} else {
				Ext.Msg.alert(
					'AAI Error',
					'Getting to the WAYF page failed.'
				);
			}
        });
	},

	getToAuthenticationForm: function() {
		console.log(':: getting to the authentication form ::');
		MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().getToAuthenticationForm);
		MoodleMobApp.Session.getAaiController().subwindow.addEventListener('loadstop', MoodleMobApp.Session.getAaiController().submitAuthenticationForm);
		var idp = MoodleMobApp.Session.getAaiAccountStore().first().get('homeorganisation');
		MoodleMobApp.Session.getAaiController().subwindow.executeScript({
            code: "document.querySelectorAll('[value=\""+idp+"\"]')[0].setAttribute('selected', 'selected'); document.getElementsByTagName('select')[0].setAttribute('value', '" + idp + "'); document.getElementsByTagName('form')[0].submit(); document.cookie;"
        }, function(val) {
			if(val != undefined && typeof val == "object" && val.length > 0) {
				console.log('output value');
				console.log(val);
			} else {
				Ext.Msg.alert(
					'AAI Error',
					'Getting to the authentication page failed.'
				);
			}
        });
	},

	submitAuthenticationForm: function() {
		console.log(':: authenticating ::');
		MoodleMobApp.Session.getAaiController().subwindow.removeEventListener('loadstop', MoodleMobApp.Session.getAaiController().submitAuthenticationForm);
		var username = MoodleMobApp.Session.getAaiAccountStore().first().get('username');
		var password = MoodleMobApp.Session.getAaiAccountStore().first().get('password');
		MoodleMobApp.Session.getAaiController().subwindow.executeScript({
            code: "document.getElementsByTagName('input')[0].setAttribute('value', '" + username + "'); document.getElementsByTagName('input')[1].setAttribute('value', '" + password + "'); document.querySelectorAll('[type=\"submit\"]')[0].click(); document.cookie;"
        }, function(val) {
			if(val != undefined && typeof val == "object" && val.length > 0) {
				console.log('output value');
				console.log(val);
			} else {
				Ext.Msg.alert(
					'AAI Error',
					'Submitting the user authentication data failed.'
				);
			}
        });
	},

	getUpdates: function() {
		//MoodleMobApp.app.showLoadMask('Getting course tokens...');
		Ext.Ajax.request({
				url: MoodleMobApp.Config.getUpdatesUrl(),
				disableCaching: false,
				method: 'GET',
				scope: MoodleMobApp.Session.getAaiController(),
				success: function(response, opts) {
					//MoodleMobApp.app.hideLoadMask();
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
});
