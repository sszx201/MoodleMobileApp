Ext.define('MoodleMobApp.model.Folder', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{ name: 'courseid', type: 'int' },
			{ name: 'rootid', type: 'int' },
			{ name: 'parent', type: 'string' },
			{ name: 'name', type: 'string' },
			{ name: 'fileid', type: 'int' },
			{ name: 'size', type: 'int' },
			{ name: 'mime', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
