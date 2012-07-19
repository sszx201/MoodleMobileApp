Ext.define('MoodleMobApp.store.ManualAccount', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.ManualAccount',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'manualaccount_store',
		model: 'MoodleMobApp.model.ManualAccount',
		proxy: {
			type: 'localstorage',	
			id: 'manualaccount'
		},
	}
});
