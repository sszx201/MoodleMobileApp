Ext.define('MoodleMobApp.store.Pages', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Page',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'pages',
		model: 'MoodleMobApp.model.Page',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'pages',
			type: 'localstorage'
		}
	}
});
