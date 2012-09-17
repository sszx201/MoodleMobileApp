Ext.define('MoodleMobApp.store.EnroledUsers', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.EnroledUser',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'enroledusers',
		model: 'MoodleMobApp.model.EnroledUser',
		groupField: 'courseid',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'enroleduser',
			type: 'localstorage',
		}
	}
});
