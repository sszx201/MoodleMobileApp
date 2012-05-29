Ext.define('MoodleMobApp.Config', {
    singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

    config : {
        webServiceUrl : 'your moodle web service url'
    }
});
