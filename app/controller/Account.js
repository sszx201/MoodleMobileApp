Ext.define('MoodleMobApp.controller.Account', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.Course'
	],
   	
	config: {
		refs: {
		},

		control: {
		}
	},

	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These info are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function(auth_url, parameters) {
		Ext.Ajax.request({
			url: auth_url,
			disableCaching: false,
			method: 'POST',
			scope: this,
			params: parameters,
			success: function(response, opts) {
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
					});
				}
			},
			failure: function(response, opts) {
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
