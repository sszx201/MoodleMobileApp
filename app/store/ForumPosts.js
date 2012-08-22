Ext.define('MoodleMobApp.store.ForumPosts', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.ForumPost',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'forumposts',
		model: 'MoodleMobApp.model.ForumPost',
		autoLoad: true,
		proxy : {
			id: 'forumpost',
			type: 'localstorage',
		}
	}
});
