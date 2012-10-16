Ext.define('MoodleMobApp.model.OnlineAssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{
				name: 'id', type: 'auto',
				name: 'submission', type: 'string',
			}
		]
	}
});
