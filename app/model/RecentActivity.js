Ext.define('MoodleMobApp.model.RecentActivity', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'operation', type: 'string' },
			{ name: 'id', type: 'int' },
			{ name: 'ref', type: 'int' },
			{ name: 'courseid', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'modname', type: 'string' },
			{ name: 'timecreated', type: 'int' },
			{ name: 'timemodified', type: 'int' },
			{ name: 'firstname', type: 'string' },
			{ name: 'lastname', type: 'string' }
		]
	}
});
