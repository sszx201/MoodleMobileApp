Ext.define('MoodleMobApp.model.DirectoryEntry', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{ name: 'name', type: 'string' },
			{ name: 'isDirectory', type: 'boolean' },
			{ name: 'fullPath', type: 'string' },
			{ name: 'fileEntry', type: 'auto' }
		]
	}
});
