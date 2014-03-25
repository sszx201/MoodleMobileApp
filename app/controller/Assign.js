Ext.define('MoodleMobApp.controller.Assign', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Assign',
			'MoodleMobApp.model.AssignSubmission',
			'MoodleMobApp.model.AssignReport',
			'MoodleMobApp.model.FileUploadResponse'
		],

		views: [
			'MoodleMobApp.view.Assign'
		],

		refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			assign: 'assign',
			addFileSlotButton: 'assign button[action=addfile]',
			submitButton: 'assign button[action=submit]',
			recentActivity: 'recentactivitylist'
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			addFileSlotButton: { tap: 'addFileSlot' },
			submitButton: { tap: 'submitAssign' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'assign') {
						var assign_record = MoodleMobApp.Session.getModulesStore().findRecord('id', record.get('moduleid'));
						if(assign_record != undefined) {
							this.selectAssign(assign_record);
						}
					}
				}
			}
		}
	},

	init: function(){
		Ext.a = this;
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'assign') {
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
			lastSubmission: null
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
			filelist.add({
				xtype: 'fileslot',
				label: 'File Entry',
				clickToSelect: false,
				droppable: true
			});
		} else {
			Ext.Msg.alert("Submission max file number", "The max number of file allowed in this assignment has been reached. No more files can be attached.");
		}
	},

	submitAssign: function(button) {
		var self = this;
		// check and prepare the files to be uploaded as drafts
		// check files number; must be at least one file to submit
		this.submission_data = this.getAssign().getValues();
		self.submission_data.courseid = MoodleMobApp.Session.getCourse().get('id');
		// function to execute if the file is read successfully
		this.submit = function() {
			if(self.submission_data.teamsubmission == null) {
				self.submission_data.teamsubmission = 0;
			}
			var assign_submission_store = MoodleMobApp.WebService.submitAssign(self.submission_data,  MoodleMobApp.Session.getCourse().get('token'));
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
			this.submission_data.uploadFile = new Array();
			this.submission_data.files = new Array();
			this.submission_data.filenames = new Array();
			var filelist = this.getAssign().child('fieldset').child('container[cls=filelist]');
			var fileEntries = filelist.getItems().getCount();
			var files = {}; // this object is used to control the files; avoid duplicates and empty submissions
			for(var i=0; i < fileEntries; ++i) {
				var file = filelist.getAt(i).getFile();
				if(file != null) { // ignore file is the slot is empty
					if(files[file.name] == undefined) {
						files[file.name] = file;
						this.submission_data.uploadFile.push(file);
					}
				}
			}
			// check if the submission is empty.
			// there must be some files to upload.
			if(Object.getOwnPropertyNames(files).length === 0) {
				Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select some files to submit.");
				return;
			}

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

			// generate a random draft itemid
			this.submission_data.draftid = Math.round(Math.random() * 1000000000);
			// start the draft uploading chain
			var first_file = this.submission_data.uploadFile.pop();
			this.submission_data.filename = first_file.name;
			// store the filenames for the assignment submission report
			this.submission_data.filenames.push(this.submission_data.filename);
			// start the submission process
			MoodleMobApp.app.showLoadMask('Submitting...');
			this.reader.readAsDataURL(first_file);
		} else {
			if(this.submission_data.onlinetext === "") {
				Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please write some text before submitting.");
				return;
			} else {
				this.submit();
			}
		}
	}
});
