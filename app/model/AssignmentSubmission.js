Ext.define('MoodleMobApp.model.AssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'auto'},
			{name: 'assignment', type: 'int'},
			{name: 'userid', type: 'int'},
			{name: 'usertext', type: 'string'},
			{name: 'userfiles', type: 'auto'},
			{name: 'submissioncomment', type: 'string'},
			{name: 'grade', type: 'float'},
			{name: 'timemodified', type: 'auto'},
		]
	}
});
