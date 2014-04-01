Ext.define('MoodleMobApp.model.Book', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'course', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'intro', type: 'string' },
			{ name: 'numbering', type: 'int' },
			{ name: 'chapters', type: 'auto' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
