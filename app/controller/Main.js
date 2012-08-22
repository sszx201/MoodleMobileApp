Ext.define('MoodleMobApp.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
   
		},
		control: {
			
		}
	},

	init: function(){
		var courses_store = Ext.data.StoreManager.lookup('courses');
		var modules_store = Ext.data.StoreManager.lookup('modules');
		// set listener for updating the course module stats
		courses_store.on('write', this.updateUsersStores, this, {single:true, delay: 100});
		courses_store.on('write', this.updateDataStores, this, {single:true, delay: 100});
		courses_store.on('write', this.checkForNewUsers, this, {single:true, delay: 1000});
		courses_store.on('write', this.formatPosts, this, {single:true, delay: 500});
		Ext.m = this;
	},

	updateDataStores: function(){
		var courses_store = Ext.data.StoreManager.lookup('courses');
		var modules_store = Ext.data.StoreManager.lookup('modules');
		// update modules
		courses_store.each(function(course) {
			MoodleMobApp.WebService.getCourseModules(course.getData()).on(
				'load', 
				function(mstore){
					// check if this is a new course
					var courseid = mstore.first().get('courseid');
					var is_new_course = courses_store.getById(courseid).get('isnew');

					// remove from the cache the modules that have been
					// deleted from the course
					modules_store.queryBy(
						function(record, id){
							if(record.get('courseid') == courseid) { return true; }
						}).each(
							function(record){
								// if the record is not in the 
								if(mstore.find('id', record.get('id')) == -1){
									modules_store.remove(record);
								}
							});

					var store_to_sync = false;	
					// add/update new module entries
					mstore.each(function(module){
						// check if the moodle entry exists in the store
						if(modules_store.find('id', module.get('id')) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules show as new
							if(is_new_course) {
								module.set('isnew', false);	
							} else {
								module.set('isnew', true);	
							}
							module.set('isupdated', false);	
							module.setDirty();
							modules_store.add(module);
							store_to_sync = true;
						} else if(modules_store.getById(module.get('id')).get('timemodified') != module.get('timemodified')) { // check if updated
							module.set('isnew', false);	
							module.set('isupdated', true);
							modules_store.getById(module.get('id')).setDirty();
							modules_store.getById(module.get('id')).setData(module.getData());
							store_to_sync = true;
						}
					});	
					
					if(store_to_sync) { // sync the updating process with the modules_store
						modules_store.on('write', function() { this.updateCourseModulesCounter(courseid); }, this, {single:true});
						modules_store.on('write', function() { this.updateForumDiscussionsStore(courseid); }, this, {single:true});
					} else { // no syncronisation needed; proceed with other updates
						this.updateForumDiscussionsStore(courseid);
					}

					// sync
					modules_store.sync();
				},
				this,
				{single: true}
			);
		}, this);
		
	},

	updateCourseModulesCounter: function(courseid) {
		var courses_store = Ext.data.StoreManager.lookup('courses');
		var modules_store = Ext.data.StoreManager.lookup('modules');

		// count modules
		var all_modules = modules_store.queryBy(function(record, id) {
			if(record.get('courseid') == courseid) {
				return true;
			}
		});
		// count updated modules
		var updated_modules = modules_store.queryBy(function(record, id) {
			if(record.get('courseid') == courseid && record.get('isupdated') == true) {
				return true;
			}
		});

		// count new modules
		var new_modules = modules_store.queryBy(function(record, id) {
			if(record.get('courseid') == courseid && record.get('isnew') == true) {
				return true;
			}
		});
		
		// create the stat
		var modstat = 'modules: '+all_modules.getCount();
		if(updated_modules.getCount() > 0) {
			modstat+= ' | updated: '+updated_modules.getCount();
		}
		if(new_modules.getCount() > 0) {
			modstat+= ' | new: '+new_modules.getCount();
		}
		// write the stat
		courses_store.getById(courseid).set('modulestatus', modstat)
		courses_store.getById(courseid).setDirty();
		courses_store.sync();

	},

	updateUsersStores: function() {
		var courses_store = Ext.data.StoreManager.lookup('courses');
		// hook up the user releated stores
		var enrolled_users_store = Ext.data.StoreManager.lookup('enrolledusers');
		var users_store = Ext.data.StoreManager.lookup('users');
		
		courses_store.each(function(course) {
			// get the enrolled users
			MoodleMobApp.WebService.getEnrolledUsers(course.getData()).on(
				'load',
				function() {
					if(this.getCount() > 0){
						
						// update the list of enrolled users for the current course
						var course_group = enrolled_users_store.getGroups(course.get('id').toString());
						if(typeof course_group == 'object') {
							enrolled_users_store.remove(course_group.children);
						}

						this.each(function(record){
							enrolled_users_store.add({'courseid': course.get('id'), 'userid': record.get('id')});
							// if this user is not in the store add it 
							// else 
							// if a previous entry of this user exists and has been modified
							// then updated it by removing the previous entry otherwise skip the record
							var current_user = users_store.getById(record.get('id'));
							if(current_user == null){
								record.setDirty();
								users_store.add(record);
							} else if(typeof current_user == 'object' && current_user.get('timemodified') != record.get('timemodified')){
								users_store.getById(record.get('id')).setData(record.getData());
								users_store.getById(record.get('id')).setDirty();
							}
						});
						enrolled_users_store.sync();
						users_store.sync();
					}
				},
				'',
				{single: true}
			);
		});
	},

	updateForumDiscussionsStore: function (courseid) {
		var courses_store = Ext.data.StoreManager.lookup('courses');
		var modules_store = Ext.data.StoreManager.lookup('modules');
		var forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');
		var course = courses_store.getById(courseid);

		modules_store.queryBy(function(record, id){
			if(record.get('modname') == 'forum' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(forum) {
			MoodleMobApp.WebService.getForumDiscussions(forum.getData(), course.get('token')).on(
				'load',
				function(discussions) {
					var is_new_course = course.get('isnew');
					var store_to_sync = false;
					discussions.each(function(discussion) {
						// if this discussion is new then add
						if(forum_discussions_store.find('id', discussion.get('id') ) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules marked as new
							if(is_new_course) {
								discussion.set('isnew', false);	
							} else {
								discussion.set('isnew', true);	
							}
							discussion.set('isupdated', false);	
							discussion.setDirty();
							forum_discussions_store.add(discussion);
							store_to_sync = true;
						// check if the discussion has been updated or not
						} else if(forum_discussions_store.getById(discussion.get('id')).get('timemodified') != discussion.get('timemodified')) {
							discussion.setDirty();
							discussion.set('isupdated', true);	
							forum_discussions_store.getById(discussion.get('id')).setData(discussion.getData());
							store_to_sync = true;
						}	
					});

					// remove from the cache the discussions that have been
					// deleted from the store
					forum_discussions_store.queryBy(
						function(record, id){
							if(record.get('forum') == forum.get('instanceid')) { return true; } 
						}).each(
							function(record){
								// if the record is not in the 
								if(discussions.find('id', record.get('id')) == -1) { 
									forum_discussions_store.remove(record);
								}
							});

		
					if(store_to_sync) { // sync the updating process with the modules_store
						forum_discussions_store.on('write', function() { this.updateForumPostsStore(forum.get('instanceid'), course.get('token')); }, this, {single:true});
					} else { // no syncronisation needed; proceed with other updates
						this.updateForumPostsStore(forum.get('id'), course.get('token'));
					}

					// write the forum discussions store
					forum_discussions_store.sync();
				},
				this, 
				{single: true}
			);
		}, this);
	},

	updateForumPostsStore: function(forumid, token) {
		var forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');
		var forum_posts_store = Ext.data.StoreManager.lookup('forumposts');

		forum_discussions_store.queryBy(function(record, id){
			return parseInt(record.get('forum')) == parseInt(forumid);
		}).each(function(discussion) {
			MoodleMobApp.WebService.getPostsByDiscussion(discussion.getData(), token).on(
				'load',
				function(posts) {
					var is_new_discussion = discussion.get('isnew');
					posts.each(function(post) {
						// if this post is new then add
						if(forum_posts_store.find('id', post.get('id') ) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules marked as new
							if(is_new_discussion) {
								post.set('isnew', false);	
							} else {
								post.set('isnew', true);	
							}
							post.set('isupdated', false);	
							post.setDirty();
							forum_posts_store.add(post);
						// check if the discussion has been updated or not
						} else if(forum_posts_store.getById(post.get('id')).get('modified') != post.get('modified')) {
							post.setDirty();
							post.set('isupdated', true);	
							forum_postss_store.getById(post.get('id')).set(post);
						}	
					});

					// remove from the cache the discussions that have been
					// deleted from the store
					forum_posts_store.queryBy(
						function(record, id){
							return parseInt(record.get('forum')) == parseInt(discussion.get('id'));
						}).each(
							function(record){
								// if the record is not in the 
								if(posts.find('id', record.get('id')) == -1) { 
									forum_posts_store.remove(record);
								}
							});

					// write the forum discussions store
					forum_posts_store.sync();
				},
				this, 
				{single: true}
			);
		}, this);
	},

	checkForNewUsers: function(){
		var forum_posts_store = Ext.data.StoreManager.lookup('forumposts');

		if( forum_posts_store.getCount() > 0 ) {
			// hook up the users store
			var users_store = Ext.data.StoreManager.lookup('users');
			// chech if there are new users and add them to the users_store
			var added_users = new Array();
			forum_posts_store.each(function(post){
				var user = users_store.getById(post.get('userid'));
				if(user == undefined && added_users.indexOf(post.get('userid')) == -1) { // avoid adding twice the same user
					// keep track of added users
					added_users.push(post.get('userid'));
					var token = this.getTokenByForumPostId(post.get('id'));
					this.storeUser(post.get('userid'), token);
				}
			}, this);
		}
	},
	
	// this function adds user avatars and the indentation values to
	// all posts
	formatPosts: function(){
		var forum_posts_store = Ext.data.StoreManager.lookup('forumposts');
		var forum_posts_count = forum_posts_store.getCount();
		if( forum_posts_count > 0 ) {
			// hook up the users store
			var users_store = Ext.data.StoreManager.lookup('users');

			// add indentation values
			for(var i=0; i < forum_posts_count; ++i) {
				var parentid = forum_posts_store.data.getAt(i).get('parent');
				if(parentid == 0) { // root post
					// set the root post depth to 0
					forum_posts_store.getAt(i).set('indentation', 0);
				} else {
					var parent_indentation = forum_posts_store.getById(parentid).get('indentation');
					forum_posts_store.data.getAt(i).set('indentation', parent_indentation + 1);
				}
			}

			// add user info
			forum_posts_store.each(function(post){
				var user = users_store.getById(post.get('userid'));
				if( user != null) {
					post.set('firstname', user.get('firstname'));
					post.set('lastname', user.get('lastname'));
					post.set('avatar', user.get('avatar'));
				}
			});
		}
	},
	
	// given a userid and the course token this
	// function adds the new user to the users store
	storeUser: function(userid, token){
		var users_store = Ext.data.StoreManager.lookup('users');
		console.log('adding userid');
		console.log(userid);
		var new_user_store = MoodleMobApp.WebService.getUserById(userid, token);
		new_user_store.on(
			'load',
			function(){
				if(this.first().raw.exception == undefined){
					// hook up the users store
					this.first().setDirty();
					users_store.add(this.first());
					users_store.sync();
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			},
			'',
			{single: true}
		);
	},

	getTokenByForumPostId: function(forumpostid){
		var forum_posts_store = Ext.data.StoreManager.lookup('forumposts');
		var forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');
		var modules_store = Ext.data.StoreManager.lookup('modules');
		var courses_store = Ext.data.StoreManager.lookup('courses');

		var discussionid = forum_posts_store.getById(forumpostid).get('discussion');
		var forumid = forum_discussions_store.getById(discussionid).get('forum');
		var courseid = modules_store.getById(forumid).get('courseid');
		var token = courses_store.getById(courseid).get('token');
		return token;
	}
});
