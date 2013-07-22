Ext.define('MoodleMobApp.store.Modules', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Module',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'modules',
		model: 'MoodleMobApp.model.Module',
		groupField: 'section',
		sorters: 'modname',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'module',
			type: 'localstorage',
		}
	}
});
