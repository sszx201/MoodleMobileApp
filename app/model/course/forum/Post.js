Ext.define('MoodleMobApp.model.course.forum.Post', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'parent', type: 'int'},
			{name: 'userid', type: 'int'},
			{name: 'modified', type: 'string'},
			{name: 'subject', type: 'string'},
			{name: 'message', type: 'string'},
			{name: 'indentation', type: 'int'}
		]
	}
});
