Ext.define('MoodleMobApp.model.ManualAccount', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [ 
			{ name: 'username', type: 'string' },
			{ name: 'password', type: 'string' }
		]
	}
});
