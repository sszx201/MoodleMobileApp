Ext.define('MoodleMobApp.store.account.Aai', {
    extend: 'Ext.data.Store',

	requires: [
		'Ext.data.proxy.LocalStorage'
	],

	models: [
		'MoodleMobApp.model.account.Aai',
	],

    config: {
        model: 'MoodleMobApp.model.account.Aai',
		proxy: {
			type: 'localstorage',	
			id: 'aaiaccount'
		},
    }
});
