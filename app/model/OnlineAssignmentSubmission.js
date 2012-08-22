Ext.define('MoodleMobApp.model.OnlineAssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{
				name: 'id', type: 'int',
				name: 'submission', type: 'string',
			}
		]
	}
});
