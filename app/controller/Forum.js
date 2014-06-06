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
			'MoodleMobApp.view.ForumPostReply'
		],

		refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			discussionList: 'forumdiscussionlist',
			editDiscussionForm: 'forumdiscussionedit',
			saveDiscussionButton: 'button[action=savediscussion]',
			addDiscussionButton: 'button[action=adddiscussion]',
			post: 'forumpost',
			postList: 'forumpostlist',
			postReplyButton: 'button[action=postreply]',
			replyForm: 'forumpostreply',
			saveReplyButton: 'button[action=savereply]',
			recentActivity: 'recentactivitylist'
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			// specific controls
			discussionList: {
				itemtap: function(view, index, target, record) {
					this.selectDiscussion(record);
				}
			},
			addDiscussionButton: { tap: 'editNewDiscussion' },
			saveDiscussionButton: { tap: 'saveDiscussion' },
			replyForm: { deactivate: 'replyToPostCancelled' },
			postReplyButton: { tap: 'replyToPost' },
			saveReplyButton: { tap: 'saveReplyToPost' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'forum') {
						var discussion_record = MoodleMobApp.Session.getForumDiscussionsStore().findRecord('id', record.get('instanceid'));
						if(discussion_record != undefined) {
							this.selectDiscussion(discussion_record);
						}
					}
				}

			}
		}
	},

	init: function(){
		Ext.f = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'forum') {
			this.selectForum(record);
		}
	},

	selectForum: function(forum) {
		this.selected_forum = forum;
		var forum_discussions = this.getForumDiscussions();
		console.log(forum.getData());

		// display discussions
		if(typeof this.getDiscussionList() == 'object') {
			this.getDiscussionList().setIntro(forum.get('intro'));
			this.getDiscussionList().setStore(forum_discussions);
			this.getNavigator().push(this.getDiscussionList());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',
				store: forum_discussions,
				intro: this.selected_forum.get('intro')
			});
		}
		this.checkIfEditable();
	},

	getForumDiscussions: function() {
		// filter modules
		var forum_discussions = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.ForumDiscussion' });
		if(this.selected_forum.get('groupmode') == MoodleMobApp.Config.getSeparatedGroupsFlag()) {
			// groups check
			var groups = this.getGroups();
			var groupings = this.getGroupings();
			MoodleMobApp.Session.getForumDiscussionsStore().each(
				function(record) {
					if( parseInt(record.get('forum')) === parseInt(this.selected_forum.get('instanceid')) ) {
						if(MoodleMobApp.Session.getCourse().get('accessallgroups') == 0) {
							// if the user cannot access al groups check which groups he/she can access
							var visibleByGroup = false;
							for(var i=0; i < groups.getCount(); ++i) {
								if(	parseInt(groups.getAt(i).get('id')) == parseInt(record.get('groupid')) ) {
									forum_discussions.add(record);
									visibleByGroup = true;
									break;
								}
							}

							// if the discusison is not visible by any group the check the grouping
							if(!visibleByGroup && parseInt(record.get('groupid')) == -1) {
								for(var i=0; i < groupings.getCount(); ++i) {
									if(	parseInt(groupings.getAt(i).get('id')) == parseInt(this.selected_forum.get('groupingid')) ) {
										forum_discussions.add(record);
										break;
									}
								}
							}
						} else {
							// the user can access all groups; just add the discussion
							forum_discussions.add(record);
						}
					}
				}, this
			);
		} else {
			MoodleMobApp.Session.getForumDiscussionsStore().each(
				function(record) {
					if( parseInt(record.get('forum')) === parseInt(this.selected_forum.get('instanceid')) ) {
						forum_discussions.add(record);
					}
				}, this
			);
		}
		return forum_discussions;
	},

	getGroups: function() {
		var groups = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.Group' });
		MoodleMobApp.Session.getGroupsStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) === parseInt(this.selected_forum.get('courseid')) ) {
					groups.add(record);
				}
			}, this
		);
		return groups;
	},

	getGroupings: function() {
		var groupings = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.Group' });
		MoodleMobApp.Session.getGroupingsStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) === parseInt(this.selected_forum.get('courseid')) ) {
					groupings.add(record);
				}
			}, this
		);
		return groupings;
	},

	checkIfEditable: function() {
		switch(this.selected_forum.get('type')){
			case 'general':	
				this.getAddDiscussionButton().setHidden(false);
			break;
			case 'eachuser':
				// get user data
				var user = MoodleMobApp.Session.getUsersStore().findRecord('username', MoodleMobApp.Session.getUsername());
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
			break;
		}
	},

	editNewDiscussion: function(button){
		if(typeof this.getEditDiscussionForm() == 'object'){ 
			this.getEditDiscussionForm().destroy();
		}

		this.getNavigator().push({
			xtype: 'forumdiscussionedit'
		});
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
					var scope = this;
					this.getApplication().getController('Updater').updateForumDiscussionsStore(MoodleMobApp.Session.getCourse(), function() {
						MoodleMobApp.app.hideLoadMask();
						var forum_discussions = scope.getForumDiscussions();
						scope.getDiscussionList().setStore(forum_discussions);
						scope.checkIfEditable();
						scope.getNavigator().pop();
					});
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

	selectDiscussion: function(record) {
		this.selected_discussion = record;
		//console.log('discussion selected'); console.log(record.getData());

		var raw_forum_posts = this.getForumPosts(record.get('id'));	
	
		// pre sort
		raw_forum_posts.sort([
			{
				property: 'parent',
				direction: 'ASC'
			},
			{
				property: 'creation',
				direction: 'ASC'
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
			this.getReplyForm().destroy()
		}

		this.getNavigator().push({
			xtype: 'forumpostreply',
			record: parentRecord
		});
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
							// show posts
							this.getNavigator().pop();
							// refresh posts
							this.selectDiscussion(this.selected_discussion);
						},
						this,
						{single:true}
					);
					this.getApplication().getController('Updater').updateForumPostsStore(this.selected_discussion, token);
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
