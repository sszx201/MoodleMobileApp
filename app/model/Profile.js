Ext.define('MoodleMobApp.model.Profile', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',

		fields: [
			{ name: 'id', type: 'int' },
			{ name: 'user', type: 'auto' },
			{ name: 'courses', type: 'auto' }
		]
	}
});
