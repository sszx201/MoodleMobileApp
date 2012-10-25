Ext.define('MoodleMobApp.Session', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : {
		courseToken : '',
		username : '',
		settingsStore: null,
		usersStore: null,
		enrolledUsersStore: null,
		manualAccountStore: null,
		aaiAccountStore: null,
		coursesStore: null,
		modulesStore: null,
		forumDiscussionsStore: null,
		forumPostsStore: null,
		onlineAssignmentSubmissionsStore: null,
		foldersStore: null,
	}
	
});
