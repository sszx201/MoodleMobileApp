Ext.define('MoodleMobApp.model.FileUploadResponse', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{ name: 'fileid', type: 'int' },
			{ name: 'filename', type: 'string' }
		]
	}
});
