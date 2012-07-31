Ext.define('MoodleMobApp.controller.Forum', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.ModuleList',
			'MoodleMobApp.model.ForumDiscussion',
			'MoodleMobApp.model.ForumPost',
			'MoodleMobApp.model.ForumCreatePostResponse'
		],

		views: [
			'MoodleMobApp.view.ModuleList',
			'MoodleMobApp.view.ForumDiscussionList',
			'MoodleMobApp.view.ForumPostList',
			'MoodleMobApp.view.ForumPost',
			'MoodleMobApp.view.ForumPostReply',
		],

		refs: {
			navigator: '#course_navigator',
			module: '#module_list',
			discussion: '#forum_discussion_list',
			postList: '#forum_post_list',
			postReplyButton: 'button[action=postreply]',
			replyForm: '#forum_post_reply_form',
			saveReplyButton: 'button[action=savereply]',
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			// specific controls
			discussion: { itemtap: 'selectDiscussion' },
			postReplyButton: { tap: 'replyToPost' },
			saveReplyButton: { tap: 'saveReplyToPost' },
		}
	},

	init: function(){
		Ext.f=this;	
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'forum'){
			this.selectForum(record.raw);
		}
	},

	selectForum: function(forum) {
		var forum_discussions_store = MoodleMobApp.WebService.getForumDiscussions(forum);
		// display discussions
		if(typeof this.getDiscussion() == 'object') {
			this.getDiscussion().setStore(forum_discussions_store);
			this.getNavigator().push(this.getDiscussion());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',	
				store: forum_discussions_store
			});
		}
	},

	selectDiscussion: function(view, index, target, record) {
		this.currentDiscussion = record;
		var discussion_posts_store = MoodleMobApp.WebService.getPostsByDiscussion(record.raw);
		// check for new users
		discussion_posts_store.on(
			'load', 
			function(){ 
				this.checkForNewUsers(discussion_posts_store);
				this.formatPosts(discussion_posts_store);
			},
			this,
			{single: true},
			'current'
 		);

		// display posts
		discussion_posts_store.on(
			'load', 
			function(){
				if(typeof this.getPostList() == 'object'){
					this.getPostList().setStore(discussion_posts_store);
					this.getNavigator().push(this.getPostList());
				} else { 
					this.getNavigator().push({
						xtype: 'forumpostlist',	
						store: discussion_posts_store
					});
				}
			},
			this,
			{single: true, delay: 300},
			'after'
 		);
	},

	checkForNewUsers: function(store){
		if( store.data.getCount() > 0 ) {
			// hook up the users store
			var users_store = Ext.data.StoreManager.lookup('users');

			// chech if there are new users and add them to the users_store
			store.each(function(record){
				var user = users_store.getById(record.data.userid);
				if(user == undefined) {
					this.getApplication().getController('User').addToStore(record.data.userid);
				}
			}, this);
		}
	},
	
	formatPosts: function(store){
		if( store.data.getCount() > 0 ) {
			// hook up the users store
			var users_store = Ext.data.StoreManager.lookup('users');

			// add indentation values
			// set root post depth to 0
			store.data.getAt(0).data.indentation = 0;
			for(var i=1; i < store.data.getCount(); ++i) {
				var parent_indentation = store.getById(store.data.getAt(i).data.parent).data.indentation;
				store.data.getAt(i).data.indentation = parent_indentation + 1;
			}

			// add user info
			store.each(function(record){
				var user = users_store.getById(record.data.userid);
				if( user != null) {
					record.data.firstname=user.data.firstname;
					record.data.lastname=user.data.lastname;
					record.data.avatar=user.data.avatar;
				}
			});
		}
	},

	replyToPost: function(btn){
		Ext.f=this;
		var parentRecord = btn.getParent().getRecord();
		// remove the previous forum_post_reply_form view
		// if exists
		if(typeof this.getReplyForm() == 'object'){
			this.getNavigator().pop();
		}
		this.getNavigator().push({
			xtype: 'forumpostreply',
			record: parentRecord,
		});
	},

	saveReplyToPost: function(btn){
		var form = this.getReplyForm();
		var create_post_result_store = MoodleMobApp.WebService.createForumPost(form.getValues());
		// refresh the discussion content
		create_post_result_store.on(
			'load', 
			function(){
				this.selectDiscussion(this, this.currentDiscussion);
			},
			this,
			{single: true}
 		);
	}
});
