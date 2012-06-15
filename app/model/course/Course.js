Ext.define('MoodleMobApp.model.course.Course', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'timemodified', type: 'string'},
			{name: 'notify_modification', type: 'boolean'},
			{name: 'token', type: 'string'}
		]
	}
});
