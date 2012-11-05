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
   			test_child_browser: 'button[action=test_child_browser]',
   			test_web_intent: 'button[action=test_web_intent]',
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
			test_child_browser: { tap: 'testChildBrowser' },
			test_web_intent: { tap: 'fireIntent' },
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

	testChildBrowser: function(){
		console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||');
		console.log('testing the CHILD BROWSER');
		console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||');
		//var url = 'http://www.vim.org/scripts/download_script.php?src_id=14208';
		//var url = 'https://mft.ti.ch/esempio_lista_semplificata.zip';
		//var url = 'http://www.gradsch.ohio-state.edu/Depo/ETD_Tutorial/lesson2.pdf';
		var url = 'file://sdcard/boa.jpg';
		window.plugins.childBrowser.showWebPage(url, { showLocationBar: true });

	},

	fireIntent: function() {
		var furl = 'file://sdcard/boa.jpg';
		//var furl = 'http://www.gradsch.ohio-state.edu/Depo/ETD_Tutorial/lesson2.pdf';
		window.plugins.webintent.startActivity(
			{
    			action: WebIntent.ACTION_VIEW,
				type: 'image/jpeg',
    			url: furl,
  			}, 
			function () {}, 
			function () {
    			alert('Failed to open URL via Android Intent');
  			});
	}

});
