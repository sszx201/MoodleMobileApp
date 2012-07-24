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
	request: function(wsfunction, params, rmodel) {
		var query = MoodleMobApp.Config.getWebServiceUrl() +
					'?wstoken=' + MoodleMobApp.Session.getCourseToken() +
					'&wsfunction=' + wsfunction + '&' +
					params + '&moodlewsrestformat=json';

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
				if( this.first() != undefined && this.first().raw.exception != undefined ) {
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
		var course_modules_store = this.request(
					'local_uniappws_course_get_course_modules',
					'courseid='+course.id,
					'MoodleMobApp.model.ModuleList'
		);
		course_modules_store.setGroupField('modname');
		return course_modules_store;
	},

	getForumDiscussions: function(forum) {
		var forum_discussions_store = this.request(
					'local_uniappws_forum_get_forum_discussions',
					'forumid='+forum.instanceid,
					'MoodleMobApp.model.ForumDiscussion'
		);
		return forum_discussions_store;
	},
	
	getPostsByDiscussion: function(discussion) {
		var discussion_posts_store = this.request(
					'local_uniappws_forum_get_posts_by_discussionid',
					'discid='+discussion.id,
					'MoodleMobApp.model.ForumPost'
		);
		return discussion_posts_store;
	},

	getEnrolledUsers: function(courseid) {
		var enrolled_users_store = this.request(
					'local_uniappws_user_get_users_by_courseid',
					'courseid='+courseid,
					'MoodleMobApp.model.User'
		);
		return enrolled_users_store;
	},

	getUserById: function(userid) {
		var user_store = this.request(
					'local_uniappws_user_get_user_by_id',
					'userid='+userid,
					'MoodleMobApp.model.User'
		);
		return user_store;
	},

});
