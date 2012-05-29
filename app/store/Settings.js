Ext.define('MoodleMobApp.store.Settings', {
    extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Settings',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
        model: 'MoodleMobApp.model.Settings',
		proxy: {
			type: 'localstorage',	
			id: 'settings'
		},
    }
});
