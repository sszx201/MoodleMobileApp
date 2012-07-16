Ext.define('MoodleMobApp.controller.course.Navigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.course.ModuleList',
			'MoodleMobApp.model.course.forum.Discussion',
			'MoodleMobApp.model.course.forum.Post'
		],

		views: [
			'MoodleMobApp.view.course.ModuleList',
			'MoodleMobApp.view.course.forum.DiscussionList',
			'MoodleMobApp.view.course.forum.PostList',
		],

		refs: {
			navigator: '#course_navigator',
			course: '#course_list',
			module: '#module_list',
			discussion: '#forum_discussion_list',
			postlist: '#discussion_post_list',
		},

		control: {
			// generic controls
			course: { select: 'selectCourse' },
			module: { select: 'selectModule' },
			// specific controls
			discussion: { select: 'selectDiscussion' },
			postlist: { itemtap: 'selectPost'}
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

	selectDiscussion: function(view, record) {
		var discussion_posts_store = MoodleMobApp.WebService.getDiscussionPosts(this.course_token, record.raw);
		// display posts
		var self = this;
		discussion_posts_store.addListener('load', function(){
			self.indentPosts(this);
			self.getNavigator().push({
				xtype: 'discussionpostlist',	
				store: this
			});
		});
		
	},
	
	indentPosts: function(store){
		if( store.data.getCount() > 0 ) {
			// set root post depth to 0
			store.data.getAt(0).data.indentation = 0;
			for(var i=1; i < store.data.getCount(); ++i) {
				var parent_indentation = store.getById(store.data.getAt(i).data.parent).data.indentation;
				store.data.getAt(i).data.indentation = parent_indentation + 1;
			}
		}
	},

	selectPost: function(view, record) {
		console.log(view);	
		console.log(record);	
	}
});
