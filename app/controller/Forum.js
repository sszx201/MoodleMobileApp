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
						if(discussion_record != undefined && discussion_record != null) {
							this.selectDiscussion(discussion_record);
						} else {
							Ext.Msg.alert(
								'Forum content',
								'This forum content is not available anymore. It was moved or deleted.'
							);
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
		// sync forum discussions everytime the forum is opened
		var scope = this;
		if(MoodleMobApp.app.isConnectionAvailable()) {
			this.downloadNewDiscussions(forum, function(){
				var forum_discussions = this.getForumDiscussions();
				scope.getDiscussionList().setStore(forum_discussions);
			});
		}
		var forum_discussions = this.getForumDiscussions();

		// display discussions
		if(typeof this.getDiscussionList() == 'object') {
			this.getDiscussionList().setTitle(forum.get('name'));
			this.getDiscussionList().setIntro(forum.get('intro'));
			this.getDiscussionList().setStore(forum_discussions);
			this.getNavigator().push(this.getDiscussionList());
		} else {
			this.getNavigator().push({
				xtype: 'forumdiscussionlist',
				title: forum.get('name'),
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
								if(parseInt(this.selected_forum.get('groupingid')) == 0 || groupings.getCount() == 0) {
									forum_discussions.add(record);
								} else {
									for(var i=0; i < groupings.getCount(); ++i) {
										if(parseInt(groupings.getAt(i).get('id')) == parseInt(this.selected_forum.get('groupingid'))) {
											forum_discussions.add(record);
											break;
										}
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
					this.downloadNewDiscussions(
						this.selected_forum,
						function(){
							MoodleMobApp.app.hideLoadMask();
							// show discussions
							scope.getNavigator().pop();
							// refresh discussions
							scope.selectForum(scope.selected_forum);
							// download the first post form the discussion that has been created
							var new_discussion_record = MoodleMobApp.Session.getForumDiscussionsStore().findRecord('id', store.first().get('discid'));
							scope.downloadNewPosts(new_discussion_record, function() { console.log('the first post has been downloaded');});
						}
					);
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
		console.log('Discussion selected');
		console.log(record.getData());
	
		var scope = this;
		// this function is used to indent the posts in order to create an user-friendlier structure
		var formatPosts = function(raw_forum_posts) {
			scope.posts = Ext.create('Ext.data.Store', {model: 'MoodleMobApp.model.ForumPost'});
			scope.posts.removeAll();
			if(raw_forum_posts.getCount() > 0) { // sort the posts if there are any
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
				var root = raw_forum_posts.first();
				// append and sort posts
				scope.appendPosts(root, raw_forum_posts);
			}

			if(typeof scope.getPostList() == 'object'){
				scope.getPostList().setStore(scope.posts);
				scope.getNavigator().push(scope.getPostList());
			} else {
				scope.getNavigator().push({
					xtype: 'forumpostlist',
					store: scope.posts
				});
			}
		};

		var unformated_posts = this.getForumPosts(record.get('id'));
		formatPosts(unformated_posts);

		// check for new posts after a discussion has been selected
		this.downloadNewPosts(this.selected_discussion, function(){
			var unformated_posts = scope.getForumPosts(scope.selected_discussion.get('id'));
			formatPosts(unformated_posts);
		});
	},

	/* This function downloads the forum discussions and executes a callBack when the discussions have been updated */
	downloadNewDiscussions: function(forum, callBack) {
		var new_discussions_store = MoodleMobApp.WebService.getForumDiscussions(forum.getData(), MoodleMobApp.Session.getCourse().get('token'));
		new_discussions_store.on(
			'load',
			function(store, downloaded_records) {

				// call the callback only after the ForumDiscussionStore has been updated
				MoodleMobApp.Session.getForumDiscussionsStore().on(
					'beforesync',
					callBack,
					this,
					{single: true}
				);

				// purge the removed discussions
				MoodleMobApp.Session.getForumDiscussionsStore().each(
					function(record) {
						if(forum.get('id') == record.get('forum')) {
							var record_removed = true;
							for(var i=0; i < downloaded_records.length; ++i) {
								if(downloaded_records[i].get('id') == record.get('id')) {
									record_removed = false;
									break;
								}
							}
							// purge record if removed
							if(record_removed) {
								console.log('Discussion removed');
								console.log(record.getData());
								MoodleMobApp.Session.getForumPostsStore().queryBy(
									function(entry, id) {
										if(entry.get('discussion') == discussion.get('id')) { return true; }
									}
								).each(
									function(post) {
										// remove post
										MoodleMobApp.Session.getForumPostsStore().remove(post);
									}
								);
								// remove discussion
								MoodleMobApp.Session.getForumDiscussionsStore().remove(discussion);
							}
						}
					}, this
				);

				Ext.each(downloaded_records, function(record) {
					var stored_record = MoodleMobApp.Session.getForumDiscussionsStore().findRecord('id', record.get('id'), null, false, true, true);
					if(stored_record == null) {
						MoodleMobApp.Session.getForumDiscussionsStore().add(record);
					} else if(stored_record.get('timemodified') != record.timemodified) {
						MoodleMobApp.Session.getForumDiscussionsStore().remove(stored_record);
						MoodleMobApp.Session.getForumDiscussionsStore().add(record);
					}
				});
				MoodleMobApp.Session.getForumDiscussionsStore().sync();
			},
			this, 
			{single: true}
		);
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

		if(MoodleMobApp.app.isConnectionAvailable()) {
			var token = MoodleMobApp.Session.getCourse().get('token');
			var create_post_result_store = MoodleMobApp.WebService.createForumPost(formData, token);
			MoodleMobApp.app.showLoadMask('Saving...');
			// refresh the discussion content
			create_post_result_store.on(
				'load',
				function(store, records){
					if( store.first().raw.exception == undefined) {
						this.downloadNewPosts(
							this.selected_discussion,
							function(){
								MoodleMobApp.app.hideLoadMask();
								// show posts
								this.getNavigator().pop();
								// refresh posts
								this.selectDiscussion(this.selected_discussion);
							}
						);
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
		} else {
			Ext.Msg.alert(
				'Connection',
				'No connection available. Sorry, cannot post the reply.'
			);
		}
	},

	replyToPostCancelled: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},

	downloadNewPosts: function(discussion, callBack) {
		var new_posts_store = MoodleMobApp.WebService.getPostsByDiscussion(discussion.getData(), MoodleMobApp.Session.getCourse().get('token'));
		new_posts_store.on(
			'load',
			function(store, downloaded_records) {
				console.log('downloaded records');
				console.log(downloaded_records);
				// call the callback only after the ForumDiscussionStore has been updated
				MoodleMobApp.Session.getForumPostsStore().on(
					'beforesync',
					callBack,
					this,
					{single: true}
				);

				// purge the removed discussions
				MoodleMobApp.Session.getForumPostsStore().each(
						function(record) {
							if(discussion.get('id') == record.get('discussion')) {
								var record_removed = true;
								for(var i=0; i < downloaded_records.length; ++i) {
									if(downloaded_records[i].get('id') == record.get('id')) {
										record_removed = false;
										break;
									}
								}
								// purge record if removed
								if(record_removed) {
									MoodleMobApp.Session.getForumPostsStore().remove(record);
								}
							}
						}, this
					);

				Ext.each(downloaded_records, function(record) {
					// fix indentation
					var parentid = record.get('parent');
					if(parentid == 0) { // root post
						// set the root post depth to 0
						record.set('indentation', 0);
					} else {
						var parent_post = MoodleMobApp.Session.getForumPostsStore().findRecord('id', parentid, null, false, true, true);
						var parent_indentation = parent_post.get('indentation');
						record.set('indentation', parent_indentation + 1);
					}

					var stored_record = MoodleMobApp.Session.getForumPostsStore().findRecord('id', record.get('id'), null, false, true, true);
					if(stored_record == null) {
						MoodleMobApp.Session.getForumPostsStore().add(record);
					} else if(stored_record.get('modified') != record.get('modified')) {
						MoodleMobApp.Session.getForumPostsStore().remove(stored_record);
						MoodleMobApp.Session.getForumPostsStore().add(record);
					}
				});
				MoodleMobApp.Session.getForumPostsStore().sync();
			},
			this,
			{single: true}
		);
	}
});
