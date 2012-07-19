Ext.define('MoodleMobApp.model.Course', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'hasnewcontent', type: 'boolean'},
			{name: 'timemodified', type: 'string'},
			{name: 'token', type: 'string'}
		]
	}
});
