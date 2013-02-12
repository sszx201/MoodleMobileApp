Ext.define('MoodleMobApp.Session', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : {
		username: '',
		course: null,
		settingsStore: null,
		usersStore: null,
		enrolledUsersStore: null,
		manualAccountStore: null,
		aaiAccountStore: null,
		coursesStore: null,
		modulesStore: null,
		resourcesStore: null,
		choicesStore: null,
		urlStore: null,
		forumDiscussionsStore: null,
		forumPostsStore: null,
		onlineAssignmentSubmissionsStore: null,
		foldersStore: null,
	}
	
});
