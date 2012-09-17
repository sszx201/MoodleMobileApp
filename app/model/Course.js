Ext.define('MoodleMobApp.model.Course', {
	extend: 'Ext.data.Model',
		
	config: {
		idProperty: 'id',
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'timemodified', type: 'int'},
			{name: 'token', type: 'string'},
			{name: 'modules', type: 'int', defaultValue: 0},
			{name: 'isnew', type: 'boolean'},
			{name: 'newmodules', type: 'int', defaultValue: 0},
			{name: 'modulestatus', type: 'string', defaultValue: 'counting modules...'},
		]
	}
});
