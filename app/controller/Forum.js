Ext.define('MoodleMobApp.controller.Forum', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.ForumDiscussion',
			'MoodleMobApp.model.ForumPost',
			'MoodleMobApp.model.ForumCreatePostResponse'
		],
		views: [
			'MoodleMobApp.view.ForumDiscussionList',
			'MoodleMobApp.view.ForumDiscussion',
			'MoodleMobApp.view.ForumPostList',
			'MoodleMobApp.view.ForumPost',
			'MoodleMobApp.view.ForumPostReply',
		],


		refs: {
			navigator: '#course_navigator',
			module: '#module_list',
			discussionList: '#forum_discussion_list',
			postList: '#forum_post_list',
			postReplyButton: 'button[action=postreply]',
			replyForm: '#forum_post_reply_form',
			saveReplyButton: 'button[action=savereply]',
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			// specific controls
			discussionList: { itemtap: 'selectDiscussion' },
			replyForm: { deactivate: 'replyToPostCancelled' },
			postReplyButton: { tap: 'replyToPost' },
			saveReplyButton: { tap: 'saveReplyToPost' },
		}
	},

	init: function(){
		Ext.f = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'forum'){
			this.selectForum(record.getData());
		}
	},

	selectForum: function(forum) {
		var forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');

		// filter discussions
		forum_discussions_store.clearFilter();
		forum_discussions_store.filterBy(
			function(record) {
				return record.get('forum') === forum.instanceid;
			}
		);

		// display discussions
		if(typeof this.getDiscussionList() == 'object') {
			this.getNavigator().push(this.getDiscussionList());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',	
				store: forum_discussions_store
			});
		}
	},

	selectDiscussion: function(view, index, target, record) {
		var forum_posts_store = Ext.data.StoreManager.lookup('forumposts');
		var discussionid = record.get('id');
		// filter discussions
		forum_posts_store.clearFilter();
		forum_posts_store.filterBy(
			function(post) {
				return post.get('discussion') === discussionid;
			}
		);

		/*
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
		*/

		if(typeof this.getPostList() == 'object'){
			this.getPostList().setStore(forum_posts_store);
			this.getNavigator().push(this.getPostList());
		} else { 
			this.getNavigator().push({
				xtype: 'forumpostlist',	
				store: forum_posts_store
			});
		}
	},	

	replyToPost: function(button){
		var parentRecord = button.getParent().getRecord();
		// remove the previous forum_post_reply_form view
		// if exists
		if(typeof this.getReplyForm() == 'object'){ 
			this.getReplyForm().setRecord(parentRecord);
			this.getNavigator().push(this.getReplyForm());
		} else {
			this.getNavigator().push({
				xtype: 'forumpostreply',
				record: parentRecord,
			});
		}
	},

	saveReplyToPost: function(button){
		var form = this.getReplyForm();
		console.log(form.getValues());
		var create_post_result_store = MoodleMobApp.WebService.createForumPost(form.getValues(), MoodleMobApp.Session.getCourseToken());
		// refresh the discussion content
		create_post_result_store.on(
			'load', 
			function(store, records){
				//this.backToDiscussion(this);
				console.log(store);
				console.log(records);
			},
			this,
			{single: true}
 		);
	},

	replyToPostCancelled: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	}
});
