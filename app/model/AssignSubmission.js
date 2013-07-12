Ext.define('MoodleMobApp.model.AssignSubmission', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'files', type: 'auto' } // javascript array of filenames uploaded
		]
	}
});
