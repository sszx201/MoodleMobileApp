Ext.define('MoodleMobApp.model.Folder', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{name: 'rootid', type: 'int'},
			{name: 'parent', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'size', type: 'int'},
			{name: 'mime', type: 'string'},
			{name: 'type', type: 'string'},
			{name: 'url', type: 'string'},
		]
	}
});
