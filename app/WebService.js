Ext.define('MoodleMobApp.WebService', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : { },

	//************************************	
	// Generic webservice request function
	//************************************	
	request: function(params, rmodel, method) {
		// add response format
		params.moodlewsrestformat = 'json';
		// send the request for content
		var content_store = Ext.create('Ext.data.Store', {
			model: rmodel,
			proxy: {
				type: 'ajax',
				url: MoodleMobApp.Config.getWebServiceUrl(),
				extraParams: params,
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				actionMethods: {read: method},
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
					// hide the loading mask if visible
					MoodleMobApp.app.hideLoadMask();
					// display the error	
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
		var course_modules_store = this.request(params, 'MoodleMobApp.model.Module', 'GET');
		course_modules_store.setGroupField('modname');
		return course_modules_store;
	},

	getCalendarEvents: function(course) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_calendar_get_events';
		params.wstoken = course.token;
		params.courseid = course.id;
		// request
		var calendar_events_store = this.request(params, 'MoodleMobApp.model.CalendarEvent', 'GET');
		return calendar_events_store;
	},
	
	getForumDiscussions: function(forum, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_forum_get_forum_discussions';
		params.wstoken = token;
		params.forumid = forum.instanceid;
		// request
		var forum_discussions_store = this.request(params, 'MoodleMobApp.model.ForumDiscussion', 'GET');
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
		var result_store = this.request(params, 'MoodleMobApp.model.ForumCreatePostResponse', 'POST');
		return result_store;
	},

	getPostsByDiscussion: function(discussion, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_forum_get_posts_by_discussionid';
		params.wstoken = token;
		params.discid = discussion.id;
		// request
		var discussion_posts_store = this.request(params, 'MoodleMobApp.model.ForumPost', 'GET');
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
		var result_store = this.request(params, 'MoodleMobApp.model.ForumCreatePostResponse', 'POST');
		return result_store;
	},
	

	getEnrolledUsers: function(course) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_user_get_users_by_courseid';
		params.wstoken = course.token;
		params.courseid = course.id;
		// request
		var enrolled_users_store = this.request(params, 'MoodleMobApp.model.User', 'GET');
		return enrolled_users_store;
	},

	getUserById: function(userid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_user_get_user_by_id';
		params.wstoken = token;
		params.userid = userid;
		// request
		var user_store = this.request(params, 'MoodleMobApp.model.User', 'GET');
		return user_store;
	},

	getAssignmentById: function(assigid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assignment_get_assignment_by_id';
		params.wstoken = token;
		params.assigid = assigid;
		// request
		var user_store = this.request(params, 'MoodleMobApp.model.Assignment', 'GET');
		return user_store;
	},

	submitOnlineAssignment: function(assignment, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assignment_submit_online';
		params.wstoken = token;
		params.assigid = assignment.instanceid;
		params.data = assignment.submission;
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse', 'POST');
		return submission_response_store;
	},

	submitSingleUploadAssignment: function(assignment, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assignment_submit_singleupload';
		params.wstoken = token;
		params.courseid = assignment.courseid;
		params.assigid = assignment.instanceid;
		params.fileid = assignment.fileid;
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse', 'POST');
		return submission_response_store;
	},

	submitUploadAssignment: function(assignment, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assignment_submit_upload';
		params.wstoken = token;
		params.assigid = assignment.instanceid;
		params.isfinal = assignment.isfinal;
		for(i=0; i < assignment.files.length; ++i) {
			params['files[' +i+ ']'] = assignment.files[i];
		}
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse', 'GET');
		return submission_response_store;
	},

	getAssignmentSubmission: function(assigid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assignment_get_submission_by_assignid';
		params.wstoken = token;
		params.assigid = assigid;
		// request
		var submission_store = this.request(params, 'MoodleMobApp.model.AssignmentSubmission', 'GET');
		return submission_store;
	},

	getAssignById: function(assigid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assign_get_assign_by_id';
		params.wstoken = token;
		params.assigid = assigid;
		// request
		var user_store = this.request(params, 'MoodleMobApp.model.Assign', 'GET');
		return user_store;
	},

	submitAssign: function(assign, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assign_submit_assign';
		params.wstoken = token;
		params.assigid = assign.instanceid;
		params.onlinetext = assign.onlinetext;
		params.teamsubmission = assign.teamsubmission;
		if(assign.files != undefined) {
			params.draftid = assign.draftid;
			for(i=0; i < assign.files.length; ++i) {
				params['files[' +i+ ']'] = assign.files[i];
			}
		} else {
			params.draftid = 0;
			params['files[]'] = 0;
		}
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse', 'GET');
		return submission_response_store;
	},

	getAssignSubmission: function(assigid, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_assign_get_submission_by_assignid';
		params.wstoken = token;
		params.assigid = assigid;
		// request
		var submission_store = this.request(params, 'MoodleMobApp.model.AssignSubmission', 'GET');
		return submission_store;
	},
	
	getFolder: function(folder, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_folder_get_folder_by_id';
		params.wstoken = token;
		params.folderid = folder.instanceid;
		// request
		var folder_content_store = this.request(params, 'MoodleMobApp.model.Folder', 'GET');
		return folder_content_store;
	},

	fetchFile: function(file, dir, progressFunc, successFunc, params) {
		// prepare the parameters
		var url_encoded_params = '?';
		Ext.iterate(params, function(key, value){
			url_encoded_params += key+'='+value+'&';
		});
		// remove the last & char
		url_encoded_params = url_encoded_params.slice(0,-1);
		// build the url
		var url = MoodleMobApp.Config.getWebServiceUrl() + url_encoded_params;

		window.requestFileSystem(
			LocalFileSystem.PERSISTENT, 0,
			function onFileSystemSuccess(fileSystem) {
					// get the filesystem
					fileSystem.root.getFile(
						'dummy.html', 
						{
							create: true,
							exclusive: false
						},
						// success callback: remove the previous file
						function gotFileEntry(fileEntry) {
							var sPath = fileEntry.fullPath.replace("dummy.html","");
							fileEntry.remove();

							var fileTransfer = new FileTransfer();

							fileTransfer.onprogress = progressFunc;
							//console.log('downloading from: ' + url);
							//console.log('to: ' + sPath + dir + '/' + file.name);
							fileTransfer.download(
								url,
								sPath + dir + '/' + file.name,
								function(theFile) {
									successFunc();
								},
								function(error) {
									Ext.Msg.alert(
										'File download error',
										'Failed to download the file: ' + file.name
									);
									/*
									console.log("download error source " + error.source);
									console.log("download error target " + error.target);
									console.log("download error code: " + error.code);
									console.log("download http status: " + error.http_status);
									*/
								},
								true // trust the site; https fix
							);
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Directory does not exist yet: ' + dir 
							);
						}
					);
			},
			// error callback: notify the error
			function(){
				Ext.Msg.alert(
					'File system error',
					'Cannot access the local filesystem.'
				);
			});
	},

	getFile: function(file, dir, progressFunc, successFunc, token) {
		var params = new Object();
		// add response format
		params.moodlewsrestformat = 'json';
		params.wsfunction = 'local_uniappws_files_get_file';
		params.wstoken = token;
		params.fileid = file.fileid;
		this.fetchFile(file, dir, progressFunc, successFunc, params);
	},

	uploadDraftFile: function(file, token) {
		var params = new Object();
		// add response format
		params.moodlewsrestformat = 'json';
		params.wsfunction = 'local_uniappws_files_upload_draft_file';
		params.wstoken = token;
		params.itemid = file.draftid;
		params.filename = file.filename;
		params.filedata = file.filedata;

		var file_upload_response_store = this.request(params, 'MoodleMobApp.model.FileUploadResponse', 'POST');
		return file_upload_response_store;	

	},

	getScorm: function(file, dir, progressFunc, successFunc, token) {
		var params = new Object();
		// add response format
		params.moodlewsrestformat = 'json';
		params.wsfunction = 'local_uniappws_scorm_get_package';
		params.wstoken = token;
		params.scormid = file.scormid;
		this.fetchFile(file, dir, progressFunc, successFunc, params);
	},

	getResource: function(resource, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_resource_get_resource';
		params.wstoken = token;
		params.resourceid = resource.instanceid;
		// request
		var resource_content_store = this.request(params, 'MoodleMobApp.model.Resource', 'GET');
		return resource_content_store;
	},

	getChoice: function(choice, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_choice_get_choice';
		params.wstoken = token;
		params.choiceid = choice.instanceid;
		// request
		var choice_content_store = this.request(params, 'MoodleMobApp.model.Choice', 'GET');
		return choice_content_store;
	},

	submitChoice: function(choice, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_choice_submit_choice';
		params.wstoken = token;
		params.choiceid = choice.instanceid;
		params.optionid = choice.optionid;
		// request
		var submission_response_store = this.request(params, 'MoodleMobApp.model.SubmissionResponse', 'POST');
		return submission_response_store;
	},

	getUrl: function(resource, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_url_get_url';
		params.wstoken = token;
		params.urlid = resource.instanceid;
		// request
		var url_content_store = this.request(params, 'MoodleMobApp.model.Url', 'GET');
		return url_content_store;
	},

	getPage: function(resource, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_page_get_page';
		params.wstoken = token;
		params.pageid = resource.instanceid;
		// request
		var page_content_store = this.request(params, 'MoodleMobApp.model.Page', 'GET');
		return page_content_store;
	},

	getGradeItems: function(course, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_get_grade_items_by_courseid';
		params.wstoken = token;
		params.courseid = course.id;
		// request
		var grade_items_store = this.request(params, 'MoodleMobApp.model.GradeItem', 'GET');
		return grade_items_store;
	},

	getGrades: function(course, token) {
		// set parameters
		var params = new Object();
		params.wsfunction = 'local_uniappws_get_user_grades_by_courseid';
		params.wstoken = token;
		params.courseid = course.id;
		// request
		var grade_store = this.request(params, 'MoodleMobApp.model.Grade', 'GET');
		return grade_store;
	},

});
