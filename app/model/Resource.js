Ext.define('MoodleMobApp.model.Resource', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'courseid', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'intro', type: 'string' },
			{ name: 'fileid', type: 'int' },
			{ name: 'filename', type: 'string' },
			{ name: 'filemime', type: 'string' },
			{ name: 'filesize', type: 'int' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
