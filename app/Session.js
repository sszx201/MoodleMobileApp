Ext.define('MoodleMobApp.Session', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : {
		username: '',
		user: null,
		course: null,
		settingsStore: null,
		usersStore: null,
		enrolledUsersStore: null,
		groupsStore: null,
		groupingsStore: null,
		manualAccountStore: null,
		aaiAccountStore: null,
		coursesStore: null,
		calendarEventsStore: null,
		courseSectionsStore: null,
		modulesStore: null,
		resourcesStore: null,
		choicesStore: null,
		urlStore: null,
		pageStore: null,
		forumDiscussionsStore: null,
		forumPostsStore: null,
		foldersStore: null,
		gradeItemsStore: null,
		gradesStore: null,
	}
	
});
