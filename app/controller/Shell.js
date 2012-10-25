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
		MoodleMobApp.Session.getCoursesStore().removeAll();
		MoodleMobApp.Session.getCoursesStore().getProxy().clear();
	},

	clearModules: function() {
		MoodleMobApp.Session.getModulesStore().removeAll();
		MoodleMobApp.Session.getModulesStore().getProxy().clear();
	},

	clearUsers: function() {
		MoodleMobApp.Session.getUsersStore().removeAll();
		MoodleMobApp.Session.getUsersStore().getProxy().clear();
	},

	clearEnrolledUsers: function() {
		MoodleMobApp.Session.getEnrolledUsersStore().removeAll();
		MoodleMobApp.Session.getEnrolledUsersStore().getProxy().clear();
	},

	clearForumDiscussions: function() {
		MoodleMobApp.Session.getForumDiscussionsStore().removeAll();
		MoodleMobApp.Session.getForumDiscussionsStore().getProxy().clear();
	},

	clearForumPosts: function() {
		MoodleMobApp.Session.getForumPostsStore().removeAll();
		MoodleMobApp.Session.getForumPostsStore().getProxy().clear();
	},

	clearFolders: function() {
		MoodleMobApp.Session.getFoldersStore().removeAll();
		MoodleMobApp.Session.getFoldersStore().getProxy().clear();
	},
});
