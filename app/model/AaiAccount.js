Ext.define('MoodleMobApp.model.AaiAccount', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [ 
			{ name: 'username', type: 'string' },
			{ name: 'password', type: 'string' },
			{ name: 'homeorganisation', type: 'string' },
			{ name: 'moodlecookie', type: 'string' }
		]
	}

});
