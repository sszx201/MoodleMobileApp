Ext.define('MoodleMobApp.controller.Assignment', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AssignmentSubmission',
			'MoodleMobApp.model.SubmissionResponse',
			'MoodleMobApp.model.OnlineAssignmentSubmission',
			'MoodleMobApp.model.SingleUploadAssignmentSubmission',
			'MoodleMobApp.model.FileUploadResponse',
		],

		views: [
			'MoodleMobApp.view.OnlineAssignment',
			'MoodleMobApp.view.OfflineAssignment',
			'MoodleMobApp.view.SingleUploadAssignment',
		],

		refs: {
			navigator: '#course_navigator',
			moduleList: '#module_list',
			onlineAssignment: '#online_assignment_form',
			onlineAssignmentSubmit: '#online_assignment_form button[action=submit]',
			offlineAssignment: '#offline_assignment_form',
			singleUploadAssignment: '#single_upload_assignment_form',
			singleUploadAssignmentSubmit: '#single_upload_assignment_form button[action=submit]',
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			// specific controls
			onlineAssignment: { deactivate: 'submitOnlineAssignmentCancelled' },
			onlineAssignmentSubmit: { tap: 'submitOnlineAssignment' },
			singleUploadAssignmentSubmit: { tap: 'submitSingleUploadAssignment' },
		}
	},

	init: function(){
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'assignment'){
			this.selectAssignment(record);
		}
	},

	selectAssignment: function(assignment) {
		// display discussions
		switch(assignment.get('type')) {
			case 'online':
				this.selectOnlineAssignment(assignment);
			break;

			case 'offline':
				this.selectOfflineAssignment(assignment);
			break;

			case 'uploadsingle':
				this.selectSingleUploadAssignment(assignment);
			break;

			case 'upload':
				console.log('multi upload');
			break;

			default:
				Ext.Msg.alert( 'Assignment type error', 'Unknown assignment type.');
			break;
		}

	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},

	selectOnlineAssignment: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().getById(assignment.get('id'));
		if(previous_submission_record != null) {
			assignment.set('submission', previous_submission_record.get('submission'))
		}

		if(typeof this.getOnlineAssignment() == 'object') {
			this.getOnlineAssignment().setRecord(assignment);
			this.getNavigator().push(this.getOnlineAssignment());
		} else {
			this.getNavigator().push({
				xtype: 'onlineassignment',
				record: assignment
			});
		}
	},
	
	submitOnlineAssignment: function(button) {
		var submission_data = this.getOnlineAssignment().getValues();
		// check data
		if(submission_data.submission == "") {
			Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please fill in.");
			return;
		}
		MoodleMobApp.app.showLoadMask('Submitting...');
		var submission_status_store = MoodleMobApp.WebService.submitOnlineAssignment(submission_data, MoodleMobApp.Session.getCourse().get('token'));
		// refresh the discussion content
		submission_status_store.on(
			'load', 
			function(status_store){
				if(status_store.first().get('subid') != null){
					MoodleMobApp.app.hideLoadMask();
					this.storeTheOnlineSubmission(submission_data);
					this.backToTheCourseModulesList();
				}
			},
			this,
			{single: true}
		);
	},

	submitOnlineAssignmentCancelled: function() {
		this.backToTheCourseModulesList();
	},

	storeTheOnlineSubmission: function(data){
		if(MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().find('id', data.id) == -1){
			var submission_record = Ext.create('MoodleMobApp.model.OnlineAssignmentSubmission', data);
			submission_record.setDirty();
			MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().add(submission_record);
		} else {
			MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().getById(data.id).setData(data);
			MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().getById(data.id).setDirty();
		}

		MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().sync()
	},

	selectOfflineAssignment: function(assignment) {
		// display assignment
		if(typeof this.getOfflineAssignment() == 'object') {
			this.getOfflineAssignment().setRecord(assignment);
			this.getNavigator().push(this.getOfflineAssignment());
		} else {
			this.getNavigator().push({
				xtype: 'offlineassignment',
				record: assignment
			});
		}
	},

	selectSingleUploadAssignment: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().getById(assignment.get('id'));

		if(previous_submission_record != null) {
			assignment.set('submission', previous_submission_record.get('filename'));
		}

		if(typeof this.getSingleUploadAssignment() == 'object') {
			this.getSingleUploadAssignment().setRecord(assignment);
			this.getNavigator().push(this.getSingleUploadAssignment());
		} else {
			this.getNavigator().push({
				xtype: 'singleuploadassignment',
				record: assignment
			});
		}
	},

	submitSingleUploadAssignment: function(button) {
		var submission_data = this.getSingleUploadAssignment().getValues();
		// check data
		if(submission_data.submission == "") {
			Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select a file to submit.");
			return;
		}

		MoodleMobApp.app.showLoadMask('Submitting...');
		var self = this;
		// function to execute if the file is read successfully
		var successFunc = function(filedata, params) {
				params.filedata = filedata;
				// get the filename
				params.filename = params.filepath.split(/(\\|\/)/g).pop();
				var file_upload_response_store = MoodleMobApp.WebService.uploadDraftFile(params, MoodleMobApp.Session.getCourse().get('token'));
				file_upload_response_store.on(
					'load', 
					function(status_store){
						var sub_params = {};
						sub_params.courseid = MoodleMobApp.Session.getCourse().get('id');
						sub_params.instanceid = submission_data.instanceid;
						sub_params.fileid = status_store.first().get('fileid');
						var assignment_submission_store = MoodleMobApp.WebService.submitSingleUploadAssignment(sub_params,  MoodleMobApp.Session.getCourse().get('token'));
						assignment_submission_store.on(
							'load', 
							function(status_store){
								MoodleMobApp.app.hideLoadMask();
								self.storeTheSingleUploadSubmission(params);
								self.backToTheCourseModulesList();
							},
							null,
							{single: true}
						);
					},
					null,
					{single: true}
				);
		};

		var outcome = MoodleMobApp.app.readFile(submission_data.filepath, successFunc, submission_data);
	},	

	storeTheSingleUploadSubmission: function(data){
		if(MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().find('id', data.id) == -1){
			var submission_record = Ext.create('MoodleMobApp.model.SingleUploadAssignmentSubmission', data);
			submission_record.setDirty();
			MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().add(submission_record);
		} else {
			MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().getById(data.id).setData(data);
			MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().getById(data.id).setDirty();
		}

		MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().sync()
	},

});
