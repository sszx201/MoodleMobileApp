Ext.define('MoodleMobApp.store.Settings', {
    extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Settings',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
		storeId: 'settings_store',
        model: 'MoodleMobApp.model.Settings',
		proxy: {
			type: 'localstorage',	
			id: 'settings'
		},
    }
});
