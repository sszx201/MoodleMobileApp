Ext.define('MoodleMobApp.controller.Forum', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.ForumDiscussion',
			'MoodleMobApp.model.ForumPost',
			'MoodleMobApp.model.ForumCreateDiscussionResponse',
			'MoodleMobApp.model.ForumCreatePostResponse'
		],

		views: [
			'MoodleMobApp.view.ForumDiscussionList',
			'MoodleMobApp.view.ForumDiscussion',
			'MoodleMobApp.view.ForumDiscussionEdit',
			'MoodleMobApp.view.ForumPostList',
			'MoodleMobApp.view.ForumPost',
			'MoodleMobApp.view.ForumPostReply',
		],

		refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			discussionList: 'forum_discussion_list',
			editDiscussionForm: '#forum_discussion_edit_form',
			saveDiscussionButton: 'button[action=savediscussion]',
			addDiscussionButton: 'button[action=adddiscussion]',
			post: 'forumpost',
			postList: '#forum_post_list',
			postReplyButton: 'button[action=postreply]',
			replyForm: 'forumpostreply',
			saveReplyButton: 'button[action=savereply]',
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			// specific controls
			discussionList: { itemtap: 'selectDiscussion', },
			addDiscussionButton: { tap: 'editDiscussion' },
			saveDiscussionButton: { tap: 'saveDiscussion' },
			replyForm: { deactivate: 'replyToPostCancelled' },
			postReplyButton: { tap: 'replyToPost' },
			saveReplyButton: { tap: 'saveReplyToPost' },
			post: { getattachment: function() { console.log('attachment clicked'); } },
		}
	},

	init: function(){
		Ext.f = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'forum'){
			this.selectForum(record);
		}
	},

	selectForum: function(forum) {
		this.selected_forum = forum;
		var forum_discussions = this.getForumDiscussions();
		
		// display discussions
		if(typeof this.getDiscussionList() == 'object') {
			this.getDiscussionList().setStore(forum_discussions);
			this.getNavigator().push(this.getDiscussionList());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',	
				store: forum_discussions
			});
		}
		this.checkIfEditable();
	},

	getForumDiscussions: function() {
		// filter modules
		var forum_discussions = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.ForumDiscussion' });
		MoodleMobApp.Session.getForumDiscussionsStore().each(
			function(record) {
				if( parseInt(record.get('forum')) === parseInt(this.selected_forum.get('instanceid')) ) {
						forum_discussions.add(record);
				}
			}, this
		);
		return forum_discussions;
	},

	checkIfEditable: function() {
		switch(this.selected_forum.get('type')){
			case 'general':	
				this.getAddDiscussionButton().setHidden(false);
				break;
			case 'eachuser':
				// get user data
				var index = MoodleMobApp.Session.getUsersStore().findExact('username', MoodleMobApp.Session.getUsername());
				var user = MoodleMobApp.Session.getUsersStore().getAt(index).getData();
				// check if a discussion has been created 
				var index = MoodleMobApp.Session.getForumDiscussionsStore().findBy(function(record){
					return record.get('forum') == this.selected_forum.get('instanceid') && record.get('userid') == user.id;
				}, this);
				// if the discussion has not been created yet then show the button
				if(index == -1) {
					this.getAddDiscussionButton().setHidden(false);
				} else {
					this.getAddDiscussionButton().setHidden(true);
				}
				break;
			default:
				this.getAddDiscussionButton().setHidden(true);
		}
	},

	editDiscussion: function(button){
		if(typeof this.getEditDiscussionForm() == 'object'){ 
			this.getNavigator().push(this.getEditDiscussionForm());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionedit',
			});
		}
	},

	saveDiscussion: function(button) {
		var formData = this.getEditDiscussionForm().getValues();
		// set the forumid
		formData.forumid = this.selected_forum.get('instanceid');
		var token = MoodleMobApp.Session.getCourse().get('token');
		var create_discussion_result_store = MoodleMobApp.WebService.createDiscussion(formData, token);
		MoodleMobApp.app.showLoadMask('Creating...');
		create_discussion_result_store.on(
			'load', 
			function(store, records){
				if( store.first().raw.exception == undefined) {

					MoodleMobApp.Session.getForumDiscussionsStore().on(
						'refresh',
						function(){
							var course = MoodleMobApp.Session.getCoursesStore().getById(this.selected_forum.get('courseid'));
							this.getApplication().getController('Main').updateForumDiscussionsStore(course);
						},
						this,
						{single:true}
					);

					MoodleMobApp.Session.getForumDiscussionsStore().on(
						'write',
						function(){
							MoodleMobApp.app.hideLoadMask();
							this.checkIfEditable();
							this.getNavigator().pop();
						},
						this,
						{single:true}
					);
					// clearFilters triggers the refresh event and starts the update
					// of the forum discussions store
					MoodleMobApp.Session.getForumDiscussionsStore().clearFilter();
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

	selectDiscussion: function(view, index, target, record) {
		
		this.selected_discussion = record;
		this.selected_discussion_target = target;
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
			target.down('#stat').setHtml('');
			MoodleMobApp.Session.getForumDiscussionsStore().sync();
		}

		var raw_forum_posts = this.getForumPosts(record.get('id'));	
	
		// pre sort
		raw_forum_posts.sort([
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
		var root = raw_forum_posts.first();
		// append and sort posts
		this.appendPosts(root, raw_forum_posts);

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

	getForumPosts: function(discussionid) {
		// filter modules
		var forum_posts = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.ForumPost' });
		MoodleMobApp.Session.getForumPostsStore().each(
			function(record) {
				if( parseInt(record.get('discussion')) === parseInt(discussionid) ) {
						forum_posts.add(record);
				}
			}, this
		);
		return forum_posts;
	},

	appendPosts: function(node, selection){
		if(this.posts.findExact('id', node.get('id')) == -1){
			this.posts.add(node);
		}

		var subnodes = selection.queryBy(
			function(record){
				return record.get('parent') == node.get('id');
			}
		);

		subnodes.each(function(subnode){ this.appendPosts(subnode, selection); }, this);
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
		// check data
		if(formData.subject == "") {
			Ext.Msg.alert("Subject empty", "The Subject field cannot be empty. Please fill in.");
			return;
		}

		if(formData.reply == "") {
			Ext.Msg.alert("Message empty", "The Message field cannot be empty. Please fill in.");
			return;
		}

		var token = MoodleMobApp.Session.getCourse().get('token');
		var create_post_result_store = MoodleMobApp.WebService.createForumPost(formData, token);
		MoodleMobApp.app.showLoadMask('Saving...');
		// refresh the discussion content
		create_post_result_store.on(
			'load', 
			function(store, records){
				if( store.first().raw.exception == undefined) {
					MoodleMobApp.Session.getForumPostsStore().on(
						'write',
						function(){
							MoodleMobApp.app.hideLoadMask();
							// refresh posts
							this.selectDiscussion(null, 0, this.selected_discussion_target, this.selected_discussion);
							// show posts
							this.getNavigator().pop();
						},
						this,
						{single:true}
					);
					this.getApplication().getController('Main').updateForumPostsStore(this.selected_discussion, token);
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
