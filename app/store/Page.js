Ext.define('MoodleMobApp.store.Page', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Page',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'page',
		model: 'MoodleMobApp.model.Page',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'page',
			type: 'localstorage',
		}
	}
});
