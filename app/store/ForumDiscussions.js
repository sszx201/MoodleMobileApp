Ext.define('MoodleMobApp.store.ForumDiscussions', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.ForumDiscussion',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'forumdiscussions',
		model: 'MoodleMobApp.model.ForumDiscussion',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'forumdiscussion',
			type: 'localstorage',
		}
	}
});
