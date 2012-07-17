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
		
		var course_users_store = MoodleMobApp.WebService.getEnrolledUsers(this.course_token, course_data.id);
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
			self.formatPosts(this);
			self.getNavigator().push({
				xtype: 'discussionpostlist',	
				store: this
			});
		});
		
	},
	
	formatPosts: function(store){
		if( store.data.getCount() > 0 ) {
			// add indentation values
			// set root post depth to 0
			store.data.getAt(0).data.indentation = 0;
			for(var i=1; i < store.data.getCount(); ++i) {
				var parent_indentation = store.getById(store.data.getAt(i).data.parent).data.indentation;
				store.data.getAt(i).data.indentation = parent_indentation + 1;
			}
			// hook up the users store
			var users_store = Ext.data.StoreManager.lookup('users');
			// add user info
			store.each(function(record){
				var user = users_store.getById(record.data.userid);
				record.data.firstname=user.data.firstname;
				record.data.lastname=user.data.lastname;
				record.data.avatar=user.data.avatar;
			});
		}
	},

	selectPost: function(view, record) {
		console.log(view);	
		console.log(record);	
	}
});
