Ext.define('MoodleMobApp.controller.Assignment', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AssignmentSubmission',
			'MoodleMobApp.model.SubmissionResponse',
			'MoodleMobApp.model.OnlineAssignmentSubmission',
			'MoodleMobApp.model.SingleUploadAssignmentSubmission',
			'MoodleMobApp.model.UploadAssignmentSubmission',
			'MoodleMobApp.model.FileUploadResponse',
		],

		views: [
			'MoodleMobApp.view.OnlineAssignment',
			'MoodleMobApp.view.OfflineAssignment',
			'MoodleMobApp.view.SingleUploadAssignment',
			'MoodleMobApp.view.UploadAssignment',
		],

		refs: {
			navigator: '#course_navigator',
			moduleList: '#module_list',
			onlineAssignment: 'onlineassignment',
			onlineAssignmentSubmit: 'onlineassignment button[action=submit]',
			offlineAssignment: 'offlineassignment',
			singleUploadAssignment: 'singleuploadassignment',
			singleUploadAssignmentSubmit: 'singleuploadassignment button[action=submit]',
			uploadAssignment: 'uploadassignment',
			uploadAssignmentAddFile: 'uploadassignment button[action=addfile]',
			uploadAssignmentSubmit: 'uploadassignment button[action=submit]',
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			// specific controls
			onlineAssignment: { deactivate: 'submitOnlineAssignmentCancelled' },
			onlineAssignmentSubmit: { tap: 'submitOnlineAssignment' },
			singleUploadAssignmentSubmit: { tap: 'submitSingleUploadAssignment' },
			uploadAssignmentAddFile: { tap: 'addFileUploadAssignment' },
			uploadAssignmentSubmit: { tap: 'submitUploadAssignment' },
		}
	},

	init: function(){
		Ext.as = this;
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
				this.selectUploadAssignment(assignment);
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

		this.getNavigator().push({
			xtype: 'onlineassignment',
			record: assignment
		});
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

	storeTheOnlineSubmission: function(data) {
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
		this.getNavigator().push({
			xtype: 'offlineassignment',
			record: assignment
		});
	},

	selectSingleUploadAssignment: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getSingleUploadAssignmentSubmissionsStore().getById(assignment.get('id'));

		if(previous_submission_record != null) {
			assignment.set('submission', previous_submission_record.get('filename'));
		}

		this.getNavigator().push({
			xtype: 'singleuploadassignment',
			record: assignment
		});
	},

	submitSingleUploadAssignment: function(button) {
		var self = this;
		var submission_data = this.getSingleUploadAssignment().getValues();
		var comp = button.getParent().child('textfield').getComponent();
		var files = comp.input.dom.files;
		submission_data.filename = files[0].name;

		var reader = new FileReader();
		reader.onload = function(e) {
			var content = e.target.result;
			successFunc(content, submission_data);
		}
		
		MoodleMobApp.app.showLoadMask('Submitting...');
		// function to execute if the file is read successfully
		var successFunc = function(filedata, params) {
				params.filedata = filedata;
				// get the filename
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

		reader.readAsDataURL(files[0]);
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

	selectUploadAssignment: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().getById(assignment.get('id'));

		if(previous_submission_record != null) {
			assignment.set('submission', previous_submission_record.get('filenames'));
		}

		if(typeof this.getUploadAssignment() == 'object') {
			this.getUploadAssignment().destroy(); // if the previous instance is still there remove it
		}

		this.getNavigator().push({
			xtype: 'uploadassignment',
			record: assignment
		});
	},

	addFileUploadAssignment: function() {
		var filelist = this.getUploadAssignment().child('fieldset').child('container');
		filelist.insert(
			0,
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'textfield',
						component: { 
							xtype: 'file',
							disabled: false,
						},
						flex: 4,
					},
					{
						xtype: 'button',
						text: 'Remove',
						ui: 'decline',
						flex: 1,
						margin: 10,
						listeners: {
							tap: function(self) {
								self.getParent().destroy();
							}
						}
					}
				]
			}
		);
	},

	submitUploadAssignment: function(button) {
		// check and prepare the files to be uploaded as drafts
		var submission_data = this.getUploadAssignment().getValues();
		submission_data.uploadFile = new Array();
		submission_data.files = new Array();
		submission_data.filenames = new Array();
		var filelist = this.getUploadAssignment().child('fieldset').child('container[cls=filelist]');
		var fileEntries = filelist.getItems().getCount();
		var files = {}; // this object is used to control the files; avoid duplicates and empty submissions
		for(var i=0; i < fileEntries; ++i) {
			var file = filelist.getAt(i).child('textfield').getComponent().input.dom.files;
			if(file.length > 0) { // ignore file is the slot is empty
				if(files[file[0].name] == undefined) {
					files[file[0].name] = file;
					submission_data.uploadFile.push(file);
				}
			}
		}
		// check files number; must be at least one file to submit
		if(Object.getOwnPropertyNames(files).length === 0) {
			Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select some files to submit.");
			return;
		}

		var self = this;
		MoodleMobApp.app.showLoadMask('Submitting...');
		// function to execute if the file is read successfully
		var submit = function(params) {
			params.courseid = MoodleMobApp.Session.getCourse().get('id');
			params.instanceid = submission_data.instanceid;
			params.isfinal = 1;
			var assignment_submission_store = MoodleMobApp.WebService.submitUploadAssignment(params,  MoodleMobApp.Session.getCourse().get('token'));
			assignment_submission_store.on(
				'load',
				function(status_store){
					MoodleMobApp.app.hideLoadMask();
					self.storeTheUploadSubmission(params);
					self.backToTheCourseModulesList();
				},
				null,
				{single: true}
			);
		};

		var uploadDraftFile = function(fdata, params) {
			//update params
			params.filedata = fdata;
			var file_upload_response_store = MoodleMobApp.WebService.uploadDraftFile(params, MoodleMobApp.Session.getCourse().get('token'));
			file_upload_response_store.on(
				'load',
				function(status_store) {
					params.files.push(status_store.first().get('fileid'));
					if(params.uploadFile.length > 0) {
						var file = params.uploadFile.pop();
						params.filename = file[0].name;
						params.filenames.push(params.filename);
						reader.readAsDataURL(file[0]);
					} else { // all draft files have been updated
						// final step: submission
						submit(params);
					}
				},
				null,
				{single: true}
			);
		};

		var reader = new FileReader();
		reader.onload = function(e) {
			var content = e.target.result;
			uploadDraftFile(content, submission_data);
		}

		// start the draft uploading chain
		var first_file = submission_data.uploadFile.pop();
		submission_data.filename = first_file[0].name;
		// store the filenames for the assignment submission report
		submission_data.filenames.push(submission_data.filename);
		reader.readAsDataURL(first_file[0]);
	},

	storeTheUploadSubmission: function(data){
		if(MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().find('id', data.id) == -1){
			var submission_record = Ext.create('MoodleMobApp.model.UploadAssignmentSubmission', data);
			submission_record.setDirty();
			MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().add(submission_record);
		} else {
			MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().getById(data.id).setData(data);
			MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().getById(data.id).setDirty();
		}

		MoodleMobApp.Session.getUploadAssignmentSubmissionsStore().sync()
	},

});
