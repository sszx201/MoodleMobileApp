Ext.define('MoodleMobApp.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
   
		},
		control: {
			
		}
	},

	init: function(){
		// hook up the stores
		this.courses_store = Ext.data.StoreManager.lookup('courses');
		this.modules_store = Ext.data.StoreManager.lookup('modules');
		this.forum_posts_store = Ext.data.StoreManager.lookup('forumposts');
		this.forum_discussions_store = Ext.data.StoreManager.lookup('forumdiscussions');
		this.folders_store = Ext.data.StoreManager.lookup('folders');
		// user stores
		this.users_store = Ext.data.StoreManager.lookup('users');
		this.enroled_users_store = Ext.data.StoreManager.lookup('enroledusers');
		// set listener for updating the course module stats
		this.courses_store.on('write', this.updateUsersStores, this, {single:true});
		Ext.m = this;
	},

	updateUsersStores: function() {
		// -log-
		MoodleMobApp.log('UPDATING USER STORES');

		this.courses_store.each(function(course) {
			// get the enroled users
			MoodleMobApp.WebService.getEnroledUsers(course.getData()).on(
				'load',
				function(store) {
					if(store.getCount() > 0){
						var users_store_to_sync = false;
						
						// update the list of enroled users for the current course
						var course_group = this.enroled_users_store.getGroups(course.get('id').toString());
						if(typeof course_group == 'object') {
							this.enroled_users_store.remove(course_group.children);
						}
						
						store.each(function(record){
							this.enroled_users_store.add({'courseid': course.get('id'), 'userid': record.get('id')});
							// if this user is not in the store add it 
							// else 
							// if a previous entry of this user exists and has been modified
							// then updated it by removing the previous entry otherwise skip the record
							var current_user = this.users_store.getById(record.get('id'));
							if(current_user == null){
								record.setDirty();
								this.users_store.add(record);
								users_store_to_sync = true;
								// -log-
								MoodleMobApp.log('New user; username: '+record.get('username')+'; id: '+record.get('id'));
							} else if(typeof current_user == 'object' && current_user.get('timemodified') != record.get('timemodified')){
								this.users_store.getById(record.get('id')).setData(record.getData());
								this.users_store.getById(record.get('id')).setDirty();
								users_store_to_sync = true;
								// -log-
								MoodleMobApp.log('Updating user: '+record.get('username'));
							}
						}, this);	

						this.enroled_users_store.sync();

						if(users_store_to_sync) {
							this.users_store.on('write', this.updateDataStores, this, {single:true});
							this.users_store.sync();
						} else {
							this.updateDataStores();
						}
						
					}
				},
				this,
				{single: true}
			);
		}, this);
	},

	updateDataStores: function(){
		// -log-
		MoodleMobApp.log('UPDATING DATA STORES');
		// update modules
		this.courses_store.each(function(course) {
			MoodleMobApp.WebService.getCourseModules(course.getData()).on(
				'load', 
				function(mstore){
					// check if this is a new course
					var courseid = mstore.first().get('courseid');
					var is_new_course = this.courses_store.getById(courseid).get('isnew');
					var store_to_sync = false;	

					// remove from the cache the modules that have been
					// deleted from the course
					this.modules_store.queryBy(
						function(record, id){
							if(record.get('courseid') == courseid) { return true; }
						}).each(
							function(record){
								// if the record is not in the 
								if(mstore.findExact('id', record.get('id')) == -1){
									store_to_sync = true;
									this.modules_store.remove(record);
								}
							});

					// add/update new module entries
					mstore.each(function(module){
						// check if the moodle entry exists in the store
						if(this.modules_store.findExact('id', module.get('id')) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules show as new
							if(is_new_course) {
								module.set('isnew', false);	
							} else {
								module.set('isnew', true);	
							}
							module.set('isupdated', false);	
							this.modules_store.add(module);
							store_to_sync = true;
							// -log-
							MoodleMobApp.log('New module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('name'));
						} else if(this.modules_store.getById(module.get('id')).get('timemodified') != module.get('timemodified')) { // check if updated
							module.set('isnew', false);	
							module.set('isupdated', true);
							this.modules_store.getById(module.get('id')).setDirty();
							this.modules_store.getById(module.get('id')).setData(module.getData());
							store_to_sync = true;
							// -log-
							MoodleMobApp.log('Updating module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('id'));
						}
					}, this);	
					
					if(store_to_sync) { // sync the updating process with the modules_store
						this.modules_store.on('write', function() { this.updateCourseModulesCounter(courseid); }, this, {single:true});
						this.modules_store.on('write', function() { this.updateForumDiscussionsStore(courseid); }, this, {single:true});	
						this.modules_store.on('write', function() { this.updateFoldersStore(courseid); }, this, {single:true});	
						// sync
						this.modules_store.sync();
					} else { // no syncronisation needed; proceed with other updates
						this.updateCourseModulesCounter(courseid);
						this.updateForumDiscussionsStore(courseid);
						this.updateFoldersStore(courseid);
					}
				},
				this,
				{single: true}
			);
		}, this);
		
	},

	updateCourseModulesCounter: function(courseid) {
		// -log-
		MoodleMobApp.log('UPDATING MODULES STATUS FOR COURSE: '+courseid);

		// count modules
		var all_modules = this.modules_store.queryBy(function(record, id) {
			if(record.get('courseid') == courseid) {
				return true;
			}
		});
		// count updated modules
		var updated_modules = this.modules_store.queryBy(function(record, id) {
			if(record.get('courseid') == courseid && record.get('isupdated') == true) {
				return true;
			}
		});

		// count new modules
		var new_modules = this.modules_store.queryBy(function(record, id) {
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
		
		// -log-
		this.courses_store.on(
			'write',
			function(store, operation){
				MoodleMobApp.log(' --> Course '+courseid+'; modules status info updated to "'+modstat+'"');
			},
			this,
			{single:true});

		// write the stat
		this.courses_store.getById(courseid).set('modulestatus', modstat)
		this.courses_store.getById(courseid).setDirty();
		this.courses_store.sync();
	},

	updateForumDiscussionsStore: function (courseid) {
		// -log-
		MoodleMobApp.log('UPDATING FORUM DISCUSSIONS STORE FOR COURSE: '+courseid);
		var course = this.courses_store.getById(courseid);

		this.modules_store.queryBy(function(record, id){
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
						if(this.forum_discussions_store.findExact('id', discussion.get('id') ) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules marked as new
							if(is_new_course) {
								discussion.set('isnew', false);	
							} else {
								discussion.set('isnew', true);	
							}
							discussion.set('isupdated', false);	
							discussion.setDirty();
							this.forum_discussions_store.add(discussion);
							store_to_sync = true;
						// check if the discussion has been updated or not
						} else if(this.forum_discussions_store.getById(discussion.get('id')).get('timemodified') != discussion.get('timemodified')) {
							discussion.setDirty();
							discussion.set('isupdated', true);	
							this.forum_discussions_store.getById(discussion.get('id')).setData(discussion.getData());
							store_to_sync = true;
						}	
					}, this);

					// remove from the cache the discussions that have been
					// deleted from the store
					this.forum_discussions_store.queryBy(
						function(record, id){
							if(record.get('forum') == forum.get('instanceid')) { return true; } 
						}).each(
							function(record){
								// if the record is not in the 
								if(discussions.findExact('id', record.get('id')) == -1) { 
									this.forum_discussions_store.remove(record);
								}
							});

		
					if(store_to_sync) { // sync the updating process with the modules_store
						this.forum_discussions_store.on('write', function() { this.updateForumPostsStore(forum.get('instanceid'), course.get('token')); }, this, {single:true});
						// write the forum discussions store
						this.forum_discussions_store.sync();
					} else { // no syncronisation needed; proceed with other updates
						this.updateForumPostsStore(forum.get('id'), course.get('token'));
					}

				},
				this, 
				{single: true}
			);
		}, this);
	},

	updateForumPostsStore: function(forumid, token) {
		// -log-
		MoodleMobApp.log('UPDATING POSTS STORE FOR FORUM: '+forumid);

		this.forum_discussions_store.queryBy(function(record, id){
			return parseInt(record.get('forum')) == parseInt(forumid);
		}).each(function(discussion) {
			// -log-
			MoodleMobApp.log('PARSING FORUM DISCUSSION: '+discussion.get('id'));
			MoodleMobApp.WebService.getPostsByDiscussion(discussion.getData(), token).on(
				'load',
				function(posts) {
					var store_to_sync = false;
					var is_new_discussion = discussion.get('isnew');
					posts.each(function(post) {
						// if this post is new then add
						if(this.forum_posts_store.findExact('id', post.get('id') ) == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules marked as new
							if(is_new_discussion) {
								post.set('isnew', false);	
							} else {
								post.set('isnew', true);	
							}
							post.set('isupdated', false);	
							this.forum_posts_store.add(post);
							store_to_sync = true;
							// -log-
							MoodleMobApp.log('New forum post: '+post.get('id')+' in discussion: '+discussion.get('id'));
						// check if the discussion has been updated or not
						} else if(this.forum_posts_store.getById(post.get('id')).get('modified') != post.get('modified')) {
							post.set('isupdated', true);	
							this.forum_posts_store.getById(post.get('id')).setData(post.getData());
							this.forum_posts_store.getById(post.get('id')).setDirty();
							store_to_sync = true;
							// -log-
							MoodleMobApp.log('Updating forum post:'+post.get('id')+' in discussion: '+discussion.get('id'));
						}	
					}, this);

					// remove from the cache the discussions that have been
					// deleted from the store
					this.forum_posts_store.queryBy(
						function(record, id){
							return parseInt(record.get('discussion')) == parseInt(discussion.get('id'));
						}).each(
							function(record){
								// if the record is not in the 
								if(posts.findExact('id', record.get('id')) == -1) { 
									this.forum_posts_store.remove(record);
									MoodleMobApp.log('Removing forum post:'+record.get('id')+' from discussion: '+discussion.get('id'));
								}
							});
					
					// wait for the store to sync before formating the posts
					if(store_to_sync){
						console.log('AAAAA store to sync; check users for discussion:' + discussion.get('id'));
						this.forum_posts_store.on('write', function(){ console.log('AAAAAAAAAAAaaaaaaaaaaaaAAAAAAAAAA'); this.checkForNewUsers(discussion.get('id'), token);}, this, {single:true});	
						// write the forum discussions store
						this.forum_posts_store.sync();
					} else {
						console.log('BBBBB store to sync; check users for discussion:' + discussion.get('id'));
						this.checkForNewUsers(discussion.get('id'), token);
					}
				},
				this, 
				{single: true}
			);
		}, this);
	},

	checkForNewUsers: function(discussionid, token){
		// -log-
		MoodleMobApp.log('CHECKING FOR NEW USERS IN THE DISCUSSION: '+discussionid);

		var added_users = new Array();
		this.forum_posts_store.queryBy(
					function(record, id){
						if(record.get('discussion') == discussionid) { return true; }
					}).each(
						function(post){
							var user = this.users_store.getById(post.get('userid'));
							if(user == undefined && added_users.indexOf(post.get('userid')) == -1) { // avoid adding twice the same user
								// keep track of added users
								// -log-
								MoodleMobApp.log('Found new user: ' + post.get('userid'));
								added_users.push(post.get('userid'));
								this.storeUser(post.get('userid'), token);
							}			
						}, this);

		// format posts
		this.formatPosts(discussionid);
	},

	// given a userid and the course token this
	// function adds the new user to the users store
	storeUser: function(userid, token){
		// -log-
		MoodleMobApp.log('STORING USER: '+userid);

		var new_user_store = MoodleMobApp.WebService.getUserById(userid, token);
		new_user_store.on(
			'load',
			function(store){
				if(store.first().raw.exception == undefined){
					if(this.users_store.findExact('id', userid) == -1){
						store.first().setDirty();
						this.users_store.add(store.first());
						this.users_store.sync();
					}
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

	formatPosts: function(discussionid){
		// -log-
		MoodleMobApp.log('FORMATING POSTS FOR DISCUSSION: '+discussionid);

		this.forum_posts_store.queryBy(
			function(record, id){
				if(record.get('discussion') == discussionid) { return true; }
			}).each(
				function(post){
					var parentid = post.get('parent');
					if(parentid == 0) { // root post
						// set the root post depth to 0
						post.set('indentation', 0);
					} else {
						var parent_indentation = this.forum_posts_store.getById(parentid).get('indentation');
						post.set('indentation', parent_indentation + 1);
					}

					// add user info
					var user = this.users_store.getById(post.get('userid'));
					if( user != null) {
						post.set('firstname', user.get('firstname'));
						post.set('lastname', user.get('lastname'));
						post.set('avatar', user.get('avatar'));
					}
				}, this);
	},

	updateFoldersStore: function (courseid) {
		// -log-
		MoodleMobApp.log('UPDATING FOLDERS STORE FOR COURSE: '+courseid);
		var course = this.courses_store.getById(courseid);

		this.modules_store.queryBy(function(record, id){
			if(record.get('modname') == 'folder' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(folder) {
			MoodleMobApp.WebService.getFolder(folder.getData(), course.get('token')).on(
				'load',
				function(folders_content) {
					// remove from the cache the modules that have been
					// deleted from the course
					var old_entries = this.folders_store.queryBy(
						function(record, id){
							if(record.get('rootid') == folder.get('instanceid')) { return true; }
						});

					// remove old entries
					this.folders_store.remove(old_entries.all);

					folders_content.each(function(content) {
						this.folders_store.add(content);
					}, this);

					this.folders_store.sync();
				},
				this, 
				{single: true}
			);
		}, this);
	},
});
