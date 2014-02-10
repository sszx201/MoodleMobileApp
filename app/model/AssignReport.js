Ext.define('MoodleMobApp.model.AssignReport', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'assign', type: 'auto' },
			{ name: 'submission', type: 'auto' }
		]
	}
});
