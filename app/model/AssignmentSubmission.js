Ext.define('MoodleMobApp.model.AssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'auto'},
			{name: 'assignment', type: 'int'},
			{name: 'userid', type: 'int'},
			{name: 'data1', type: 'string'},
			{name: 'grade', type: 'float'},
			{name: 'submissioncomment', type: 'string'},
		]
	}
});
