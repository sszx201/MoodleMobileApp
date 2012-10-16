Ext.define('MoodleMobApp.model.Course', {
	extend: 'Ext.data.Model',
		
	config: {
		fields: [
			{name: 'id', type: 'auto'},
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
