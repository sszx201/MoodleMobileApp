Ext.define('MoodleMobApp.controller.Forum', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.ModuleList',
			'MoodleMobApp.model.ForumDiscussion',
			'MoodleMobApp.model.ForumPost'
		],

		views: [
			'MoodleMobApp.view.ModuleList',
			'MoodleMobApp.view.ForumDiscussionList',
			'MoodleMobApp.view.ForumPostList',
			'MoodleMobApp.view.ForumPost',
		],

		refs: {
			navigator: '#course_navigator',
			module: '#module_list',
			discussion: '#forum_discussion_list',
			//postList: '#forum_post_list',
			//replyButton: '.x-post-reply-button',
		},

		control: {
			// generic controls
			module: { select: 'selectModule' },
			// specific controls
			discussion: { select: 'selectDiscussion' },
			//postlist: { itemtap: 'selectPost'},
			replyButton: { tap: 'replyToPost'},
		}
	},

	selectModule: function (view, record) {
		if(record.raw.modname === 'forum'){
			this.selectForum(record.raw);
		}
	},

	selectForum: function(forum) {
		var forum_discussions_store = MoodleMobApp.WebService.getForumDiscussions(forum);
		// display discussions
		this.getNavigator().push({
			xtype: 'forumdiscussionlist',	
			store: forum_discussions_store
		});
	},

	selectDiscussion: function(view, record) {
		var discussion_posts_store = MoodleMobApp.WebService.getDiscussionPosts(record.raw);
		// display posts
		var self = this;
		discussion_posts_store.addListener('load', function(){
			self.formatPosts(this);
			self.getNavigator().push({
				xtype: 'forumpostlist',	
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
			Ext.us=users_store;
			// add user info
			store.each(function(record){
				console.log(record.data.userid);
				var user = users_store.getById(record.data.userid);
				record.data.firstname=user.data.firstname;
				record.data.lastname=user.data.lastname;
				record.data.avatar=user.data.avatar;
			});
		}
	},

	/*
	replyToPost: function(view, record) {
		console.log('replying to the post; yaay');
		console.log(view);	
		console.log(record);	
	},
	*/

});
