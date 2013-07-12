Ext.define('MoodleMobApp.controller.Assign', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AssignSubmission',
			'MoodleMobApp.model.FileUploadResponse',
		],

		views: [
			'MoodleMobApp.view.Assign',
		],

		refs: {
			navigator: '#course_navigator',
			moduleList: '#module_list',
			assign: '#assign_form',
			assignAddFile: '#assign_form button[action=addfile]',
			assignSubmit: '#assign_form button[action=submit]',
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			assignAddFile: { tap: 'addFile' },
			assignSubmit: { tap: 'submitAssign' },
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

	selectAssign: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getAssignSubmissionsStore().getById(assignment.get('id'));

		if(previous_submission_record != null) {
			assignment.set('submission', previous_submission_record.get('filename'));
		}

		if(typeof this.getAssign() == 'object') {
			this.getAssign().setRecord(assignment);
			this.getNavigator().push(this.getAssign());
		} else {
			this.getNavigator().push({
				xtype: 'assign',
				record: assignment
			});
		}
	},

	addFile: function() {
		var fieldset = this.getAssign().child('fieldset');
		// get the formdata
		//var newfile = fieldset.child('#filepath').getValue().split(/(\\|\/)/g).pop();
		var newfile = fieldset.child('#filepath').getValue();
		fieldset.child('#filepath').setValue('');
		if(newfile == '' || newfile == null) {
			Ext.Msg.alert("File Choice", "Please select a file first.");
		} else if(fieldset.child('textfield[value="'+newfile+'"]') != null) {
			Ext.Msg.alert("File Choice", "This file has already be chosen. Please select a different one.");
		} else {
			fieldset.insert(
				0,
				{
					xtype: 'textfield',
					name: 'filelist',
					value: newfile,
					listeners: {
						clearicontap: function(self){
							self.destroy();
						}
					}
				}
			);
		}
	},

	submitAssign: function(button) {
		var submission_data = this.getAssign().getValues();
		// check data
		if(submission_data.filelist == undefined) {
			Ext.Msg.alert("Submission empty", "The submission cannot be empty. Please select some files to submit.");
			return;
		}

		MoodleMobApp.app.showLoadMask('Submitting...');
		var self = this;
		submission_data.files = new Array();
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
					//self.storeTheUploadSubmission(params);
					self.backToTheCourseModulesList();
				},
				null,
				{single: true}
			);
		};

		var uploadDraftFile = function(fdata, params) {
			//update params
			params.filename = params.filepath.split(/(\\|\/)/g).pop();
			params.filedata = fdata;
			var file_upload_response_store = MoodleMobApp.WebService.uploadDraftFile(params, MoodleMobApp.Session.getCourse().get('token'));
			file_upload_response_store.on(
				'load',
				function(status_store) {
					params.files.push(status_store.first().get('fileid'));
					if(params.filelist.length > 0) {
						var fpath = params.filelist.pop();
						params.filepath = fpath;
						MoodleMobApp.app.readFile(fpath, uploadDraftFile, params);
					} else { // all draft files have been updated
						submit(params);
					}
				},
				null,
				{single: true}
			);
		};

		if(typeof submission_data.filelist == 'string') { // only one file to submit
			var entry = submission_data.filelist;
			submission_data.filelist = new Array();
			submission_data.filelist.push(entry);
		}

		var fpath = submission_data.filelist.pop();
		submission_data.filepath = fpath;
		MoodleMobApp.app.readFile(fpath, uploadDraftFile, submission_data);
	},

	storeTheSubmission: function(data){
		if(MoodleMobApp.Session.getAssignSubmissionsStore().find('id', data.id) == -1){
			var submission_record = Ext.create('MoodleMobApp.model.AssignSubmission', data);
			submission_record.setDirty();
			MoodleMobApp.Session.getAssignSubmissionsStore().add(submission_record);
		} else {
			MoodleMobApp.Session.getAssignSubmissionsStore().getById(data.id).setData(data);
			MoodleMobApp.Session.getAssignSubmissionsStore().getById(data.id).setDirty();
		}

		MoodleMobApp.Session.getAssignSubmissionsStore().sync()
	},

});
