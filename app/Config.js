Ext.define('MoodleMobApp.Config', {
	singleton : true,

	constructor: function(config) {
		// DRY config approach
		this.config.aaiAuthUrl = this.config.moodleUrl + this.config.aaiAuthUrl;
		this.config.homeOrgsUrl = this.config.moodleUrl + this.config.homeOrgsUrl;
		this.config.manualAuthUrl = this.config.moodleUrl + this.config.manualAuthUrl;
		this.config.webServiceUrl = this.config.moodleUrl + this.config.webServiceUrl;
		this.config.resourceViewUrl = this.config.moodleUrl + this.config.resourceViewUrl;
		this.config.quizViewUrl = this.config.moodleUrl + this.config.quizViewUrl;
		this.config.workshopViewUrl = this.config.moodleUrl + this.config.workshopViewUrl;
		this.config.databaseViewUrl = this.config.moodleUrl + this.config.databaseViewUrl;
		this.config.glossaryViewUrl = this.config.moodleUrl + this.config.glossaryViewUrl;
		this.config.wikiViewUrl = this.config.moodleUrl + this.config.wikiViewUrl;
		this.config.feedbackViewUrl = this.config.moodleUrl + this.config.feedbackViewUrl;

		this.initConfig(config);
		return this;
	},

	config : {
		moodleUrl : 'https://yourmoodleinstallation.org',
		aaiAuthUrl : '/auth/mobileaai/authenticate.php',
		homeOrgsUrl : '/auth/mobileaai/get_idps.php',
		manualAuthUrl : '/auth/mobilemanual/authenticate.php',
		webServiceUrl : '/webservice/rest/server.php',
		resourceViewUrl : '/mod/resource/view.php',
		quizViewUrl : '/mod/quiz/view.php',
		workshopViewUrl : '/mod/workshop/view.php',
		databaseViewUrl : '/mod/data/view.php',
		glossaryViewUrl : '/mod/glossary/view.php',
		wikiViewUrl : '/mod/wiki/view.php',
		feedbackViewUrl : '/mod/feedback/view.php',
		defaultIDP: 'https://login2.usi.ch/idp/shibboleth',
		//paths
		fileCacheDir: 'iCorsi2',
		//Flags
		noGroupsFlag: 0,
		separatedGroupsFlag: 1,
		visibleGroupsFlag: 2,
		version: '0.1 beta'
	}
});
