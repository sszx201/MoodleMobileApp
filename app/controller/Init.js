Ext.define('MoodleMobApp.controller.Init', {
	extend: 'Ext.app.Controller',
	
	config: {
		models: [
			'MoodleMobApp.model.Settings',
		],

		stores: [
			'MoodleMobApp.store.Settings',
			'MoodleMobApp.store.ManualAccount',
			'MoodleMobApp.store.AaiAccount',
			'MoodleMobApp.store.Users',
			'MoodleMobApp.store.EnrolledUsers',
			'MoodleMobApp.store.Courses',
			'MoodleMobApp.store.Modules',
			'MoodleMobApp.store.ForumDiscussions',
			'MoodleMobApp.store.ForumPosts',
			'MoodleMobApp.store.OnlineAssignmentSubmissions',
		],
		refs: {
			
		},
		control: {
			
		}
	},
	
	init: function() {
		// create settings store
		var settings_store = Ext.create('MoodleMobApp.store.Settings');
		settings_store.load({
			callback: function(records, operation, success) {
				if( records.length == 0 ) { // initialize usersettings
					var settings_init_data = Ext.create('MoodleMobApp.model.Settings', {
						usageagreement: false,
						accounttype: '',
						storeaccount: false
					});	
					this.setData(settings_init_data);
					this.sync();
				}
			}
		});

		// create the manual account store
		var manual_account_store = Ext.create('MoodleMobApp.store.ManualAccount'); 
		manual_account_store.load();

		// create the AAI account store
		var aai_account_store = Ext.create('MoodleMobApp.store.AaiAccount'); 
		aai_account_store.load();

		// create users store
		var users_store = Ext.create('MoodleMobApp.store.Users');
		users_store.load();

		// create enrolledusers store
		var enrolled_users_store = Ext.create('MoodleMobApp.store.EnrolledUsers');
		enrolled_users_store.load();
	
		// create courses store
		var courses_store = Ext.create('MoodleMobApp.store.Courses');
		courses_store.load();

		// create modules store
		var modules_store = Ext.create('MoodleMobApp.store.Modules');
		modules_store.load();

		// create forumdiscussions store
		var forum_discussions_store = Ext.create('MoodleMobApp.store.ForumDiscussions');
		forum_discussions_store.load();

		// create forumposts store
		var forum_posts_store = Ext.create('MoodleMobApp.store.ForumPosts');
		forum_posts_store.load();

		// create onlineassingnments store
		var online_assignment_submissions_store = Ext.create('MoodleMobApp.store.OnlineAssignmentSubmissions');
		online_assignment_submissions_store.load();
	}

});
