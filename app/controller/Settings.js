Ext.define('MoodleMobApp.controller.Settings', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			settings: 'settings',
			purgeData: 'settings button[action=purgedata]',
			purgeFiles: 'settings button[action=purgefiles]',
			justDownload: 'settings checkboxfield[name=justdownload]',
			showRecentActivity: 'settings checkboxfield[name=showrecentactivity]'
		},

		control: {
			settings: {
				show: 'initUserSettings'
			},

			purgeData: {
				tap: 'confirmPurgeData'
			},

			purgeFiles: {
				tap: 'confirmPurgeFiles'
			},

			justDownload: {
				check: function() {
					MoodleMobApp.Session.getSettingsStore().first().set('justdownload', true);
					MoodleMobApp.Session.getSettingsStore().sync();
				},
				uncheck: function() {
					MoodleMobApp.Session.getSettingsStore().first().set('justdownload', false);
					MoodleMobApp.Session.getSettingsStore().sync();
				}
			},

			showRecentActivity: {
				check: function() {
					MoodleMobApp.Session.getSettingsStore().first().set('showrecentactivity', true);
					MoodleMobApp.Session.getSettingsStore().sync();
				},
				uncheck: function() {
					MoodleMobApp.Session.getSettingsStore().first().set('showrecentactivity', false);
					MoodleMobApp.Session.getSettingsStore().sync();
				}
			}

		}
	},

	initUserSettings: function() {
		// ios 7 top bar check
		if( window.device != undefined && parseInt(window.device.version) > 6 ) {
			if(this.getSettings().getParent().xtype == 'viewport') {
				this.getSettings().setStyle('margin-top: 20px;'); // Settings view is not embedded
			} else {
				this.getSettings().setStyle('margin-top: 0px;'); // Settings view is embedded
			}
		}

		if( MoodleMobApp.Session.getSettingsStore().first().get('justdownload') == true ) {
			this.getJustDownload().check();
		}

		// show the active account
		this.getSettings().down('tabpanel').setActiveItem(3);
		this.getSettings().down('tabpanel').setActiveItem(0);
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
		MoodleMobApp.Session.getRecentActivitiesStore().removeAll();
		MoodleMobApp.Session.getRecentActivitiesStore().getProxy().clear();
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
		MoodleMobApp.Session.getPagesStore().removeAll();
		MoodleMobApp.Session.getBooksStore().removeAll();
		MoodleMobApp.Session.getPagesStore().getProxy().clear();
		MoodleMobApp.Session.getGradeItemsStore().removeAll();
		MoodleMobApp.Session.getGradeItemsStore().getProxy().clear();
		MoodleMobApp.Session.getGradesStore().removeAll();
		MoodleMobApp.Session.getGradesStore().getProxy().clear();
		MoodleMobApp.Session.getAssignReportsStore().removeAll();
		MoodleMobApp.Session.getAssignReportsStore().getProxy().clear();
	},


	confirmPurgeFiles: function() {
		Ext.Msg.confirm('Purging Files', 'Are you sure you want to purge all the downloaded files?', this.purgeFiles, this);
	},

	purgeFiles: function() {
		MoodleMobApp.FileSystem.removeDirectory(
			MoodleMobApp.Config.getFileCacheDir(),
			function() {
				console.log("File cache directory purged");
			},
			function(error) {
				console.error("File cache directory was not purged", error);
				Ext.Msg.alert(
					'Purging File Cache',
					'Purging the file cache failed! Code: ' + error.code
				);
			}
		);
	}
});
