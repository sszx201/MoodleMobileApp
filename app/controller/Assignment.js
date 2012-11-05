Ext.define('MoodleMobApp.controller.Assignment', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AssignmentSubmission',
			'MoodleMobApp.model.SubmissionResponse',
			'MoodleMobApp.model.OnlineAssignmentSubmission',
		],

		views: [
			'MoodleMobApp.view.OnlineAssignment',
			'MoodleMobApp.view.OfflineAssignment',
		],

		refs: {
			navigator: '#course_navigator',
			moduleList: '#module_list',
			onlineAssignment: '#online_assignment_form',
			onlineAssignmentSubmit: '#online_assignment_form button[action=submit]',
			offlineAssignment: '#offline_assignment_form',
		},

		control: {
			// generic controls
			moduleList: { itemtap: 'selectModule' },
			// specific controls
			onlineAssignment: { deactivate: 'submitOnlineAssignmentCancelled' },
			onlineAssignmentSubmit: { tap: 'submitOnlineAssignment' },
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
				console.log('upload single');
			break;

			case 'upload':
				console.log('multi upload');
			break;

			default:
				Ext.Msg.alert( 'Assignment type error', 'Unknown assignment type.');
			break;
		}

	},

	selectOnlineAssignment: function(assignment) {
		// display assignment
		var previous_submission_record = MoodleMobApp.Session.getOnlineAssignmentSubmissionsStore().getById(assignment.get('id'));
		if(previous_submission_record != null){
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
		var token = MoodleMobApp.Session.getCourse().get('token');
		var submission_status_store = MoodleMobApp.WebService.submitOnlineAssignment(submission_data, token);
		// refresh the discussion content
		submission_status_store.on(
			'load', 
			function(status_store){
				if(status_store.first().get('subid') != null){
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

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},

});
