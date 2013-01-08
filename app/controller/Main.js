Ext.define('MoodleMobApp.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
   
		},
		control: {
			
		}
	},

	init: function(){
		// set listener for updating the course module stats
		MoodleMobApp.Session.getCoursesStore().on('write', this.updateAllStores, this, {single:true});
		Ext.m = this;
	},

	updateAllStores: function(){
		MoodleMobApp.Session.getCoursesStore().each(function(course){ this.updateUsersStores(course); }, this);
	},

	updateUsersStores: function(course) {

		MoodleMobApp.WebService.getEnrolledUsers(course.getData()).on(
			'load',
			function(store) {
				// -log-
				MoodleMobApp.log('UPDATING USER STORES FOR THE COURSE: '+course.get('id'));
				if(store.getCount() > 0){
					var users_store_to_sync = false;
					
					// update the list of enrolled users for the current course
					var course_group = MoodleMobApp.Session.getEnrolledUsersStore().getGroups(course.get('id').toString());
					if(typeof course_group == 'object') {
						MoodleMobApp.Session.getEnrolledUsersStore().remove(course_group.children);
					}
					
					store.each(function(record){
						MoodleMobApp.Session.getEnrolledUsersStore().add({'courseid': course.get('id'), 'userid': record.get('id')});
						// if this user is not in the store add it 
						// else 
						// if a previous entry of this user exists and has been modified
						// then updated it by removing the previous entry otherwise skip the record
						var current_user = MoodleMobApp.Session.getUsersStore().getById(record.get('id'));
						if(current_user == null){
							record.setDirty();
							MoodleMobApp.Session.getUsersStore().add(record);
							users_store_to_sync = true;
							// -log-
							MoodleMobApp.log('|I| New user; username: '+record.get('username')+'; id: '+record.get('id'));
						} else if(typeof current_user == 'object' && current_user.get('timemodified') != record.get('timemodified')){
							MoodleMobApp.Session.getUsersStore().getById(record.get('id')).setData(record.getData());
							MoodleMobApp.Session.getUsersStore().getById(record.get('id')).setDirty();
							users_store_to_sync = true;
							// -log-
							MoodleMobApp.log('|I| Updating user: '+record.get('username'));
						}
					}, this);	

					MoodleMobApp.Session.getEnrolledUsersStore().sync();

					if(users_store_to_sync) {
						MoodleMobApp.log('|I| users_store is to sync');
						MoodleMobApp.Session.getUsersStore().on('write', this.updateDataStores(course), this, {single:true});
						MoodleMobApp.Session.getUsersStore().sync();
					} else {
						this.updateDataStores(course);
					}
					
				}
			},
			this,
			{single: true}
		);
	},

	updateDataStores: function(course){
		var mstore = MoodleMobApp.WebService.getCourseModules(course.getData());
		
		// update modules
		MoodleMobApp.WebService.getCourseModules(course.getData()).on(
			'load', 
			function(mstore){
				// -log-
				MoodleMobApp.log('UPDATING DATA STORES FOR COURSE: ' + course.get('name') + '; ID: ' + course.get('id'));
				// check if this is a new course
				var courseid = course.get('id');
				var is_new_course = course.get('isnew');
				var store_to_sync = false;	

				// remove from the cache the modules that have been
				// deleted from the course
				MoodleMobApp.Session.getModulesStore().queryBy(
					function(record, id){
						if(record.get('courseid') == courseid) { return true; }
					}).each(
						function(record){
							// if the record is not in the 
							if(mstore.findExact('id', record.get('id')) == -1){
								store_to_sync = true;
								MoodleMobApp.Session.getModulesStore().remove(record);
							}
						}, this);

				// add/update new module entries
				mstore.each(function(module){
					var index = MoodleMobApp.Session.getModulesStore().findExact('id', module.get('id'));
					// check if the moodle entry exists in the store
					if(index == -1) {
						// don't set 'new' flag in the module entries of the new courses
						// avoid having new courses with all modules show as new
						if(is_new_course) {
							module.set('isnew', false);	
						} else {
							module.set('isnew', true);	
						}
						module.set('isupdated', false);	
						MoodleMobApp.Session.getModulesStore().add(module);
						store_to_sync = true;
						// -log-
						MoodleMobApp.log('|I| New module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('id'));
					} else if(MoodleMobApp.Session.getModulesStore().getAt(index).get('timemodified') != module.get('timemodified')) { // check if updated
						MoodleMobApp.Session.getModulesStore().getAt(index).set('name', module.get('name'));
						MoodleMobApp.Session.getModulesStore().getAt(index).set('intro', module.get('intro'));
						MoodleMobApp.Session.getModulesStore().getAt(index).set('timemodified', module.get('timemodified'));
						MoodleMobApp.Session.getModulesStore().getAt(index).set('isnew', false);
						MoodleMobApp.Session.getModulesStore().getAt(index).set('isupdated', true);
						store_to_sync = true;
						// -log-
						MoodleMobApp.log('|I| Updating module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('id'));
					}
				}, this);	
				
				if(store_to_sync) { // sync the updating process with the MoodleMobApp.Session.getModulesStore()
					MoodleMobApp.Session.getModulesStore().on('write', this.updateCourseModulesStats(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateForumDiscussionsStore(course), this, {single:true});	
					MoodleMobApp.Session.getModulesStore().on('write', this.updateFoldersStore(course), this, {single:true});	
					MoodleMobApp.Session.getModulesStore().on('write', this.updateResourcesStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateUrlStore(course), this, {single:true});
					// sync
					MoodleMobApp.Session.getModulesStore().sync();
				} else { // no syncronisation needed; proceed with other updates
					this.updateCourseModulesStats(course);
					this.updateForumDiscussionsStore(course);
					this.updateFoldersStore(course);
					this.updateResourcesStore(course);
					this.updateUrlStore(course);
				}
			},
			this,
			{single: true}
		);
	},

	updateCourseModulesStats: function(course) {
		var courseid = course.get('id');
		// -log-
		MoodleMobApp.log('UPDATING MODULES STATUS FOR COURSE: '+courseid);

		// count modules
		var all_modules = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id) {
			if(record.get('courseid') == courseid) {
				return true;
			}
		});
		// count updated modules
		var updated_modules = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id) {
			if(record.get('courseid') == courseid && record.get('isupdated') == true) {
				return true;
			}
		});

		// count new modules
		var new_modules = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id) {
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
		MoodleMobApp.Session.getCoursesStore().on(
			'write',
			function(store, operation){
				MoodleMobApp.log(' --> Course '+courseid+'; modules status info updated to "'+modstat+'"');
			},
			this,
			{single:true});

		// write the stat
		MoodleMobApp.Session.getCoursesStore().getById(courseid).set('modulestatus', modstat)
		MoodleMobApp.Session.getCoursesStore().sync();
	},

	updateForumDiscussionsStore: function (course) {
		var courseid = course.get('id');
		// -log-
		MoodleMobApp.log('UPDATING FORUM DISCUSSIONS STORE FOR COURSE: '+courseid);

		MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'forum' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(forum) {
			MoodleMobApp.WebService.getForumDiscussions(forum.getData(), course.get('token')).on(
				'load',
				function(discussions) {
					// remove from the cache the discussions that have been
					// deleted from the store
					MoodleMobApp.Session.getForumDiscussionsStore().queryBy(
						function(record, id){
							if(record.get('forum') === forum.get('instanceid')) { return true; } 
						}).each(
							function(record){
								// if the record is not in the 
								if(discussions.findExact('id', record.get('id')) == -1) { 
									MoodleMobApp.Session.getForumDiscussionsStore().remove(record);
								}
							});

					var is_new_course = course.get('isnew');
					var store_to_sync = false;
					discussions.each(function(discussion) {
						var index = MoodleMobApp.Session.getForumDiscussionsStore().findExact('id', discussion.get('id'));
						// if this discussion is new then add
						if(index == -1) {
							// don't set 'new' flag in the module entries of the new courses
							// avoid having new courses with all modules marked as new
							if(is_new_course) {
								discussion.set('isnew', false);	
							} else {
								discussion.set('isnew', true);
							}
							discussion.set('isupdated', false);	
							MoodleMobApp.Session.getForumDiscussionsStore().add(discussion);
							store_to_sync = true;
						// check if the discussion has been updated or not
						} else if(MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).get('timemodified') != discussion.get('timemodified')) {
							MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).set('name', discussion.get('name'));
							MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).set('groupid', discussion.get('groupid'));
							MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).set('timemodified', discussion.get('timemodified'));
							MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).set('isnew', false);
							MoodleMobApp.Session.getForumDiscussionsStore().getAt(index).set('isupdated', true);
							store_to_sync = true;
						}
						this.updateForumPostsStore(discussion, course.get('token'));
					}, this);
		
					if(store_to_sync) { 
						MoodleMobApp.Session.getForumDiscussionsStore().sync();
					} 
				},
				this, 
				{single: true}
			);
		}, this);
	},

	updateForumPostsStore: function(discussion, token) {

		var discussionid = discussion.get('id');

		MoodleMobApp.WebService.getPostsByDiscussion(discussion.getData(), token).on(
			'load',
			function(posts) {
				// -log-
				MoodleMobApp.log('UPDATING POSTS STORE FOR DISCUSSION: '+discussionid);
				var store_to_sync = false;
				var is_new_discussion = discussion.get('isnew');
				posts.each(function(post) {
					var index = MoodleMobApp.Session.getForumPostsStore().findExact('id', post.get('id'));
					// if this post is new then add
					if(index == -1) {
						// don't set 'new' flag in the module entries of the new courses
						// avoid having new courses with all modules marked as new
						if(is_new_discussion) {
							post.set('isnew', false);	
						} else {
							post.set('isnew', true);	
						}
						post.set('isupdated', false);	
						MoodleMobApp.Session.getForumPostsStore().add(post);
						store_to_sync = true;
						// -log-
						MoodleMobApp.log('|I| New forum post: '+post.get('id')+' in discussion: '+discussionid);
					// check if the discussion has been updated or not
					} else if(MoodleMobApp.Session.getForumPostsStore().getAt(index).get('modified') != post.get('modified')) {
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('subject', post.get('subject'));
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('message', post.get('message'));
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('modified', post.get('modified'));
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('attachments', post.get('attachments'));
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('isnew', false);
						MoodleMobApp.Session.getForumPostsStore().getAt(index).set('isupdated', true);
						store_to_sync = true;
						// -log-
						MoodleMobApp.log('|I| Updating forum post:'+post.get('id')+' in discussion: '+discussionid);
					}	
				}, this);

				// remove from the cache the discussions that have been
				// deleted from the store
				MoodleMobApp.Session.getForumPostsStore().queryBy(
					function(record, id){
						return parseInt(record.get('discussion')) == parseInt(discussionid);
					}).each(
						function(record){
							// if the record is not in the 
							if(posts.findExact('id', record.get('id')) == -1) { 
								MoodleMobApp.Session.getForumPostsStore().remove(record);
								MoodleMobApp.log('|I| Removing forum post:'+record.get('id')+' from discussion: '+discussionid);
							}
						});
				
				// wait for the store to sync before formating the posts
				if(store_to_sync){
					MoodleMobApp.Session.getForumPostsStore().on('write', this.checkForNewUsers(discussionid, token), this, {single:true});	
					// write the forum discussions store
					MoodleMobApp.Session.getForumPostsStore().sync();
				} else {
					this.checkForNewUsers(discussionid, token);
				}
			},
			this, 
			{single: true}
		);
	},

	checkForNewUsers: function(discussionid, token){
		// -log-
		MoodleMobApp.log('CHECKING FOR NEW USERS IN THE DISCUSSION: '+discussionid);

		var added_users = new Array();
		MoodleMobApp.Session.getForumPostsStore().queryBy(
					function(record, id){
						if(record.get('discussion') == discussionid) { return true; }
					}).each(
						function(post){
							var user = MoodleMobApp.Session.getUsersStore().getById(post.get('userid'));
							if(user == undefined && added_users.indexOf(post.get('userid')) == -1) { // avoid adding twice the same user
								// keep track of added users
								// -log-
								MoodleMobApp.log('|I| Found new user: ' + post.get('userid'));
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
					if(MoodleMobApp.Session.getUsersStore().findExact('id', userid) == -1){
						store.first().setDirty();
						MoodleMobApp.Session.getUsersStore().add(store.first());
						MoodleMobApp.Session.getUsersStore().sync();
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

		MoodleMobApp.Session.getForumPostsStore().queryBy(
			function(record, id){
				if(record.get('discussion') == discussionid) { return true; }
			}).each(
				function(post){
					var parentid = post.get('parent');
					if(parentid == 0) { // root post
						// set the root post depth to 0
						post.set('indentation', 0);
					} else {
						var parent_position = MoodleMobApp.Session.getForumPostsStore().findExact('id', parentid);
						var parent_indentation = MoodleMobApp.Session.getForumPostsStore().getAt(parent_position).get('indentation');
						post.set('indentation', parent_indentation + 1);
					}

					// add user info
					var user = MoodleMobApp.Session.getUsersStore().getById(post.get('userid'));
					if( user != null) {
						post.set('firstname', user.get('firstname'));
						post.set('lastname', user.get('lastname'));
						post.set('avatar', user.get('avatar'));
					}
				}, this);
	},

	updateFoldersStore: function (course) {
		var courseid = course.get('id');
		// -log-
		MoodleMobApp.log('UPDATING FOLDERS STORE FOR COURSE: '+courseid);

		MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'folder' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(folder) {
			MoodleMobApp.WebService.getFolder(folder.getData(), course.get('token')).on(
				'load',
				function(folders_content) {
					// remove from the cache the modules that have been
					// deleted from the course
					var old_entries = MoodleMobApp.Session.getFoldersStore().queryBy(
						function(record, id){
							if(record.get('rootid') == folder.get('instanceid')) { return true; }
						});

					// remove old entries
					MoodleMobApp.Session.getFoldersStore().remove(old_entries.all);

					folders_content.each(function(entry) {
						MoodleMobApp.Session.getFoldersStore().add(entry);
					}, this);

					MoodleMobApp.Session.getFoldersStore().sync();
				},
				this, 
				{single: true}
			);
		}, this);
	},

	updateResourcesStore: function (course) {
		var courseid = course.get('id');
		// -log-
		MoodleMobApp.log('UPDATING RESOURCES STORE FOR COURSE: '+courseid);

		MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'resource' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(resource) {
			MoodleMobApp.WebService.getResource(resource.getData(), course.get('token')).on(
				'load',
				function(response) {
					var previous_record = MoodleMobApp.Session.getResourcesStore().findRecord('id', response.first().get('id'));

					if(previous_record == null) { // add the new resource; this resource has not been recorded previously
						response.first().setDirty();
						MoodleMobApp.Session.getResourcesStore().add(response.first());
					} else if(previous_record.get('timemodified') != response.first().get('timemodified')) { // resource modified; drop the old one
						MoodleMobApp.Session.getResourcesStore().remove(previous_record);
						response.first().setDirty();
						MoodleMobApp.Session.getResourcesStore().add(response.first());
					}
				},
				this,
				{single: true}
			);
		}, this);
	},

	updateUrlStore: function (course) {
		var courseid = course.get('id');
		// -log-
		MoodleMobApp.log('UPDATING URL STORE FOR COURSE: '+courseid);

		MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'url' && record.get('courseid') == courseid) {
				return true;
			}
		}).each(function(url) {
			MoodleMobApp.WebService.getUrl(url.getData(), course.get('token')).on(
				'load',
				function(response) {
					var previous_record = MoodleMobApp.Session.getUrlStore().findRecord('id', response.first().get('id'));

					if(previous_record == null) { // add the new url; this url has not been recorded previously
						response.first().setDirty();
						MoodleMobApp.Session.getUrlStore().add(response.first());
					} else if(previous_record.get('timemodified') != response.first().get('timemodified')) { // url modified; drop the old one
						MoodleMobApp.Session.getUrlStore().remove(previous_record);
						response.first().setDirty();
						MoodleMobApp.Session.getUrlStore().add(response.first());
					}
				},
				this,
				{single: true}
			);
		}, this);
	},
});
