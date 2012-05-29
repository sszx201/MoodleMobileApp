Ext.define('MoodleMobApp.store.account.Aai', {
    extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.account.Aai',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
        model: 'MoodleMobApp.model.account.Aai',
		proxy: {
			type: 'localstorage',	
			id: 'aaiaccount'
		},
    }
});
