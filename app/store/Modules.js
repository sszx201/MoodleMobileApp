Ext.define('MoodleMobApp.store.Modules', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Module',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'modules',
		model: 'MoodleMobApp.model.Module',
		autoLoad: true,
		proxy : {
			id: 'module',
			type: 'localstorage',
		}
	}
});
