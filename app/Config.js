Ext.define('MoodleMobApp.Config', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : {
		moodleUrl : 'your moodle installation url'
		aaiAuthUrl : '/auth/mobileaai/authenticate.php'
		manualAuthUrl : '/auth/mobilemanual/authenticate.php'
		webServiceUrl : '/webservice/rest/server.php'
	}
});
