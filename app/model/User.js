Ext.define('MoodleMobApp.model.User', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'username', type: 'string' },
			{ name: 'idnumber', type: 'int' },
			{ name: 'firstname', type: 'string' },
			{ name: 'lastname', type: 'string' },
			{ name: 'email', type: 'string' },
			{ name: 'city', type: 'string' },
			{ name: 'country', type: 'string' },
			{ name: 'lang', type: 'string' },
			{ name: 'avatar', type: 'string' },
			{ name: 'timemodified', type: 'string' }
		]
	}
});
