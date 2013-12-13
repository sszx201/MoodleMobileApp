Ext.define('MoodleMobApp.controller.Account', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.Course',
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
		
		var url_encoded_params = '?';
		Ext.iterate(parameters, function(key, value){
			url_encoded_params += key+'='+value+'&';	
		});
		// remove the last & char
		url_encoded_params = url_encoded_params.slice(0,-1);

		var store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.Course',
			proxy: {
				type: 'ajax',
				url : auth_url+url_encoded_params, 
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
				// check if there are any exceptions 
				if(this.first() == undefined){
					Ext.Msg.alert(
						'Authentication Failed',
						'The Authentication has failed. Please check your user data.'
					);
				} else if( this.first().raw.exception == undefined) {
					// store the username in the Session
					MoodleMobApp.Session.setUsername(parameters.username);

					var courses_number = MoodleMobApp.Session.getCoursesStore().getCount();

					if(courses_number == 0) {
						this.each(function(course) {
								course.set('isnew', true);
								MoodleMobApp.Session.getCoursesStore().add(course);
						});
					} else {
						this.each(function(course) {
								//course.set('modulestatus', 'unsync');
								course.set('modulestatus', '<img src="resources/images/sync.png" />');
								if(MoodleMobApp.Session.getCoursesStore().find('id', course.get('id')) == -1) {
									course.set('isnew', true);
								} else {
									course.set('isnew', false);
								}
						});
						
						// remove old entries
						MoodleMobApp.Session.getCoursesStore().removeAll();
						MoodleMobApp.Session.getCoursesStore().getProxy().clear();

						this.each(function(course) {
							course.setDirty();
							MoodleMobApp.Session.getCoursesStore().add(course);
						});
					}

					// store data
					MoodleMobApp.Session.getCoursesStore().sync();
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			},
			'',
			{single: true}
		);

		store.load(); 
	},
});
