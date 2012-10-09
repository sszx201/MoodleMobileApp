Ext.define('MoodleMobApp.controller.Shell', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
   			prompt: '#prompt',
   			output: '#output',
   			run: 'button[action=run]',
   			clear_all: 'button[action=clear_all_db]',
   			clear_courses: 'button[action=clear_courses_db]',
   			clear_modules: 'button[action=clear_modules_db]',
   			clear_users: 'button[action=clear_users_db]',
   			clear_enrolled_users: 'button[action=clear_enrolled_users_db]',
   			clear_forum_discussions: 'button[action=clear_forum_discussions_db]',
   			clear_forum_posts: 'button[action=clear_forum_posts_db]',
		},
		control: {
			run:{ tap: 'runCode' },
			clear_all: { tap: 'clearAll' },
			clear_courses: { tap: 'clearCourses' },
			clear_modules: { tap: 'clearModules' },
			clear_users: { tap: 'clearUsers' },
			clear_enrolled_users: { tap: 'clearEnrolledUsers' },
			clear_forum_dicussions: { tap: 'clearForumDiscussions' },
			clear_forum_posts: { tap: 'clearForumPosts' },
		}
	},

	init: function(){
		Ext.shell = this;
	},

	runCode: function(){
		var command = this.getPrompt().getValue();
		var evaluation = this.getOutput().setValue(eval(command));
	},

	clearAll: function() {
		this.clearCourses();
		this.clearModules();
		this.clearUsers();
		this.clearEnrolledUsers();
		this.clearForumDiscussions();
		this.clearForumPosts();
		this.clearFolders();
	},

	clearCourses: function() {
		Ext.data.StoreManager.lookup('courses').removeAll();
		Ext.data.StoreManager.lookup('courses').getProxy().clear();
	},

	clearModules: function() {
		Ext.data.StoreManager.lookup('modules').removeAll();
		Ext.data.StoreManager.lookup('modules').getProxy().clear();
	},

	clearUsers: function() {
		Ext.data.StoreManager.lookup('users').removeAll();
		Ext.data.StoreManager.lookup('users').getProxy().clear();
	},

	clearEnrolledUsers: function() {
		Ext.data.StoreManager.lookup('enrolledusers').removeAll();
		Ext.data.StoreManager.lookup('enrolledusers').getProxy().clear();
	},

	clearForumDiscussions: function() {
		Ext.data.StoreManager.lookup('forumdiscussions').removeAll();
		Ext.data.StoreManager.lookup('forumdiscussions').getProxy().clear();
	},

	clearForumPosts: function() {
		Ext.data.StoreManager.lookup('forumposts').removeAll();
		Ext.data.StoreManager.lookup('forumposts').getProxy().clear();
	},

	clearFolders: function() {
		Ext.data.StoreManager.lookup('folders').removeAll();
		Ext.data.StoreManager.lookup('folders').getProxy().clear();
	},

});
