Ext.define('MoodleMobApp.controller.CourseNavigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.ModuleList',
		],

		views: [
			'MoodleMobApp.view.ModuleList',
		],

		refs: {
			navigator: '#course_navigator',
			course: '#course_list',
		},

		control: {
			course: { select: 'selectCourse' },
		}
	},

	selectCourse: function (view, record) {
		var course_data = record.getData();
		// set the course token
		MoodleMobApp.Session.setCourseToken(course_data.token);
		// request course modules
		var course_modules_store = MoodleMobApp.WebService.getCourseModules(course_data);
		// display modules
		this.getNavigator().push({
			xtype: 'modulelist',	
			store: course_modules_store
		});
		
		var course_users_store = MoodleMobApp.WebService.getEnrolledUsers(course_data.id);
		// hook up the user releated stores
		var enrolled_users_store = Ext.data.StoreManager.lookup('enrolledusers');
		var users_store = Ext.data.StoreManager.lookup('users');

		// store the enrolled users
		course_users_store.addListener('load', function() {
			if(this.data.getCount() > 0){
				// update the list of enrolled users for the current course
				var course_group = enrolled_users_store.getGroups(course_data.id.toString());
				if(typeof course_group == 'object') {
					enrolled_users_store.remove(course_group.children);
				}
				this.each(function(record){
					enrolled_users_store.add({'courseid': course_data.id, 'userid': record.getData().id});
					// if this user is not in the store add it 
					// else 
					// if a previous entry of this user exists and has been modified
					// then updated it by removing the previous entry otherwise skip the record
					var current_user = users_store.getById(record.getData().id);
					if(current_user == null){
						record.setDirty();
						users_store.add(record);
					} else if(typeof current_user == 'object' && current_user.getData().timemodified != record.getData().timemodified){
						users_store.remove(record);
						users_store.sync();
						record.setDirty();
						users_store.add(record);
					}
				});
				enrolled_users_store.sync();
				users_store.sync();
			}
		})
	},

});
