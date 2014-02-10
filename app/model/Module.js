Ext.define('MoodleMobApp.model.Module', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'courseid', type: 'int' },
			{ name: 'instanceid', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'intro', type: 'string' },
			{ name: 'modname', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'section', type: 'int' },
			{ name: 'order', type: 'int' },
			{ name: 'groupmode', type: 'int' }, // 0: no groups, 1: separated groups, 2: visible groups
			{ name: 'groupingid', type: 'int' },
			{ name: 'timemodified', type: 'int' },
			{ name: 'isnew', type: 'boolean' },
			{ name: 'isupdated', type: 'boolean' }
		]
	}
});
