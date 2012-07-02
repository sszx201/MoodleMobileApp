Ext.define('MoodleMobApp.controller.course.Navigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.course.ModuleList',
			'MoodleMobApp.model.course.forum.Discussion'	
		],
		views: [
			'MoodleMobApp.view.course.ModuleList',
			'MoodleMobApp.view.course.forum.DiscussionList'	
		],

		refs: {
			navigator: '#course_navigator',
			course: '#course_list',
			module: '#module_list'
		},

		control: {
			course: { select: 'selectCourse' },
			module: { select: 'selectModule' }
		}
	},

	selectCourse: function (view, record) {
		var course_data = record.getData();
		// set the course token
		this.course_token = course_data.token;
		// request course modules
		var course_modules_store = MoodleMobApp.WebService.getCourseModules(course_data);
		// display modules
		this.getNavigator().push({
			xtype: 'modulelist',	
			store: course_modules_store
		});
	},

	selectModule: function (view, record) {
		switch(record.raw.modname){
			case 'forum': 
				this.selectForum(record.raw);
			break;
		}
	},

	selectForum: function(forum) {
		var forum_discussions_store = MoodleMobApp.WebService.getForumDiscussions(this.course_token, forum);
		// display discussions
		this.getNavigator().push({
			xtype: 'forumdiscussionlist',	
			store: forum_discussions_store
		});
	},

});
