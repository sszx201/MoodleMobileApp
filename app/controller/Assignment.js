Ext.define('MoodleMobApp.controller.Assignment', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Assignment',
			'MoodleMobApp.model.AssignmentSubmission',
			'MoodleMobApp.model.SubmissionResponse',
			'MoodleMobApp.model.FileUploadResponse'
		],

		views: [
			'MoodleMobApp.view.OnlineAssignment',
			'MoodleMobApp.view.OfflineAssignment',
			'MoodleMobApp.view.SingleUploadAssignment',
			'MoodleMobApp.view.UploadAssignment'
		],

		refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			onlineAssignment: 'onlineassignment',
			onlineAssignmentSubmit: 'onlineassignment button[action=submit]',
			offlineAssignment: 'offlineassignment',
			singleUploadAssignment: 'singleuploadassignment',
			singleUploadAssignmentSubmit: 'singleuploadassignment button[action=submit]',
			uploadAssignment: 'uploadassignment',
			uploadAssignmentAddFile: 'uploadassignment button[action=addfile]',
			uploadAssignmentSubmit: 'uploadassignment button[action=submit]',
			recentActivity: 'recentactivitylist'
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			// specific controls
			onlineAssignment: { deactivate: 'submitOnlineAssignmentCancelled' },
			onlineAssignmentSubmit: { tap: 'submitOnlineAssignment' },
			singleUploadAssignmentSubmit: { tap: 'submitSingleUploadAssignment' },
			uploadAssignmentAddFile: { tap: 'addFileSlot' },
			uploadAssignmentSubmit: { tap: 'submitUploadAssignment' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'assignment') {
						var assignment_record = MoodleMobApp.Session.getModulesStore().findRecord('id', record.get('moduleid'));
						if(assignment_record != undefined) {
							this.selectAssignment(assignment_record);
						}
					}
				}
			}
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
		// assignment view config object
		var aconf = {
			record: assignment,
			settings: null,
			lastSubmission: null
		};
		// display discussions
		switch(assignment.get('type')) {
			case 'online':
				// destroy the previous instance
				if(typeof this.getOnlineAssignment() == 'object') {
					this.getOnlineAssignment().destroy();
				}
				// set the xtype
				aconf.xtype = 'onlineassignment';
			break;
			case 'offline':
				// destroy the previous instance
				if(typeof this.getOfflineAssignment() == 'object') {
					this.getOfflineAssignment().destroy();
				}
				// set the xtype
				aconf.xtype = 'offlineassignment';
			break;
			case 'uploadsingle':
				// destroy the previous instance
				if(typeof this.getSingleUploadAssignment() == 'object') {
					this.getSingleUploadAssignment().destroy();
				}
				// set the xtype
				aconf.xtype = 'singleuploadassignment';
			break;
			case 'upload':
				// destroy the previous instance
				if(typeof this.getUploadAssignment() == 'object') {
					this.getUploadAssignment().destroy();
				}
				// set the xtype
				aconf.xtype = 'uploadassignment';
			break;
			default:
				Ext.Msg.alert( 'Assignment type error', 'Unknown assignment type.');
			break;
		}

		var assignment_store = MoodleMobApp.WebService.getAssignmentById(assignment.get('instanceid'), MoodleMobApp.Session.getCourse().get('token'));
		assignment_store.on(
			'load', 
			function(store){
				aconf.settings = store.first().getData(); 
				// check for submissions
				if(aconf.xtype != 'offlineassignment') {
					var submissions_store = MoodleMobApp.WebService.getAssignmentSubmission(assignment.get('instanceid'), MoodleMobApp.Session.getCourse().get('token'));
					submissions_store.on(
						'load', 
						function(store){
							if(store.first().get('id') != 0) {
								aconf.lastSubmission = store.first().getData(); 
							}
							// show the object
							this.getNavigator().push(aconf);
						},
						this,
						{single: true}
					);
				} else { // if this is an offlineassignment then just push it; no submissions available
					this.getNavigator().push(aconf);
				}
			},
			this,
			{single: true}
		);
	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
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

	submitSingleUploadAssignment: function(button) {
		var self = this;
		this.submission_data = this.getSingleUploadAssignment().getValues();
		var file = this.getSingleUploadAssignment().child('fieldset').child('filefield').getFiles().item(0);
		this.submission_data.filename = file.name;
		this.submission_data.draftid = Math.round(Math.random() * 1000000000);
		
		MoodleMobApp.app.showLoadMask('Submitting...');
		// function to execute if the file is read successfully
		var uploadDraftFile = function(filedata) {
				self.submission_data.filedata = filedata;
				// get the filename
				var file_upload_response_store = MoodleMobApp.WebService.uploadDraftFile(self.submission_data, MoodleMobApp.Session.getCourse().get('token'));
				file_upload_response_store.on(
					'load', 
					function(status_store){
						var sub_params = {};
						sub_params.courseid = MoodleMobApp.Session.getCourse().get('id');
						sub_params.instanceid = self.submission_data.instanceid;
						sub_params.fileid = status_store.first().get('fileid');
						var assignment_submission_store = MoodleMobApp.WebService.submitSingleUploadAssignment(sub_params,  MoodleMobApp.Session.getCourse().get('token'));
						assignment_submission_store.on(
							'load',
							function(status_store){
								MoodleMobApp.app.hideLoadMask();
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

		var reader = new FileReader();
		reader.onload = function(e) {
			var content = e.target.result;
			uploadDraftFile(content);
		}

		reader.readAsDataURL(file);
	},	

	addFileSlot: function() {
		var filelist = this.getUploadAssignment().child('fieldset').child('container[name=filelist]');
		filelist.add(
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'filefield',
						flex: 4,
						listeners: {
							change: function() {
								this.setHtml('<div class="filefield-file-name"> Load file: ' + this.getFiles().item(0).name + '</div>');
							}
						}
					},
					{
						xtype: 'button',
						text: 'Drop',
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
		var self = this;
		// check and prepare the files to be uploaded as drafts
		this.submission_data = this.getUploadAssignment().getValues();
		this.submission_data.courseid = MoodleMobApp.Session.getCourse().get('id');
		this.submission_data.uploadFile = new Array();
		this.submission_data.files = new Array();
		this.submission_data.filenames = new Array();
		this.submission_data.draftid = Math.round(Math.random() * 1000000000);
		var filelist = this.getUploadAssignment().child('fieldset').child('container[name=filelist]');
		var fileEntries = filelist.getItems().getCount();
		var files = {}; // this object is used to control the files; avoid duplicates and empty submissions
		for(var i=0; i < fileEntries; ++i) {
			var file = filelist.getAt(i).getAt(0).getFiles().item(0);
			if(file != null) { // ignore file is the slot is empty
				if(files[file.name] == undefined) {
					files[file.name] = file;
					this.submission_data.uploadFile.push(file);
				}
			}
		}
		// check files number; must be at least one file to submit
		if(Object.getOwnPropertyNames(files).length === 0) {
			Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select some files to submit.");
			return;
		}

		MoodleMobApp.app.showLoadMask('Submitting...');
		// function to execute if the file is read successfully
		this.submit = function() {
			if(self.submission_data.isfinal == null) {
				self.submission_data.isfinal = 0;
			}
			var assignment_submission_store = MoodleMobApp.WebService.submitUploadAssignment(self.submission_data,  MoodleMobApp.Session.getCourse().get('token'));
			assignment_submission_store.on(
				'load',
				function(status_store){
					MoodleMobApp.app.hideLoadMask();
					self.backToTheCourseModulesList();
				},
				null,
				{single: true}
			);
		};

		this.uploadDraftFile = function(fdata) {
			//update self.submission_data
			self.submission_data.filedata = fdata;
			var file_upload_response_store = MoodleMobApp.WebService.uploadDraftFile(self.submission_data, MoodleMobApp.Session.getCourse().get('token'));
			file_upload_response_store.on(
				'load',
				function(status_store) {
					self.submission_data.files.push(status_store.first().get('fileid'));
					if(self.submission_data.uploadFile.length > 0) {
						var file = self.submission_data.uploadFile.pop();
						self.submission_data.filename = file.name;
						self.submission_data.filenames.push(self.submission_data.filename);
						self.reader = new FileReader();
						self.reader.onload = self.draftUploaded;
						self.reader.readAsDataURL(file);
					} else { // all draft files have been updated
						// final step: submission
						self.submit();
					}
				},
				null,
				{single: true}
			);
		};

		this.draftUploaded = function(e) {
			var content = e.target.result;
			self.uploadDraftFile(content);
		}

		this.reader = new FileReader();
		this.reader.onload = this.draftUploaded;

		// start the draft uploading chain
		var first_file = this.submission_data.uploadFile.pop();
		this.submission_data.filename = first_file.name;
		// store the filenames for the assignment submission report
		this.submission_data.filenames.push(this.submission_data.filename);
		this.reader.readAsDataURL(first_file);
	},

	getPreviousSubmission: function(assignmentid, successFunc) {
		var submission = MoodleMobApp.WebService.getAssignmentSubmission(assignmentid, MoodleMobApp.Session.getCourse().get('token'));
		submission.on(
			'load',
			function(store) {
				successFunc(store);	
			},
			null,
			{single: true}
		);
	}
});
