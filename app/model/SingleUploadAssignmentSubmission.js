Ext.define('MoodleMobApp.model.SingleUploadAssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'filename', type: 'string' }
		]
	}
});
