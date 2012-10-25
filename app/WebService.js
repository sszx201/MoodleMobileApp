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
	request: function(params, rmodel) {
		// add response format
		params.moodlewsrestformat = 'json';
		// prepare the parameters
		var url_encoded_params = '?';
		Ext.iterate(params, function(key, value){
			url_encoded_params += key+'='+value+'&';
		});
		// remove the last & char
		url_encoded_params = url_encoded_params.slice(0,-1);
		// build the url_request
		var url_request = MoodleMobApp.Config.getWebServiceUrl() + url_encoded_params;
		// send the request for content
		var content_store = Ext.create('Ext.data.Store', {
			model: rmodel,
			proxy: {
				type: 'ajax',
				url: url_request,
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
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_course_get_course_modules';
		params.wstoken = course.token;
		params.courseid = course.id;
		// request
		var course_modules_store = this.request(params, 'MoodleMobApp.model.Module');
		course_modules_store.setGroupField('modname');
		return course_modules_store;
	},
	
	/*
	getCourseModulesCount: function(courseid) {
		// prepare the parameters
		var params = new Array();
		Ext.each(courseid, function(value) { params.push('courseid[]='+value); });
		
		var course_modules_count_store = this.request(
					'local_uniappws_course_get_course_modules_count',
					params.join('&'),
					'MoodleMobApp.model.ModulesCount'
		);
		return course_modules_count_store;
	},
	*/

	getForumDiscussions: function(forum, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_forum_get_forum_discussions';
		params.wstoken = token;
		params.forumid = forum.instanceid;
		// request
		var forum_discussions_store = this.request(params, 'MoodleMobApp.model.ForumDiscussion');
		return forum_discussions_store;
	},

	createDiscussion: function(post, token) {
		// set parameters
		var params = new Object();
		params.discussion = Array()
		params.wsfunction = 'local_uniappws_forum_create_discussion';
		params.wstoken = token;
		params['discussion[forumid]'] = post.forumid;
		params['discussion[name]'] = post.name;
		params['discussion[intro]'] = post.intro;
		// request
		var result_store = this.request(params, 'MoodleMobApp.model.ForumCreatePostResponse');
		return result_store;
	},

	getPostsByDiscussion: function(discussion, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_forum_get_posts_by_discussionid';
		params.wstoken = token;
		params.discid = discussion.id;
		// request
		var discussion_posts_store = this.request(params, 'MoodleMobApp.model.ForumPost');
		return discussion_posts_store;
	},

	createForumPost: function(post, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_forum_create_post';
		params.wstoken = token;
		params.parentid = post.id;
		params.subject = post.subject;
		params.message = post.reply;
		// request
		var result_store = this.request(params, 'MoodleMobApp.model.ForumCreatePostResponse');
		return result_store;
	},
	

	getEnrolledUsers: function(course) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_user_get_users_by_courseid';
		params.wstoken = course.token;
		params.courseid = course.id;
		// request
		var enrolled_users_store = this.request(params, 'MoodleMobApp.model.User');
		return enrolled_users_store;
	},

	getUserById: function(userid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_user_get_user_by_id';
		params.wstoken = token;
		params.userid = userid;
		// request
		var user_store = this.request(params, 'MoodleMobApp.model.User');
		return user_store;
	},

	submitOnlineAssignment: function(assignment, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assign_submit_online';
		params.wstoken = token;
		params.assigid = assignment.instanceid;
		params.data = assignment.submission;
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse');
		return submission_response_store;
	},

	getAssignmentSubmission: function(assignid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assign_get_submission_by_assignid';
		params.wstoken = token;
		params.assigid = assignid;
		// request
		var submission_store = this.request(params, 'MoodleMobApp.model.AssignmentSubmission');
		return submission_store;
	},

	getFolder: function(folder, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_folder_get_folder_by_id';
		params.wstoken = token;
		params.folderid = folder.instanceid;
		// request
		var folder_content_store = this.request(params, 'MoodleMobApp.model.Folder');
		return folder_content_store;
	},



});
