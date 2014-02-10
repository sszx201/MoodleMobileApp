Ext.define('MoodleMobApp.store.Url', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Url',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'url',
		model: 'MoodleMobApp.model.Url',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'url',
			type: 'localstorage'
		}
	}
});
