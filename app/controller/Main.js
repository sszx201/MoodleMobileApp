Ext.define('MoodleMobApp.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			navigator: 'coursenavigator',
		},
		control: {
			navigator: {
				'updateCourse': function(course) {
					this.updateCourse(course);
				}
			}
		}
	},

	init: function(){
		// set listener for updating the course module stats
		//MoodleMobApp.Session.getCoursesStore().on('write', this.updateAllStores, this, {single:true});
		Ext.m = this;
	},

	updateCourse: function(course) {
		this.monitorUpdateStatus();
		this.updateStoresForCourse(course);
	},

	monitorUpdateStatus: function() {
		this.getNavigator().setMasked({
			xtype: 'loadmask',
			message: 'Synchronizing'
		});
		this.updateStatus = {
			'users': false,
			'groups': false,
			'groupings': false,
			'calendarEvents': false,
			'courseSections': false,
			'courseModules': false,
			'forumDiscussions': false,
			'forumPosts': false,
			'folders': false,
			'resources': false,
			'choices': false,
			'url': false,
			'pages': false,
			'gradeItems': false,
			'grades': false
		};
		var self = this;
		var interval;
		var checkUpdateStatus = function() {
			var stat = true;
			for(var key in self.updateStatus) {
				stat = stat && self.updateStatus[key];
			}

			if(stat) { // all ok
				clearInterval(interval)
				self.getNavigator().fireEvent('courseUpdated');
				self.getNavigator().setMasked();
			}
		};
		interval = setInterval(checkUpdateStatus, 200);
	},

	updateAllStores: function(){
		MoodleMobApp.Session.getCoursesStore().each(function(course){ this.updateUsersStores(course); }, this);
	},

	updateStoresForCourse: function(course){
		this.updateUsersStores(course);
	},

	updateUsersStores: function(course) {
		MoodleMobApp.WebService.getEnrolledUsers(course.getData()).on(
			'load',
			function(store) {
				//MoodleMobApp.log('UPDATING USER STORES FOR THE COURSE: '+course.get('id'));
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
						var current_user = MoodleMobApp.Session.getUsersStore().findRecord('id', record.get('id'), null, false, true, true);
						if(current_user == null) {
							record.setDirty();
							MoodleMobApp.Session.getUsersStore().add(record);
							users_store_to_sync = true;
							// MoodleMobApp.log('|I| New user; username: '+record.get('username')+'; id: '+record.get('id'));
						} else if(typeof current_user == 'object' && current_user.get('timemodified') != record.get('timemodified')) {
							MoodleMobApp.Session.getUsersStore().remove(current_user);
							MoodleMobApp.Session.getUsersStore().add(record);
							users_store_to_sync = true;
							//MoodleMobApp.log('|I| Updating user: '+record.get('username'));
						}
					}, this);	

					MoodleMobApp.Session.getEnrolledUsersStore().sync();

					if(users_store_to_sync) {
						//MoodleMobApp.log('|I| users_store is to sync');
						MoodleMobApp.Session.getUsersStore().on('write', this.updateDataStores(course), this, {single:true});
						MoodleMobApp.Session.getUsersStore().sync();
					} else {
						this.updateDataStores(course);
					}
				}
				// users updated
				this.updateStatus['users'] = true;
			},
			this,
			{single: true}
		);
	},

	updateDataStores: function(course) {
		this.updateGroups(course);
		this.updateGroupings(course);
		this.updateCalendarEvents(course);
		this.updateCourseSections(course);
		this.updateCourseModules(course);
	},

	updateGroups: function(course){
		MoodleMobApp.WebService.getGroups(course.getData(), MoodleMobApp.Session.getUser().getData()).on(
			'load',
			function(gstore){
				//MoodleMobApp.log('UPDATING COURSE GROUPS: ' + course.get('name') + '; ID: ' + course.get('id'));
				MoodleMobApp.Session.getGroupsStore().each(
					function(record){
						if(record.get('courseid') == course.get('id')) {
							MoodleMobApp.Session.getGroupsStore().remove(record);
							return true;
						}
					}
				);

				gstore.each(function(record){
					record.set('courseid', course.get('id'));
					MoodleMobApp.Session.getGroupsStore().add(record);
				});
				MoodleMobApp.Session.getGroupsStore().sync();
				// groups events updated
				this.updateStatus['groups'] = true;
			},
			this,
			{single: true}
		);
	},

	updateGroupings: function(course){
		MoodleMobApp.WebService.getGroupings(course.getData(), MoodleMobApp.Session.getUser().getData()).on(
			'load',
			function(gstore){
				//MoodleMobApp.log('UPDATING COURSE GROUPS: ' + course.get('name') + '; ID: ' + course.get('id'));
				MoodleMobApp.Session.getGroupingsStore().each(
					function(record){
						if(record.get('courseid') == course.get('id')) {
							MoodleMobApp.Session.getGroupingsStore().remove(record);
							return true;
						}
					}
				);

				gstore.each(function(record){
					record.set('courseid', course.get('id'));
					MoodleMobApp.Session.getGroupingsStore().add(record);
				});
				MoodleMobApp.Session.getGroupingsStore().sync();
				// groupings events updated
				this.updateStatus['groupings'] = true;
			},
			this,
			{single: true}
		);
	},


	updateCalendarEvents: function(course){
		MoodleMobApp.WebService.getCalendarEvents(course.getData()).on(
			'load',
			function(cstore){
				//MoodleMobApp.log('UPDATING COURSE CALENDAR EVENTS: ' + course.get('name') + '; ID: ' + course.get('id'));
				MoodleMobApp.Session.getCalendarEventsStore().each(
					function(record){
						if(record.get('courseid') == course.get('id')) {
							MoodleMobApp.Session.getCalendarEventsStore().remove(record);
							return true;
						}
					}
				);

				cstore.each(function(record){ MoodleMobApp.Session.getCalendarEventsStore().add(record); });
				MoodleMobApp.Session.getCalendarEventsStore().sync();
				// calendar events updated
				this.updateStatus['calendarEvents'] = true;
			},
			this,
			{single: true}
		);
	},

	updateCourseSections: function(course){
		MoodleMobApp.WebService.getCourseSections(course.getData()).on(
			'load',
			function(sstore){
				//MoodleMobApp.log('UPDATING COURSE SECTIONS: ' + course.get('name') + '; ID: ' + course.get('id'));
				MoodleMobApp.Session.getCourseSectionsStore().each(
					function(record){
						if(record.get('courseid') == course.get('id')) {
							MoodleMobApp.Session.getCourseSectionsStore().remove(record);
							return true;
						}
					}
				);

				sstore.each(function(record){ MoodleMobApp.Session.getCourseSectionsStore().add(record); });
				MoodleMobApp.Session.getCourseSectionsStore().sync();
				// course sections updated
				this.updateStatus['courseSections'] = true;
			},
			this,
			{single: true}
		);
	},

	updateCourseModules: function(course) {
		// update modules
		MoodleMobApp.WebService.getCourseModules(course.getData()).on(
			'load',
			function(mstore){
				//MoodleMobApp.log('UPDATING DATA STORES FOR COURSE: ' + course.get('name') + '; ID: ' + course.get('id'));
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
						}, this
					);
				// add/update new module entries
				mstore.each(function(module) {
					var local_module = MoodleMobApp.Session.getModulesStore().findRecord('id', module.get('id'), null, false, true, true);
					// check if the moodle entry exists in the store
					if(local_module == null) {
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
						//MoodleMobApp.log('|I| New module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('id'));
					} else if(local_module.get('timemodified') != module.get('timemodified') || local_module.get('section') != module.get('section')) { // check if updated or if has been moved to another section
						MoodleMobApp.Session.getModulesStore().remove(local_module);
						module.set('isnew', false);
						module.set('isupdated', true);
						MoodleMobApp.Session.getModulesStore().add(module);
						store_to_sync = true;
						//MoodleMobApp.log('|I| Updating module '+module.get('modname')+'; type:'+module.get('type')+'; name: '+module.get('name')+'; id: '+module.get('id'));
					}
				}, this);	
				
				if(store_to_sync) { // sync the updating process with the MoodleMobApp.Session.getModulesStore()
					MoodleMobApp.Session.getModulesStore().on('write', this.updateCourseModulesStats(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateForumDiscussionsStore(course), this, {single:true});	
					MoodleMobApp.Session.getModulesStore().on('write', this.updateFoldersStore(course), this, {single:true});	
					MoodleMobApp.Session.getModulesStore().on('write', this.updateResourcesStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateChoicesStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateUrlStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updatePageStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateGradeItemsStore(course), this, {single:true});
					MoodleMobApp.Session.getModulesStore().on('write', this.updateGradesStore(course), this, {single:true});
					// sync
					MoodleMobApp.Session.getModulesStore().sync();
				} else { // no syncronisation needed; proceed with other updates
					this.updateCourseModulesStats(course);
					this.updateForumDiscussionsStore(course);
					this.updateFoldersStore(course);
					this.updateResourcesStore(course);
					this.updateChoicesStore(course);
					this.updateUrlStore(course);
					this.updatePageStore(course);
					this.updateGradeItemsStore(course);
					this.updateGradesStore(course);
				}

				// course modules updated
				this.updateStatus['courseModules'] = true;
				// set the course as synchronized
				course.set('synchronized', true);
				MoodleMobApp.Session.getCoursesStore().sync();
			},
			this,
			{single: true}
		);
	},

	updateCourseModulesStats: function(course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING MODULES STATUS FOR COURSE: '+courseid);

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
		var modstat = '<img src="resources/images/check.png" /> ';
		if(updated_modules.getCount() > 0) {
			modstat+= updated_modules.getCount() + ' updated ';
		}
		if(new_modules.getCount() > 0) {
			modstat+= new_modules.getCount() + ' new ';
		}
		
		/*
		MoodleMobApp.Session.getCoursesStore().on(
			'write',
			function(store, operation){
				MoodleMobApp.log(' --> Course '+courseid+'; modules status info updated to "'+modstat+'"');
			},
			this,
			{single:true});
		*/

		// write the stat
		MoodleMobApp.Session.getCoursesStore().getById(courseid).set('modulestatus', modstat)
		MoodleMobApp.Session.getCoursesStore().sync();
	},

	updateForumDiscussionsStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING FORUM DISCUSSIONS STORE FOR COURSE: '+courseid);

		var forums = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'forum' && record.get('courseid') == courseid) {
				return true;
			}
		});
		if(forums.length > 0) {
			var forum_counter = 1;
			forums.each(function(forum) {
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
									if(discussions.findExact('id', record.get('id')) == -1) {
										MoodleMobApp.Session.getForumDiscussionsStore().remove(record);
									}
								});

						var is_new_course = course.get('isnew');
						var store_to_sync = false;
						discussions.each(function(discussion) {
							var local_discussion = MoodleMobApp.Session.getForumDiscussionsStore().findRecord('id', discussion.get('id'), null, false, true, true);
							// if this discussion is new then add
							if(local_discussion == null) {
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
							} else if(local_discussion.get('timemodified') != discussion.get('timemodified')) {
								MoodleMobApp.Session.getForumDiscussionsStore().remove(local_discussion);
								discussion.set('isnew', false);
								discussion.set('isupdated', true);
								MoodleMobApp.Session.getForumDiscussionsStore().add(discussion);
								store_to_sync = true;
							}
							this.updateForumPostsStore(discussion, course.get('token'));
						}, this);

						if(store_to_sync) {
							MoodleMobApp.Session.getForumDiscussionsStore().sync();
						}

						if(forum_counter == forums.length) {
							this.updateStatus['forumDiscussions'] = true;
							this.updateStatus['forumPosts'] = true;
						} else {
							++forum_counter;
						}
						// forum discussions updated
					},
					this,
					{single: true}
				);
			}, this);
		} else {
			this.updateStatus['forumDiscussions'] = true;
			this.updateStatus['forumPosts'] = true;
		}
	},

	updateForumPostsStore: function(discussion, token) {

		var discussionid = discussion.get('id');

		MoodleMobApp.WebService.getPostsByDiscussion(discussion.getData(), token).on(
			'load',
			function(posts) {
				//MoodleMobApp.log('UPDATING POSTS STORE FOR DISCUSSION: '+discussionid);
				var store_to_sync = false;
				var is_new_discussion = discussion.get('isnew');
				posts.each(function(post) {
					var local_post = MoodleMobApp.Session.getForumPostsStore().findRecord('id', post.get('id'), null, false, true, true);
					// if this post is new then add
					if(local_post == null) {
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
						//MoodleMobApp.log('|I| New forum post: '+post.get('id')+' in discussion: '+discussionid);
					// check if the discussion has been updated or not
					} else if(local_post.get('modified') != post.get('modified')) {
						MoodleMobApp.Session.getForumPostsStore().remove(local_post);
						post.set('isnew', false);
						post.set('isupdated', true);
						MoodleMobApp.Session.getForumPostsStore().add(post);
						store_to_sync = true;
						//MoodleMobApp.log('|I| Updating forum post:'+post.get('id')+' in discussion: '+discussionid);
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
								//MoodleMobApp.log('|I| Removing forum post:'+record.get('id')+' from discussion: '+discussionid);
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
		//MoodleMobApp.log('CHECKING FOR NEW USERS IN THE DISCUSSION: '+discussionid);

		var added_users = new Array();
		MoodleMobApp.Session.getForumPostsStore().queryBy(
					function(record, id){
						if(record.get('discussion') == discussionid) { return true; }
					}).each(
						function(post){
							var user = MoodleMobApp.Session.getUsersStore().findRecord('id', post.get('userid'), null, false, true, true);
							if(user == null && added_users.indexOf(post.get('userid')) == -1) { // avoid adding twice the same user
								//MoodleMobApp.log('|I| Found new user: ' + post.get('userid'));
								// keep track of added users
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
		//MoodleMobApp.log('STORING USER: '+userid);

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
		//MoodleMobApp.log('FORMATING POSTS FOR DISCUSSION: '+discussionid);

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
						var parent_post = MoodleMobApp.Session.getForumPostsStore().findRecord('id', parentid, null, false, true, true);
						var parent_indentation = parent_post.get('indentation');
						post.set('indentation', parent_indentation + 1);
					}

					// add user info
					var user = MoodleMobApp.Session.getUsersStore().findRecord('id', post.get('userid'), null, false, true, true);
					if( user != null) {
						post.set('firstname', user.get('firstname'));
						post.set('lastname', user.get('lastname'));
						post.set('avatar', user.get('avatar'));
					}
				}, this);
	},

	updateFoldersStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING FOLDERS STORE FOR COURSE: '+courseid);

		var folders = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'folder' && record.get('courseid') == courseid) {
				return true;
			}
		});
		if(folders.length > 0) {
			var folder_counter = 1;
			folders.each(function(folder) {
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

						if(folder_counter == folders.length) {
							// folders updated
							this.updateStatus['folders'] = true;
						} else {
							++folder_counter;
						}
					},
					this,
					{single: true}
				);
			}, this);
		} else {
			// no folders to update
			this.updateStatus['folders'] = true;
		}
	},

	updateResourcesStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING RESOURCES STORE FOR COURSE: '+courseid);

		var resources = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'resource' && record.get('courseid') == courseid) {
				return true;
			}
		});

		if(resources.length > 0){
			var resource_counter = 1;
			resources.each(function(resource) {
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

						if(resource_counter == resources.length) {
							// resources updated
							this.updateStatus['resources'] = true;
						} else {
							++resource_counter;
						}
					},
					this,
					{single: true}
				);
			}, this);
		} else {
			// resources updated
			this.updateStatus['resources'] = true;
		}
	},

	updateChoicesStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING CHOICES STORE FOR COURSE: '+courseid);

		var choices = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'choice' && record.get('courseid') == courseid) {
				return true;
			}
		});
		if(choices.length > 0) {
			var choice_counter = 1;
			choices.each(function(choice) {
				MoodleMobApp.WebService.getChoice(choice.getData(), course.get('token')).on(
					'load',
					function(response) {
						var previous_record = MoodleMobApp.Session.getChoicesStore().findRecord('id', response.first().get('id'));

						if(previous_record == null) { // add the new choice; this choice has not been recorded previously
							response.first().setDirty();
							MoodleMobApp.Session.getChoicesStore().add(response.first());
						} else if(previous_record.get('timemodified') != response.first().get('timemodified')) { // choice modified; drop the old one
							MoodleMobApp.Session.getChoicesStore().remove(previous_record);
							response.first().setDirty();
							MoodleMobApp.Session.getChoicesStore().add(response.first());
						}
					},
					this,
					{single: true}
				);

				if(choice_counter == choices.length) {
					// choices updated
					this.updateStatus['choices'] = true;
				} else {
					++choice_counter;
				}

			}, this);
		} else {
			// choices updated
			this.updateStatus['choices'] = true;
		}
	},

	updateUrlStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING URL STORE FOR COURSE: '+courseid);

		var urls = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'url' && record.get('courseid') == courseid) {
				return true;
			}
		});
		if(urls.length > 0) {
			var url_counter = 1;
			urls.each(function(url) {
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

				if(url_counter == urls.length) {
					// urls updated
					this.updateStatus['url'] = true;
				} else {
					++url_counter;
				}

			}, this);
		} else {
			this.updateStatus['url'] = true;
		}
	},

	updatePageStore: function (course) {
		var courseid = course.get('id');
		//MoodleMobApp.log('UPDATING PAGE STORE FOR COURSE: '+courseid);

		var pages = MoodleMobApp.Session.getModulesStore().queryBy(function(record, id){
			if(record.get('modname') == 'page' && record.get('courseid') == courseid) {
				return true;
			}
		});
		if(pages.length) {
			var page_counter = 1;
			pages.each(function(page) {
				MoodleMobApp.WebService.getPage(page.getData(), course.get('token')).on(
					'load',
					function(response) {
						var previous_record = MoodleMobApp.Session.getPageStore().findRecord('id', response.first().get('id'));

						if(previous_record == null) { // add the new page; this page has not been recorded previously
							response.first().setDirty();
							MoodleMobApp.Session.getPageStore().add(response.first());
						} else if(previous_record.get('timemodified') != response.first().get('timemodified')) { // page modified; drop the old one
							MoodleMobApp.Session.getPageStore().remove(previous_record);
							response.first().setDirty();
							MoodleMobApp.Session.getPageStore().add(response.first());
						}
					},
					this,
					{single: true}
				);

				if(page_counter == pages.length) {
					// pages updated
					this.updateStatus['pages'] = true;
				} else {
					++page_counter;
				}

			}, this);
		} else {
			this.updateStatus['pages'] = true;
		}
	},

	updateGradeItemsStore: function (course, token) {
		//MoodleMobApp.log('UPDATING GRADEITEMS STORE');

		//var user = MoodleMobApp.Session.getUsersStore().findRecord('username', MoodleMobApp.Session.getUsername(), null, false, true, true);

		MoodleMobApp.WebService.getGradeItems(course.getData(), course.get('token')).on(
			'load',
			function(response) {
				var store_to_sync = false;
				// remove from the cache the gradeitems of the modules that have been
				// deleted from the course
				MoodleMobApp.Session.getGradeItemsStore().queryBy(
					function(record) {
						// if the record is not in the 
						if(MoodleMobApp.Session.getGradeItemsStore().findExact('id', record.get('id')) == -1){
							store_to_sync = true;
							MoodleMobApp.Session.getGradeItemsStore().remove(record);
						}
					}, this);
				
				// add/update new gradeitem entries
				response.each(function(gradeitem) {
					var local_grade = MoodleMobApp.Session.getGradeItemsStore().findRecord('id', gradeitem.get('id'), null, false, true, true);
					// check if the moodle entry exists in the store
					if(local_grade == null) {
						// don't set 'new' flag in the gradeitem entries of the new courses
						// avoid having new courses with all gradeitems show as new
						gradeitem.set('isnew', true);
						gradeitem.set('isupdated', false);
						MoodleMobApp.Session.getGradeItemsStore().add(gradeitem);
						store_to_sync = true;
						//MoodleMobApp.log('|I| New gradeitem '+gradeitem.get('itemname')+'; type:'+gradeitem.get('type'));
					} else if(local_grade.get('timemodified') != gradeitem.get('timemodified')) { // check if updated
						MoodleMobApp.Session.getGradeItemsStore().remove(local_grade);
						gradeitem.set('isnew', false);
						gradeitem.set('isupdated', true);
						MoodleMobApp.Session.getGradeItemsStore().add(gradeitem);
						store_to_sync = true;
						//MoodleMobApp.log('|I| Updating gradeitem '+gradeitem.get('itemname')+'; type:'+gradeitem.get('type'));
					}
				});
				// sync
				if(store_to_sync) { MoodleMobApp.Session.getGradeItemsStore().sync(); }
				// update grade items status
				this.updateStatus['gradeItems'] = true;
			},
			this,
			{single: true}
		);
	},

	updateGradesStore: function (course, token) {
		//MoodleMobApp.log('UPDATING GRADES STORE');

		//var user = MoodleMobApp.Session.getUsersStore().findRecord('username', MoodleMobApp.Session.getUsername(), null, false, true, true);

		MoodleMobApp.WebService.getGrades(course.getData(), course.get('token')).on(
			'load',
			function(response) {
				var store_to_sync = false;
				// remove from the cache the gradeitems of the modules that have been
				// deleted from the course
				MoodleMobApp.Session.getGradesStore().queryBy(
					function(record) {
						// if the record is not in the 
						if(MoodleMobApp.Session.getGradesStore().findExact('id', record.get('id')) == -1){
							store_to_sync = true;
							MoodleMobApp.Session.getGradesStore().remove(record);
						}
					}, this);
				
				// add/update new gradeitem entries
				response.each(function(gradeitem) {
					var local_grade = MoodleMobApp.Session.getGradesStore().findRecord('id', gradeitem.get('id'), null, false, true, true);
					// check if the moodle entry exists in the store
					if(local_grade == null) {
						// don't set 'new' flag in the gradeitem entries of the new courses
						// avoid having new courses with all gradeitems show as new
						gradeitem.set('isnew', true);
						gradeitem.set('isupdated', false);
						MoodleMobApp.Session.getGradesStore().add(gradeitem);
						store_to_sync = true;
						//MoodleMobApp.log('|I| New grade for item: '+grade.get('itemid')+'; gradeitem:'+gradeitem.get('rawgradeitem'));
					} else if(local_grade.get('timemodified') != gradeitem.get('timemodified')) { // check if updated
						MoodleMobApp.Session.getGradesStore().remove(local_grade);
						gradeitem.set('isnew', false);
						gradeitem.set('isupdated', true);
						MoodleMobApp.Session.getGradesStore().add(gradeitem);
						store_to_sync = true;
						//MoodleMobApp.log('|I| Updating gradeitem '+gradeitem.get('modname')+'; type:'+gradeitem.get('type')+'; name: '+gradeitem.get('name')+'; id: '+gradeitem.get('id'));
					}
				});
				// sync
				if(store_to_sync) { MoodleMobApp.Session.getGradesStore().sync(); }
				// update grades status
				this.updateStatus['grades'] = true;
			},
			this,
			{single: true}
		);
	},
});
