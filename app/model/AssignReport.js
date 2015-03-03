Ext.define('MoodleMobApp.model.AssignReport', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{ name: 'courseid', type: 'int' },
			{ name: 'instanceid', type: 'int' },
			{ name: 'settings', type: 'auto' },
			{ name: 'submission', type: 'auto' }
		]
	}
});
