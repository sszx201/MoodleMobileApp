Ext.define('MoodleMobApp.store.Users', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.User',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'users',
		model: 'MoodleMobApp.model.User',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'user',
			type: 'localstorage'
		}
	}
});
