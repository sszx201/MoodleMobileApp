Ext.define('MoodleMobApp.model.ForumCreateDiscussionResponse', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{name: 'discid', type: 'int'},
			{name: 'postid', type: 'int'}
		]
	}
});
