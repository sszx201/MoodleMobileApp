Ext.define('MoodleMobApp.model.ForumPost', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'id', type: 'int'},
			{name: 'parent', type: 'int'},
			{name: 'userid', type: 'int'},
			{name: 'discussion', type: 'int'},
			{name: 'created', type: 'int'},
			{name: 'modified', type: 'int'},
			{name: 'subject', type: 'string'},
			{name: 'message', type: 'string'},
			{name: 'attachments', type: 'auto'},
			{name: 'indentation', type: 'int'}
		]
	}
});
