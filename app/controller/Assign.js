Ext.define('MoodleMobApp.controller.Assign', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Assign',
			'MoodleMobApp.model.AssignSubmission',
			'MoodleMobApp.model.AssignReport',
			'MoodleMobApp.model.FileUploadResponse',
		],

		views: [
			'MoodleMobApp.view.Assign',
		],

		refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			assign: 'assign',
			addFileSlotButton: 'assign button[action=addfile]',
			submitButton: 'assign button[action=submit]',
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			addFileSlotButton: { tap: 'addFileSlot' },
			submitButton: { tap: 'submitAssign' },
		}
	},

	init: function(){
		Ext.a = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'assign'){
			this.selectAssign(record);
		}
	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},

	selectAssign: function(assign) {
		if(typeof this.getAssign() == 'object') {
			this.getAssign().destroy(); // if the previous instance is still there remove it
		}
		
		// assign view config object
		var aconf = {
			xtype: 'assign',
			record: assign,
			settings: null,
			lastSubmission: null,
		};
		var assign_store = MoodleMobApp.WebService.getAssignById(assign.get('instanceid'), MoodleMobApp.Session.getCourse().get('token'));
		assign_store.on(
			'load', 
			function(store){
				aconf.settings = store.first().getData(); 
				// check for submissions
				var submissions_store = MoodleMobApp.WebService.getAssignSubmission(assign.get('instanceid'), MoodleMobApp.Session.getCourse().get('token'));
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
			},
			this,
			{single: true}
		);
	},

	addFileSlot: function() {
		var filelist = this.getAssign().child('fieldset').child('container[cls=filelist]');
		if(filelist.getItems().getCount() < this.getAssign().config.settings.plugconf.files.assignsubmission.maxfilesubmissions) {
			filelist.add(
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
		} else {
			Ext.Msg.alert("Submission max file number", "The max number of file allowed in this assignment has been reached. No more files can be attached.");
		}
	},

	submitAssign: function(button) {
		// check and prepare the files to be uploaded as drafts
		// check files number; must be at least one file to submit
		var submission_data = this.getAssign().getValues();

		var self = this;
		//MoodleMobApp.app.showLoadMask('Submitting...');
		// function to execute if the file is read successfully
		var submit = function(params) {
			params.courseid = MoodleMobApp.Session.getCourse().get('id');
			params.instanceid = submission_data.instanceid;
			if(params.teamsubmission == null) params.teamsubmission = 0;
			var assign_submission_store = MoodleMobApp.WebService.submitAssign(params,  MoodleMobApp.Session.getCourse().get('token'));
			assign_submission_store.on(
				'load',
				function(status_store){
					MoodleMobApp.app.hideLoadMask();
					self.backToTheCourseModulesList();
				},
				null,
				{single: true}
			);
		};

		if(this.getAssign().config.settings.plugconf.files.assignsubmission.enabled == 1) { // submit with files
			submission_data.uploadFile = new Array();
			submission_data.files = new Array();
			submission_data.filenames = new Array();
			var filelist = this.getAssign().child('fieldset').child('container[cls=filelist]');
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
			// check if the submission is empty.
			// there must be some files to upload.
			if(Object.getOwnPropertyNames(files).length === 0) {
				Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select some files to submit.");
				return;
			}
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
			

			// generate a random draft itemid
			submission_data.draftid = Math.round(Math.random() * 1000000000);
			// start the draft uploading chain
			var first_file = submission_data.uploadFile.pop();
			submission_data.filename = first_file[0].name;
			// store the filenames for the assignment submission report
			submission_data.filenames.push(submission_data.filename);
			reader.readAsDataURL(first_file[0]);
		} else {
			if(submission_data.onlinetext === "") {
				Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please write some text before submitting.");
				return;
			} else {
				submit(submission_data);
			}
		}


	},


});
