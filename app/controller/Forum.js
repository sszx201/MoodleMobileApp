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
			navigator: '#course_navigator',
			module: '#module_list',
			discussionList: '#forum_discussion_list',
			editDiscussionForm: '#forum_discussion_edit_form',
			saveDiscussionButton: 'button[action=savediscussion]',
			addDiscussionButton: 'button[action=adddiscussion]',
			postList: '#forum_post_list',
			postReplyButton: 'button[action=postreply]',
			replyForm: '#forum_post_reply_form',
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
		this.filterForumDiscussions();	
		
		// display discussions
		if(typeof this.getDiscussionList() == 'object') {
			this.getNavigator().push(this.getDiscussionList());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',	
				store: MoodleMobApp.Session.getForumDiscussionsStore()
			});
		}
		this.checkIfEditable();
	},

	filterForumDiscussions: function(){
		// filter discussions
		MoodleMobApp.Session.getForumDiscussionsStore().clearFilter();
		MoodleMobApp.Session.getForumDiscussionsStore().filterBy(
			function(record) {
				return record.get('forum') === this.selected_forum.get('instanceid');
			},
			this
		);
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
							this.checkIfEditable();
							this.getNavigator().pop();
							this.filterForumDiscussions();
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
			target.getStat().setHtml('');
			MoodleMobApp.Session.getForumDiscussionsStore().sync();
		}

		var discussionid = record.get('id');
		// filter discussions / restrict the range
		MoodleMobApp.Session.getForumPostsStore().clearFilter();
		MoodleMobApp.Session.getForumPostsStore().filterBy(
			function(post) {
				return post.get('discussion') === discussionid;
			}
		);
	
		// pre sort
		MoodleMobApp.Session.getForumPostsStore().sort([
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
		var root = MoodleMobApp.Session.getForumPostsStore().first();
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
		var subnodes = MoodleMobApp.Session.getForumPostsStore().queryBy(function(record){
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
		// refresh the discussion content
		create_post_result_store.on(
			'load', 
			function(store, records){
				if( store.first().raw.exception == undefined) {
					MoodleMobApp.Session.getForumPostsStore().on(
						'write',
						function(){
							// refresh posts
							this.selectDiscussion(null, 0, this.selected_discussion_target, this.selected_discussion);
							// show posts
							this.getNavigator().pop();
						},
						this,
						{single:true}
					);
					//var discussion = MoodleMobApp.Session.getForumDiscussionsStore().getById(formData.discussion);
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
