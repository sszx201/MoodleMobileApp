Ext.define('MoodleMobApp.controller.Assignment', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.AssignmentSubmission',
		],

		views: [
			'MoodleMobApp.view.OnlineAssignment',
		],

		refs: {
			navigator: '#course_navigator',
			moduleList: '#module_list',
			onlineAssignment: '#online_assignment_form',
			onlineAssignmentSubmit: '#online_assignment_form button[action=submit]',
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
		if(record.raw.modname === 'assignment'){
			this.selectAssignment(record);
		}
	},

	selectAssignment: function(assignment) {
		console.log(assignment);
		// display discussions
		switch(assignment.raw.type) {
			case 'online':
				this.selectOnlineAssignment(assignment);
			break;

			case 'uploadsingle':
				console.log('upload single');
			break;

			case 'upload':
				console.log('upload shitload');
			break;

			default:
				Ext.Msg.alert( 'Assignment type error', 'Unknown assignment type.');
			break;
		}

	},

	selectOnlineAssignment: function(assignment) {
		// display discussions
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
		var submission_status_store = MoodleMobApp.WebService.submitOnlineAssignment(this.getOnlineAssignment().getValues());
		// refresh the discussion content
		submission_status_store.on(
			'load', 
			function(){
				this.backToTheCourseModulesList();
			},
			this,
			{single: true}
 		);
	},

	submitOnlineAssignmentCancelled: function() {
		this.backToTheCourseModulesList();
	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	}

});
