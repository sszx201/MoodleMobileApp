Ext.define('MoodleMobApp.store.AaiAccount', {
	extend: 'Ext.data.Store',

	requires: [
		'Ext.data.proxy.LocalStorage'
	],

	models: [
		'MoodleMobApp.model.AaiAccount',
	],

	config: {
		storeId: 'aaiaccount_store',
		model: 'MoodleMobApp.model.AaiAccount',
		autoLoad: true,
		//autoSync: true,
		proxy: {
			type: 'localstorage',	
			id: 'aaiaccount'
		}
	}
});
