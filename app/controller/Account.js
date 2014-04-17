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
		var store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.Profile',
			proxy: {
				type: 'ajax',
				actionMethods: { read : 'POST' },
				url: auth_url,
				extraParams: parameters,
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				reader: {
					type: 'json'
				}
			}
		});
		store.on('load',
			function(store, records, success) {
				if( this.first().get('user') != undefined) {
					// store the username in the Session
					MoodleMobApp.Session.setUser(Ext.create('MoodleMobApp.model.User', this.first().get('user')));

					// remove old entries
					MoodleMobApp.Session.getCoursesStore().removeAll();
					MoodleMobApp.Session.getCoursesStore().getProxy().clear();

					var courses = this.first().get('courses');
					// add the new entries
					for(var id in courses) {
						courses[id].modulestatus = '<img src="resources/images/sync.png" />';
						MoodleMobApp.Session.getCoursesStore().add(courses[id]);
					}
					// store data
					MoodleMobApp.Session.getCoursesStore().sync();
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message,
						function() {
							MoodleMobApp.app.getController('CourseNavigator').showSettings();
						}
					);
				}
			},
			'',
			{single: true}
		);

		store.load(); 
	}
});
