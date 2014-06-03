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
			Ext.Viewport.add(courseNavigator);
			Ext.Viewport.setActiveItem(courseNavigator);
		}

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
});
