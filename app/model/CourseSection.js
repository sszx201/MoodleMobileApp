Ext.define('MoodleMobApp.model.CourseSection', {
	extend: 'Ext.data.Model',
		
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'courseid', type: 'int' },
			{ name: 'number', type: 'int' },
			{ name: 'title', type: 'string' },
			{ name: 'summary', type: 'string' },
			{ name: 'visible', type: 'int' }
		]
	}
});
