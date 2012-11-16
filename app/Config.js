Ext.define('MoodleMobApp.Config', {
	singleton : true,

	constructor: function(config) {
		// DRY config approach
		this.config.aaiAuthUrl = this.config.moodleUrl + this.config.aaiAuthUrl;
		this.config.homeOrgsUrl = this.config.moodleUrl + this.config.homeOrgsUrl;
		this.config.manualAuthUrl = this.config.moodleUrl + this.config.manualAuthUrl;
		this.config.webServiceUrl = this.config.moodleUrl + this.config.webServiceUrl;

  		this.initConfig(config);
  		return this;
	},

	config : {
		moodleUrl : 'https://www.yourmoodleinstallation.ch',
		aaiAuthUrl : '/auth/mobileaai/authenticate.php',
		homeOrgsUrl : '/auth/mobileaai/get_idps.php',
		manualAuthUrl : '/auth/mobilemanual/authenticate.php',
		webServiceUrl : '/webservice/rest/server.php',
	}
});
