Ext.define('MoodleMobApp.model.AssignSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'id', type: 'int' },
			{ name: 'assignment', type: 'int' },
			{ name: 'grade', type: 'int' },
			{ name: 'usertext', type: 'string' }, // javascript array of filenames uploaded
			{ name: 'userfiles', type: 'auto' } ,
			{ name: 'timecreated', type: 'int' },
			{ name: 'timemodified', type: 'int' },
			{ name: 'status', type: 'int' }
		]
	}
});
