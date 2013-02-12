Ext.define('MoodleMobApp.store.Choices', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Choice',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'choices',
		model: 'MoodleMobApp.model.Choice',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'choice',
			type: 'localstorage',
		}
	}
});
