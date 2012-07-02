Ext.define('MoodleMobApp.model.course.ModuleList', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'instanceid', type: 'int'},
			{name: 'courseid', type: 'int'},
			{name: 'modname', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'intro', type: 'string'},
			{name: 'timemodified', type: 'int'}
		]
	}
});
