Ext.define('MoodleMobApp.controller.Settings', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			settings: 'settings',
			purgeData: 'settings button[action=purgedata]',
			purgeFiles: 'settings button[action=purgefiles]',
		},

		control: {
			settings: {
				show: 'showTheActiveAccount'	
			},

			purgeData: {
				tap: 'confirmPurgeData'
			},

			purgeFiles: {
				tap: 'confirmPurgeFiles'
			}
		}
	},

  	showTheActiveAccount: function() {
		// set user accounttype setting
		if(MoodleMobApp.Session.getSettingsStore().first().get('accounttype') === 'aai') {
			this.getSettings().down('tabpanel').setActiveItem(0);
		} else if(MoodleMobApp.Session.getSettingsStore().data.first().get('accounttype') === 'manual') {
			this.getSettings().down('tabpanel').setActiveItem(1);
		}
	},

	confirmPurgeData: function() {
		Ext.Msg.confirm('Purging Data', 'Are you sure you want to purge all the downloaded data?', this.purgeData, this);
	},

	purgeData: function() {
		MoodleMobApp.Session.getCoursesStore().removeAll();
		MoodleMobApp.Session.getCoursesStore().getProxy().clear();
		MoodleMobApp.Session.getGroupsStore().removeAll();
		MoodleMobApp.Session.getGroupsStore().getProxy().clear();
		MoodleMobApp.Session.getGroupingsStore().removeAll();
		MoodleMobApp.Session.getGroupingsStore().getProxy().clear();
		MoodleMobApp.Session.getCalendarEventsStore().removeAll();
		MoodleMobApp.Session.getCalendarEventsStore().getProxy().clear();
		MoodleMobApp.Session.getCourseSectionsStore().removeAll();
		MoodleMobApp.Session.getCourseSectionsStore().getProxy().clear();
		MoodleMobApp.Session.getModulesStore().removeAll();
		MoodleMobApp.Session.getModulesStore().getProxy().clear();
		MoodleMobApp.Session.getUsersStore().removeAll();
		MoodleMobApp.Session.getUsersStore().getProxy().clear();
		MoodleMobApp.Session.getEnrolledUsersStore().removeAll();
		MoodleMobApp.Session.getEnrolledUsersStore().getProxy().clear();
		MoodleMobApp.Session.getForumDiscussionsStore().removeAll();
		MoodleMobApp.Session.getForumDiscussionsStore().getProxy().clear();
		MoodleMobApp.Session.getForumPostsStore().removeAll();
		MoodleMobApp.Session.getForumPostsStore().getProxy().clear();
		MoodleMobApp.Session.getFoldersStore().removeAll();
		MoodleMobApp.Session.getFoldersStore().getProxy().clear();
		MoodleMobApp.Session.getResourcesStore().removeAll();
		MoodleMobApp.Session.getResourcesStore().getProxy().clear();
		MoodleMobApp.Session.getChoicesStore().removeAll();
		MoodleMobApp.Session.getChoicesStore().getProxy().clear();
		MoodleMobApp.Session.getUrlStore().removeAll();
		MoodleMobApp.Session.getUrlStore().getProxy().clear();
		MoodleMobApp.Session.getPageStore().removeAll();
		MoodleMobApp.Session.getPageStore().getProxy().clear();
		MoodleMobApp.Session.getGradeItemsStore().removeAll();
		MoodleMobApp.Session.getGradeItemsStore().getProxy().clear();
		MoodleMobApp.Session.getGradesStore().removeAll();
		MoodleMobApp.Session.getGradesStore().getProxy().clear();
	},


	confirmPurgeFiles: function() {
		Ext.Msg.confirm('Purging Files', 'Are you sure you want to purge all the downloaded files?', this.purgeFiles, this);
	},

	purgeFiles: function() {
		var self = this;
		window.requestFileSystem(
			LocalFileSystem.PERSISTENT, 0,
			function onFileSystemSuccess(fileSystem) {
					// get the filesystem
					fileSystem.root.getFile(
						'dummy.html', 
						{
							create: true,
							exclusive: false
						},
						// success callback: remove the previous file
						function gotFileEntry(fileEntry) {
							var sPath = fileEntry.fullPath.replace("dummy.html","") + MoodleMobApp.Config.getFileCacheDir();
							sPath = sPath.replace("file://","");
							fileEntry.remove();
							fileSystem.root.getDirectory(
								sPath,
								{
									create : true, 
									exclusive : false
								},
								function(entry) {
									entry.removeRecursively(
										function() {
											console.log("Remove Recursively Succeeded");
										},
										function() {
											console.log("Remove Recursively Failed");
										});
								}, 
								function() {
									Ext.Msg.alert(
										'File system error',
										'Cannot delete the iCorsi directory.'
									);
								});
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Directory does not exist yet: ' + dir 
							);
						}
					);
			},
			// error callback: notify the error
			function(){
				Ext.Msg.alert(
					'File system error',
					'Cannot access the local filesystem.'
				);
			});	
	}
});
