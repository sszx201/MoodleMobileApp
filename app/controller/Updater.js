Ext.define('MoodleMobApp.controller.Updater', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			navigator: 'coursenavigator'
		},
		control: {
			navigator: {
				'updateCourse': function(course) {
					this.updateCourse(course);
				}
			}
		}
	},

	init: function() {
		// set listener for updating the course module stats
		Ext.m = this;
	},

	updateCourse: function(course) {
		if(MoodleMobApp.app.isConnectionAvailable()) {
			MoodleMobApp.app.showLoadMask('Synchronizing');
			Ext.Ajax.request({
				url: MoodleMobApp.Config.getWebServiceUrl(),
				disableCaching: false,
				method: 'GET',
				scope: this,
				params: {
					wsfunction: 'uniappws_get_course',
					wstoken: course.get('token'),
					moodlewsrestformat: 'json',
					courseid: course.get('id'),
					lastaccess: course.get('lastaccess')
				},
				success: function(response, opts) {
					var data = Ext.decode(response.responseText);
					if(data.exception == undefined) {
						this.updateCourseModulesStore(course, data);
						this.updateCourseSectionsStore(course, data.course_sections);
						this.updateRecentActivityStore(course, data.recent_activity);
						this.updateCalendarEventsStore(course, data.calendar_events);
						this.updateUsers(course, data.users);
						this.updateForumDiscussionsStore(course, data.forum_discussions);
						this.updateForumPostsStore(course, data.forum_posts);
						this.updateChoicesStore(course, data.choices);
						this.updateFoldersStore(course, data.folders);
						this.updateResourcesStore(course, data.resources);
						this.updateUrlStore(course, data.url);
						this.updatePagesStore(course, data.pages);
						this.updateBooksStore(course, data.books);
						this.updateGroups(course, data.groups);
						this.updateGroupings(course, data.grupings);
						this.updateGradeItemsStore(course, data.grade_items);
						this.updateGradesStore(course, data.grades);
						this.updateCourseSyncStatus(course);

						// update complete
						this.getNavigator().fireEvent('courseUpdated');
						MoodleMobApp.app.hideLoadMask();
					} else {
						MoodleMobApp.app.hideLoadMask();
						Ext.Msg.alert(
						'Exception: ' + data.exception,
						'Error: ' + data.message,
						function() {
							MoodleMobApp.app.getController('CourseNavigator').showSettings();
						});
					}
				},
				failure: function(response, opts) {
					MoodleMobApp.app.hideLoadMask();
					Ext.Msg.alert(
						'Update request failed',
						'Response status: ' + response.status
					);
				}
			});
		}
	},

	updateUsers: function(course, data) {
		if(data.length > 0) {
			var users_store_to_sync = false;
			// update the list of enrolled users for the current course
			var course_group = MoodleMobApp.Session.getEnrolledUsersStore().getGroups(course.get('id').toString());
			if(typeof course_group == 'object') {
				MoodleMobApp.Session.getEnrolledUsersStore().remove(course_group.children);
			}

			Ext.each(data, function(record) {
				MoodleMobApp.Session.getEnrolledUsersStore().add({'courseid': course.get('id'), 'userid': record.id});
				// if this user is not in the store add it
				// else
				// if a previous entry of this user exists and has been modified
				// then updated it by removing the previous entry otherwise skip the record
				var current_user = MoodleMobApp.Session.getUsersStore().findRecord('id', record.id, null, false, true, true);
				if(current_user == null) {
					MoodleMobApp.Session.getUsersStore().add(record);
					users_store_to_sync = true;
				} else if(typeof current_user == 'object' && current_user.get('timemodified') != record.timemodified) {
					MoodleMobApp.Session.getUsersStore().remove(current_user);
					MoodleMobApp.Session.getUsersStore().add(record);
					users_store_to_sync = true;
				}
			}, this);

			MoodleMobApp.Session.getEnrolledUsersStore().sync();

			if(users_store_to_sync) {
				MoodleMobApp.Session.getUsersStore().sync();
			}
		}
	},

	updateGroups: function(course, data) {
		MoodleMobApp.Session.getGroupsStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getGroupsStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) {
			record.courseid = course.get('id');
			MoodleMobApp.Session.getGroupsStore().add(record);
		});
		MoodleMobApp.Session.getGroupsStore().sync();
	},

	updateGroupings: function(course, data) {
		MoodleMobApp.Session.getGroupingsStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getGroupingsStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) {
			record.courseid = course.get('id');
			MoodleMobApp.Session.getGroupingsStore().add(record);
		});
		MoodleMobApp.Session.getGroupingsStore().sync();
	},

	updateRecentActivityStore: function(course, data) {
		MoodleMobApp.Session.getRecentActivitiesStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
						MoodleMobApp.Session.getRecentActivitiesStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) {
			MoodleMobApp.Session.getRecentActivitiesStore().add(record);
		});
		MoodleMobApp.Session.getRecentActivitiesStore().sync();
	},

	updateCalendarEventsStore: function(course, data) {
		MoodleMobApp.Session.getCalendarEventsStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getCalendarEventsStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) { MoodleMobApp.Session.getCalendarEventsStore().add(record); });
		MoodleMobApp.Session.getCalendarEventsStore().sync();
	},

	updateCourseSectionsStore: function(course, data) {
		MoodleMobApp.Session.getCourseSectionsStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getCourseSectionsStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) { MoodleMobApp.Session.getCourseSectionsStore().add(record); });
		MoodleMobApp.Session.getCourseSectionsStore().sync();
	},

	updateCourseModulesStore: function(course, update) {
		// remove from the cache the modules that have been
		// deleted from the course
		var courseid = course.get('id');
		MoodleMobApp.Session.getModulesStore().queryBy(
			function(record, id) {
				if(record.get('courseid') == courseid) { return true; }
			}).each(
				function(record) {
					var record_removed = true;
					for(var i=0; i < update.course_modules.length; ++i) {
						if(update.course_modules[i].id == record.get('id')) {
							record_removed = false;
							break;
						}
					}
					// purge record if removed
					if(record_removed) {
						console.log('CourseModule record removed');
						console.log(record.getData());
						switch(record.get('modname')) {
							case 'forum':
								this.removeForumEntry(record.get('instanceid'));
							break;
							case 'choice':
								this.removeChoiceEntry(record.get('instanceid'));
							break;
							case 'url':
								this.removeUrlEntry(record.get('instanceid'));
							break;
							case 'page':
								this.removePageEntry(record.get('instanceid'));
							break;
							case 'resource':
								this.removeResourceEntry(record.get('instanceid'), course);
							break;
							case 'folder':
								this.removeFolderEntry(record.get('instanceid'), course);
							break;
							case 'book':
								this.removeBookEntry(record.get('instanceid'));
							break;
						}
						MoodleMobApp.Session.getModulesStore().remove(record);
					}
				}, this
			);

		Ext.each(update.course_modules, function(record) {
			var stored_record = MoodleMobApp.Session.getModulesStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				MoodleMobApp.Session.getModulesStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified || stored_record.get('visible') != record.visible) {
				MoodleMobApp.Session.getModulesStore().remove(stored_record);
				MoodleMobApp.Session.getModulesStore().add(record);
			}
		});
		MoodleMobApp.Session.getModulesStore().sync();
	},

	updateCourseSyncStatus: function(course) {
		// create the stat
		var modstat = '<img src="resources/images/check.png" /> ';
		course.set('synchronized', true);
		course.set('showrecentactivity', true);
		MoodleMobApp.Session.getCoursesStore().getById(course.get('id')).set('modulestatus', modstat)
		MoodleMobApp.Session.getCoursesStore().sync();
	},

	updateForumDiscussionsStore: function(course, data) {
		// purge the removed discussions
		MoodleMobApp.Session.getForumDiscussionsStore().each(
				function(record) {
					if(record.get('course') == course.get('id')) {
						var record_removed = true;
						for(var i=0; i < data.length; ++i) {
							if(data[i].id == record.get('id')) {
								record_removed = false;
								break;
							}
						}
						// purge record if removed
						if(record_removed) {
							console.log('Discussion removed');
							console.log(record.getData());
							this.removeForumDiscussion(record);
						}
					}
				}, this
			);

		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getForumDiscussionsStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				console.log('adding new disc');
				console.log(record);
				MoodleMobApp.Session.getForumDiscussionsStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified) {
				MoodleMobApp.Session.getForumDiscussionsStore().remove(stored_record);
				MoodleMobApp.Session.getForumDiscussionsStore().add(record);
			}
		});
		MoodleMobApp.Session.getForumDiscussionsStore().sync();
	},

	updateForumPostsStore: function(course, data) {
		// purge the removed discussions
		MoodleMobApp.Session.getForumPostsStore().each(
				function(record) {
					if(record.get('course') == course.get('id')) {
						var record_removed = true;
						for(var i=0; i < data.length; ++i) {
							if(data[i].id == record.get('id')) {
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

		Ext.each(data, function(record) {
			// fix indentation
			var parentid = record.parent;
			if(parentid == 0) { // root post
				// set the root post depth to 0
				record.indentation = 0;
			} else {
				var parent_post = MoodleMobApp.Session.getForumPostsStore().findRecord('id', parentid, null, false, true, true);
				var parent_indentation = parent_post.get('indentation');
				record.indentation = parent_indentation + 1;
			}

			var stored_record = MoodleMobApp.Session.getForumPostsStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				MoodleMobApp.Session.getForumPostsStore().add(record);
			} else if(stored_record.get('modified') != record.modified) {
				MoodleMobApp.Session.getForumPostsStore().remove(stored_record);
				MoodleMobApp.Session.getForumPostsStore().add(record);
			}
		});
		MoodleMobApp.Session.getForumPostsStore().sync();
	},

	removeForumEntry: function(forumid) {
		MoodleMobApp.Session.getForumDiscussionsStore().queryBy(
			function(entry, id) {
				if(entry.get('forum') == forumid) { return true; }
			}).each(
				function(discussion) {
					this.removeForumDiscussion(discussion);
				}, this
			);
		MoodleMobApp.Session.getForumDiscussionsStore().sync();
		MoodleMobApp.Session.getForumPostsStore().sync();
	},

	removeForumDiscussion: function(discussion) {
		MoodleMobApp.Session.getForumPostsStore().queryBy(
			function(entry, id) {
				if(entry.get('discussion') == discussion.get('id')) { return true; }
			}).each(
				function(post) {
					// remove post
					MoodleMobApp.Session.getForumPostsStore().remove(post);
				}
			);
			// remove discussion
			MoodleMobApp.Session.getForumDiscussionsStore().remove(discussion);
			MoodleMobApp.Session.getForumDiscussionsStore().sync();
			MoodleMobApp.Session.getForumPostsStore().sync();
	},



	updateResourcesStore: function(course, data) {
		var store_updated = false;
		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				store_updated = true;
				MoodleMobApp.Session.getResourcesStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified) {
				store_updated = true;
				// purge the older file if there is a new one available
				if(stored_record.get('fileid') != data.fileid) {
					var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + course.get('id') + '/file/' + stored_record.get('fileid');
					var successCallback = function() {
						console.log('newer version available, purged resource file: ' + dirPath + '/' + stored_record.get('name'));
					};
					var failCallback = function(error) {
						console.error('Resource; Cannot remove the directory: '+ dirPath, error);
						Ext.Msg.alert(
							'Removing directory',
							'Updater: removing the directory: '+ dirPath +' failed! Code: ' + error.code
						);
					};
					MoodleMobApp.FileSystem.removeDirectory(dirPath, successCallback, failCallback);
				}
				MoodleMobApp.Session.getResourcesStore().remove(stored_record);
				MoodleMobApp.Session.getResourcesStore().add(record);
			}
		});

		if(store_updated) {
			MoodleMobApp.Session.getResourcesStore().sync();
		}
	},

	removeResourceEntry: function(resourceid, course) {
		// get the resource entry
		var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', resourceid, 0, false, true, true);
		var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + course.get('id') + '/file/' + resource.get('fileid');
		var successCallback = function() {
			console.log('purged resource file: ' + dirPath + '/' + resource.get('name'));
		};
		var failCallback = function(error) {
			console.error('Resource Entry; Cannot remove the directory: '+ dirPath, error);
			Ext.Msg.alert(
				'Removing directory',
				'Updater: removing the directory: '+ dirPath +' failed! Code: ' + error.code
			);
		};
		MoodleMobApp.FileSystem.removeDirectory(dirPath, successCallback, failCallback);
		MoodleMobApp.Session.getResourcesStore().remove(resource);
		MoodleMobApp.Session.getResourcesStore().sync();
	},

	updateChoicesStore: function(course, data) {
		var store_updated = false;
		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getChoicesStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				store_updated = true;
				MoodleMobApp.Session.getChoicesStore().add(record);
			//} else if(stored_record.get('timemodified') != record.timemodified) {
			} else { // update the store without checking for the timemodified value; get the latest stats on the user answers
				store_updated = true;
				MoodleMobApp.Session.getChoicesStore().remove(stored_record);
				MoodleMobApp.Session.getChoicesStore().add(record);
			}
		});

		if(store_updated) {
			MoodleMobApp.Session.getChoicesStore().sync();
		}
	},

	removeChoiceEntry: function(choiceid) {
		// get the choice entry
		var choice = MoodleMobApp.Session.getChoicesStore().findRecord('id', choiceid);
		MoodleMobApp.Session.getChoicesStore().remove(choice);
		MoodleMobApp.Session.getChoicesStore().sync();
	},

	updateFoldersStore: function(course, data) {
		MoodleMobApp.Session.getFoldersStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					// purge files if changed
					if(record.get('fileid') > 0) {
						var fileid_found = false;
						for(var i = 0; i < data.length; ++i) {
							if(data[i].fileid > 0 && data[i].fileid == record.get('fileid')) {
								fileid_found = true;
								break;
							}
						}
						if(!fileid_found) {
							var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + course.get('id') + '/file/' + record.get('fileid');
							var successCallback = function() {
								console.log('newer version available, purged old folder file: ' + dirPath + '/' + record.get('name'));
							};
							var failCallback = function(error) {
								console.error('Folder: Cannot remove the directory: '+ dirPath, error);
								Ext.Msg.alert(
									'Removing directory',
									'Updater: removing the directory: '+ dirPath +' failed! Code: ' + error.code
								);
							};
							MoodleMobApp.FileSystem.removeDirectory(dirPath, successCallback, failCallback);
						}
					}
					MoodleMobApp.Session.getFoldersStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) { MoodleMobApp.Session.getFoldersStore().add(record); });
		MoodleMobApp.Session.getFoldersStore().sync();
	},

	removeFolderEntry: function(folderid, course) {
		// get the folder content
		var folder = MoodleMobApp.Session.getFoldersStore().getGroups(folderid.toString());
		if(typeof folder == 'object') {
			// purge downloaded files
			Ext.each(folder.children, function(record) {
				if(record.get('type') == 'file') {
					var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + course.get('id') + '/file/' + record.get('fileid');
					var successCallback = function() {
						console.log('purged folder file: ' + dirPath + '/' + record.get('name'));
					};
					var failCallback = function(error) {
						console.error('Folder Entry: Cannot remove the directory: '+ dirPath, error);
						Ext.Msg.alert(
							'Removing directory',
							'Updater: removing the directory: '+ dirPath +' failed! Code: ' + error.code
						);
					};
					MoodleMobApp.FileSystem.removeDirectory(dirPath, successCallback, failCallback);
				}
			});
			MoodleMobApp.Session.getFoldersStore().remove(folder.children);
		}
		MoodleMobApp.Session.getFoldersStore().sync();
	},

	updateUrlStore: function(course, data) {
		var store_updated = false;
		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getUrlStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				store_updated = true;
				MoodleMobApp.Session.getUrlStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified) {
				store_updated = true;
				MoodleMobApp.Session.getUrlStore().remove(stored_record);
				MoodleMobApp.Session.getUrlStore().add(record);
			}
		});

		if(store_updated) {
			MoodleMobApp.Session.getUrlStore().sync();
		}
	},

	removeUrlEntry: function(urlid) {
		// get the url entry
		var url = MoodleMobApp.Session.getUrlStore().findRecord('id', urlid);
		MoodleMobApp.Session.getUrlStore().remove(url);
		MoodleMobApp.Session.getUrlStore().sync();
	},

	updatePagesStore: function(course, data) {
		var store_updated = false;
		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getPagesStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				store_updated = true;
				MoodleMobApp.Session.getPagesStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified) {
				store_updated = true;
				MoodleMobApp.Session.getPagesStore().remove(stored_record);
				MoodleMobApp.Session.getPagesStore().add(record);
			}
		});

		if(store_updated) {
			MoodleMobApp.Session.getPagesStore().sync();
		}
	},

	removePageEntry: function(pageid) {
		// get the page entry
		var page = MoodleMobApp.Session.getPagesStore().findRecord('id', pageid);
		MoodleMobApp.Session.getPagesStore().remove(page);
		MoodleMobApp.Session.getPagesStore().sync();
	},

	updateBooksStore: function(course, data) {
		var store_updated = false;
		Ext.each(data, function(record) {
			var stored_record = MoodleMobApp.Session.getBooksStore().findRecord('id', record.id, null, false, true, true);
			if(stored_record == null) {
				store_updated = true;
				MoodleMobApp.Session.getBooksStore().add(record);
			} else if(stored_record.get('timemodified') != record.timemodified) {
				store_updated = true;
				MoodleMobApp.Session.getBooksStore().remove(stored_record);
				MoodleMobApp.Session.getBooksStore().add(record);
			}
		});

		if(store_updated) {
			MoodleMobApp.Session.getBooksStore().sync();
		}
	},

	removeBookEntry: function(bookid) {
		// get the page entry
		var book = MoodleMobApp.Session.getBooksStore().findRecord('id', bookid);
		MoodleMobApp.Session.getBooksStore().remove(book);
		MoodleMobApp.Session.getBooksStore().sync();
	},


	updateGradeItemsStore: function(course, data) {
		MoodleMobApp.Session.getGradeItemsStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getGradeItemsStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) { MoodleMobApp.Session.getGradeItemsStore().add(record); });
		MoodleMobApp.Session.getGradeItemsStore().sync();
	},

	updateGradesStore: function(course, data) {
		MoodleMobApp.Session.getGradesStore().each(
			function(record) {
				if(record.get('courseid') == course.get('id')) {
					MoodleMobApp.Session.getGradesStore().remove(record);
				}
			}
		);

		Ext.each(data, function(record) { MoodleMobApp.Session.getGradesStore().add(record); });
		MoodleMobApp.Session.getGradesStore().sync();
	}
});
