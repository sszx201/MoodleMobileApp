Ext.define('MoodleMobApp.model.Group', {
	extend: 'Ext.data.Model',
		
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'courseid', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'description', type: 'string' }
		]
	}
});
