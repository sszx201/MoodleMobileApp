Ext.define('MoodleMobApp.store.Books', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Book',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'books',
		model: 'MoodleMobApp.model.Book',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'books',
			type: 'localstorage'
		}
	}
});
