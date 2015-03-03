Ext.define('MoodleMobApp.controller.Init', {
	extend: 'Ext.app.Controller',
	
	config: {
		models: [
			'MoodleMobApp.model.Settings'
		],

		stores: [
			'MoodleMobApp.store.Settings',
			'MoodleMobApp.store.ManualAccount',
			'MoodleMobApp.store.AaiAccount',
			'MoodleMobApp.store.Users',
			'MoodleMobApp.store.EnrolledUsers',
			'MoodleMobApp.store.Groups',
			'MoodleMobApp.store.Groupings',
			'MoodleMobApp.store.Courses',
			'MoodleMobApp.store.RecentActivities',
			'MoodleMobApp.store.CalendarEvents',
			'MoodleMobApp.store.CourseSections',
			'MoodleMobApp.store.Modules',
			'MoodleMobApp.store.Resources',
			'MoodleMobApp.store.Url',
			'MoodleMobApp.store.Pages',
			'MoodleMobApp.store.Books',
			'MoodleMobApp.store.Choices',
			'MoodleMobApp.store.AssignReports',
			'MoodleMobApp.store.ForumDiscussions',
			'MoodleMobApp.store.ForumPosts',
			'MoodleMobApp.store.Folders',
			'MoodleMobApp.store.GradeItems',
			'MoodleMobApp.store.Grades'
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

		MoodleMobApp.Session.setSettingsStore(settings_store);

		// create the manual account store
		var manual_account_store = Ext.create('MoodleMobApp.store.ManualAccount'); 
		manual_account_store.load();
		MoodleMobApp.Session.setManualAccountStore(manual_account_store);

		// create the AAI account store
		var aai_account_store = Ext.create('MoodleMobApp.store.AaiAccount'); 
		aai_account_store.load();
		MoodleMobApp.Session.setAaiAccountStore(aai_account_store);

		// create users store
		var users_store = Ext.create('MoodleMobApp.store.Users');
		users_store.load();
		MoodleMobApp.Session.setUsersStore(users_store);

		// create enrolledusers store
		var enrolled_users_store = Ext.create('MoodleMobApp.store.EnrolledUsers');
		enrolled_users_store.load();
		MoodleMobApp.Session.setEnrolledUsersStore(enrolled_users_store);

		// create groups store
		var groups_store = Ext.create('MoodleMobApp.store.Groups');
		groups_store.load();
		MoodleMobApp.Session.setGroupsStore(groups_store);

		// create groupingings store
		var groupings_store = Ext.create('MoodleMobApp.store.Groupings');
		groupings_store.load();
		MoodleMobApp.Session.setGroupingsStore(groupings_store);
	
		// create courses store
		var courses_store = Ext.create('MoodleMobApp.store.Courses');
		courses_store.load();
		MoodleMobApp.Session.setCoursesStore(courses_store);

		// create recentactivities store
		var recent_activities_store = Ext.create('MoodleMobApp.store.RecentActivities');
		recent_activities_store.load();
		MoodleMobApp.Session.setRecentActivitiesStore(recent_activities_store);

		// create calendarevents store
		var calendar_events_store = Ext.create('MoodleMobApp.store.CalendarEvents');
		calendar_events_store.load();
		MoodleMobApp.Session.setCalendarEventsStore(calendar_events_store);

		// create coursesections store
		var course_sections_store = Ext.create('MoodleMobApp.store.CourseSections');
		course_sections_store.load();
		MoodleMobApp.Session.setCourseSectionsStore(course_sections_store);

		// create modules store
		var modules_store = Ext.create('MoodleMobApp.store.Modules');
		modules_store.load();
		MoodleMobApp.Session.setModulesStore(modules_store);

		// create resources store
		var resources_store = Ext.create('MoodleMobApp.store.Resources');
		resources_store.load();
		MoodleMobApp.Session.setResourcesStore(resources_store);

		// create url store
		var url_store = Ext.create('MoodleMobApp.store.Url');
		url_store.load();
		MoodleMobApp.Session.setUrlStore(url_store);

		// create pages store
		var pages_store = Ext.create('MoodleMobApp.store.Pages');
		pages_store.load();
		MoodleMobApp.Session.setPagesStore(pages_store);

		// create books store
		var books_store = Ext.create('MoodleMobApp.store.Books');
		books_store.load();
		MoodleMobApp.Session.setBooksStore(books_store);

		// create choices store
		var choices_store = Ext.create('MoodleMobApp.store.Choices');
		choices_store.load();
		MoodleMobApp.Session.setChoicesStore(choices_store);

		// create assignreports store
		var assign_reports_store = Ext.create('MoodleMobApp.store.AssignReports');
		assign_reports_store.load();
		MoodleMobApp.Session.setAssignReportsStore(assign_reports_store);

		// create forumdiscussions store
		var forum_discussions_store = Ext.create('MoodleMobApp.store.ForumDiscussions');
		forum_discussions_store.load();	
		MoodleMobApp.Session.setForumDiscussionsStore(forum_discussions_store);

		// create forumposts store
		var forum_posts_store = Ext.create('MoodleMobApp.store.ForumPosts');
		forum_posts_store.load();
		MoodleMobApp.Session.setForumPostsStore(forum_posts_store);

		// create folders store
		var folders_store = Ext.create('MoodleMobApp.store.Folders');
		folders_store.load();
		MoodleMobApp.Session.setFoldersStore(folders_store);

		// create gradeitems store
		var gradeitems_store = Ext.create('MoodleMobApp.store.GradeItems');
		gradeitems_store.load();
		MoodleMobApp.Session.setGradeItemsStore(gradeitems_store);

		// create grades store
		var grades_store = Ext.create('MoodleMobApp.store.Grades');
		grades_store.load();
		MoodleMobApp.Session.setGradesStore(grades_store);

		/*********************************
		 * DEBUG/LOG MESSAGES
		 * ******************************/
		/*
		users_store.on(
			'write',
			function(store, operation) {
				console.log('=> users_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> User: '+record.get('username')+'; id: '+record.get('id'));
				});
			});

		enrolled_users_store.on(
			'write',
			function(store, operation) {
				console.log('=> enrolled_users_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Enrolled user: '+record.get('userid')+' in course '+record.get('courseid'));
				});
			});

		courses_store.on(
			'write',
			function(store, operation) {
				console.log('=> courses_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Course: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		modules_store.on(
			'write',
			function(store, operation) {
				console.log('=> modules_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Module: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		resources_store.on(
			'write',
			function(store, operation) {
				console.log('=> resources_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Resource: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		choices_store.on(
			'write',
			function(store, operation) {
				console.log('=> choices_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Choice: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		url_store.on(
			'write',
			function(store, operation) {
				console.log('=> url_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Url: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		forum_discussions_store.on(
			'write',
			function(store, operation) {
				console.log('=> forum_discussions_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Discussion: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		forum_posts_store.on(
			'write',
			function(store, operation) {
				console.log('=> forum_post_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Post: '+record.get('id')+'; discussion: '+record.get('discussion'));
				});
			});

		folders_store.on(
			'write',
			function(store, operation) {
				console.log('=> folder_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					if(record.get('mime') == 'inode/directory'){
						console.log(' --> Folder subfolder: '+record.get('name')+'; rootid: '+record.get('rootid'));
					} else {
						console.log(' --> Folder file: '+record.get('name')+'; rootid: '+record.get('rootid'));
					}
				});
			});

		gradeitems_store.on(
			'write',
			function(store, operation) {
				console.log('=> gradeitems_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Grade Item: '+record.get('itemmodule')+'; instance: '+record.get('iteminstance'));
				});
			});

		grades_store.on(
			'write',
			function(store, operation) {
				console.log('=> grades_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					console.log(' --> Grade for: '+record.get('itemid')+'; value: '+record.get('rawgrade'));
				});
			});
		*/

	}

});
