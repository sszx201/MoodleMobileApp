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
		this.forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');
		this.forum_posts_store = Ext.data.StoreManager.lookup('forumposts');
		Ext.f = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'forum'){
			this.selectForum(record.getData());
		}
	},

	selectForum: function(forum) {
		// filter discussions
		this.forum_discussions_store.clearFilter();
		this.forum_discussions_store.filterBy(
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
				store: this.forum_discussions_store
			});
		}
	},

	selectDiscussion: function(view, index, target, record) {
		// update the status
		update_status = false;
		if(record.get('isnew') == true) {
			record.set('isnew', false);
			update_status = true;
		}

		if(record.get('isupdated') == true) {
			record.set('isupdated', false);
			update_status = true;
		}

		if(update_status) {
			target.getStat().setHtml('');
			this.forum_discussions_store.sync();
		}

		var discussionid = record.get('id');
		// filter discussions / restrict the range
		this.forum_posts_store.clearFilter();
		this.forum_posts_store.filterBy(
			function(post) {
				return post.get('discussion') === discussionid;
			}
		);
	
		// pre sort
		this.forum_posts_store.sort([
			{
				property: 'parent',
				direction: 'ASC',
			},
			{
				property: 'creation',
				direction: 'ASC',
			}
		]);
		
		this.posts = Ext.create('Ext.data.Store', {model: 'MoodleMobApp.model.ForumPost'});
		this.posts.removeAll();
		var root = this.forum_posts_store.first();
		// append and sort posts
		this.appendPosts(root);

		if(typeof this.getPostList() == 'object'){
			this.getPostList().setStore(this.posts);
			this.getNavigator().push(this.getPostList());
		} else { 
			this.getNavigator().push({
				xtype: 'forumpostlist',	
				store: this.posts
			});
		}
	},

	appendPosts: function(node){
		if(this.posts.findExact('id', node.get('id')) == -1){
			this.posts.add(node);
		}
		var subnodes = this.forum_posts_store.queryBy(function(record){
			return record.get('parent') == node.get('id');
		});

		subnodes.each(function(subnode){ this.appendPosts(subnode); }, this);
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
		var formData = this.getReplyForm().getValues();
		var token = MoodleMobApp.Session.getCourseToken();
		var create_post_result_store = MoodleMobApp.WebService.createForumPost(formData, token);
		// refresh the discussion content
		create_post_result_store.on(
			'load', 
			function(store, records){
				if( store.first().raw.exception == undefined) {
					this.forum_posts_store.on(
						'write',
						function(){
							this.getNavigator().pop();
						},
						this,
						{single:true}
					);
					var discussion = this.forum_discussions_store.getById(formData.discussion);
					this.getApplication().getController('Main').updateForumPostsStore(discussion, token);
				} else {
					Ext.Msg.alert(
						store.first().raw.exception,
						store.first().raw.message
					);
				}
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
