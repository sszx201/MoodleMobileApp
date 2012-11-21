Ext.define('MoodleMobApp.store.Resources', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Resource',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'resources',
		model: 'MoodleMobApp.model.Resource',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'resource',
			type: 'localstorage',
		}
	}
});
