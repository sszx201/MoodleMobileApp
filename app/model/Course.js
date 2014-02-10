Ext.define('MoodleMobApp.model.Course', {
	extend: 'Ext.data.Model',
		
	config: {
		fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'name', type: 'string' },
			{ name: 'format', type: 'string' },
			{ name: 'startdate', type: 'int' },
			{ name: 'timemodified', type: 'int' },
			{ name: 'token', type: 'string' },
			{ name: 'modules', type: 'int', defaultValue: 0 },
			{ name: 'isnew', type: 'boolean' },
			{ name: 'synchronized', type: 'boolean', defaultValue: false },
			{ name: 'newmodules', type: 'int', defaultValue: 0 },
			{ name: 'modulestatus', type: 'string', defaultValue: '<img src="resources/images/sync.png" />' }
		]
	}
});
