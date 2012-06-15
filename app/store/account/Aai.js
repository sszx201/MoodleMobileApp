Ext.define('MoodleMobApp.store.account.Aai', {
    extend: 'Ext.data.Store',

	requires: [
		'Ext.data.proxy.LocalStorage'
	],

	models: [
		'MoodleMobApp.model.account.Aai',
	],

    config: {
		storeId: 'aaiaccount_store',
        model: 'MoodleMobApp.model.account.Aai',
		proxy: {
			type: 'localstorage',	
			id: 'aaiaccount'
		},
    }
});
