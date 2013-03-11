Ext.define('MoodleMobApp.model.UploadAssignmentSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'files', type: 'auto' } // javascript array of filenames uploaded
		]
	}
});
