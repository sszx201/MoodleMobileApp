Ext.define('MoodleMobApp.model.User', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'username', type: 'string' },
			{ name: 'firstname', type: 'string' },
			{ name: 'lastname', type: 'string' },
			{ name: 'email', type: 'string' },
			{ name: 'phone', type: 'string' },
			{ name: 'skype', type: 'string' },
			{ name: 'city', type: 'string' },
			{ name: 'country', type: 'string' },
			{ name: 'lang', type: 'string' },
			{ name: 'avatar', type: 'string' },
			{ name: 'deleted', type: 'int' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
