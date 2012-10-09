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
			'MoodleMobApp.store.Folders',
		],
		refs: {
			
		},
		control: {
			
		}
	},
	
	init: function() {
		MoodleMobApp.log = function(message) { console.log('>>>>> MOODBILE LOG MESSAGE :: ' + message); }
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
		// -log-
		users_store.on(
			'write',
			function(store, operation) { 
				MoodleMobApp.log('=> users_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> User: '+record.get('username')+'; id: '+record.get('id'));
				});
			});

		// create enrolledusers store
		var enrolled_users_store = Ext.create('MoodleMobApp.store.EnrolledUsers');
		enrolled_users_store.load();
		// -log-
		enrolled_users_store.on(
			'write',
			function(store, operation) { 
				MoodleMobApp.log('=> enrolled_users_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> Enrolled user: '+record.get('userid')+' in course '+record.get('courseid'));
				});
			});
	
		// create courses store
		var courses_store = Ext.create('MoodleMobApp.store.Courses');
		courses_store.load();
		MoodleMobApp.courses_store = courses_store;
		// -log-
		courses_store.on(
			'write',
			function(store, operation) { 
				MoodleMobApp.log('=> courses_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> Course: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		// create modules store
		var modules_store = Ext.create('MoodleMobApp.store.Modules');
		modules_store.load();
		// -log-
		modules_store.on(
			'write',
			function(store, operation) {
				MoodleMobApp.log('=> modules_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> Module: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		// create forumdiscussions store
		var forum_discussions_store = Ext.create('MoodleMobApp.store.ForumDiscussions');
		forum_discussions_store.load();
		// -log-
		forum_discussions_store.on(
			'write',
			function(store, operation) {
				MoodleMobApp.log('=> forum_discussions_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> Discussion: '+record.get('name')+'; id: '+record.get('id'));
				});
			});

		// create forumposts store
		var forum_posts_store = Ext.create('MoodleMobApp.store.ForumPosts');
		forum_posts_store.load();
		// -log-
		forum_posts_store.on(
			'write',
			function(store, operation){
				MoodleMobApp.log('=> forum_post_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					MoodleMobApp.log(' --> Post: '+record.get('id')+'; discussion: '+record.get('discussion'));
				});
			});

		// create onlineassingnments store
		var online_assignment_submissions_store = Ext.create('MoodleMobApp.store.OnlineAssignmentSubmissions');
		online_assignment_submissions_store.load();


		// create folders store
		var folders_store = Ext.create('MoodleMobApp.store.Folders');
		folders_store.load();
		// -log-
		folders_store.on(
			'write',
			function(store, operation){
				MoodleMobApp.log('=> folder_store write operation: action='+operation.getAction()+'; success: '+operation.wasSuccessful());
				Ext.iterate(operation.getRecords(), function(record){
					if(record.get('mime') == 'inode/directory'){
						MoodleMobApp.log(' --> Folder subfolder: '+record.get('name')+'; rootid: '+record.get('rootid'));
					} else {
						MoodleMobApp.log(' --> Folder file: '+record.get('name')+'; rootid: '+record.get('rootid'));
					}
				});
			});
	}
});
