Ext.define('MoodleMobApp.model.course.EnrolledUser', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{name: 'courseid', type: 'int'},
			{name: 'userid', type: 'int'},
		]
	}
});
