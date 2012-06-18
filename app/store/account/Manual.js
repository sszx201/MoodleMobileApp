Ext.define('MoodleMobApp.store.account.Manual', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.account.Manual',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'manualaccount_store',
		model: 'MoodleMobApp.model.account.Manual',
		proxy: {
			type: 'localstorage',	
			id: 'manualaccount'
		},
	}
});
