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
	request: function(wstoken, wsfunction, params, rmodel) {
		var query = MoodleMobApp.Config.getWebServiceUrl() + '?wstoken=' + wstoken + '&wsfunction=' + wsfunction + '&' + params + '&moodlewsrestformat=json'; 

		var content_store = Ext.create('Ext.data.Store', {
			model: rmodel,
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
				// if empty or no errors return the store
				if( this.first() == undefined || this.first().raw.exception == undefined ) {
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
	// Web Service Request Wrappers
	//*****************************	
	getCourseModules: function(course) {
		var course_modules_store = this.request(course.token, 'local_uniappws_course_get_course_modules', 'courseid='+course.id, 'MoodleMobApp.model.course.ModuleList');
		course_modules_store.setGroupField('modname');
		return course_modules_store;
	},

	getForumDiscussions: function(course_token, forum) {
		var forum_discussions_store = this.request(course_token, 'local_uniappws_forum_get_forum_discussions', 'forumid='+forum.instanceid, 'MoodleMobApp.model.course.forum.Discussion');
		return forum_discussions_store;
	}

});
