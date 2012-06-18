Ext.define('MoodleMobApp.WebService', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : {
		
	},
	
	//************************************	
	// Generic webservice request function
	//************************************	
	request: function(wstoken, wsfunction, params) {
		var query = MoodleMobApp.Config.getWebServiceUrl() + '?wstoken=' + wstoken + '&wsfunction=' + wsfunction + '&' + params + '&moodlewsrestformat=json'; 

		var content_store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.course.Content',
			proxy: {
				type: 'ajax',
				url: query,
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				reader: {
					type: 'json'
				}
			}
		});

		// get the content
		return content_store.load({
			callback: function(records, operation, success) {
				// check if there are any exceptions 
				if( this.first().raw.exception == undefined) {
					return this;
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			}
		});
	},
		
	//*****************************	
	// Wrappers
	//*****************************	
	getCourseModules: function(course) {
		return this.request(course.token, 'local_uniappws_get_course_modules', 'id='+course.id);
	}
});
