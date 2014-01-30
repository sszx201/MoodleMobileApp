Ext.define('MoodleMobApp.store.Groupings', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Grouping',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'groupings',
		model: 'MoodleMobApp.model.Grouping',
		sorters: 'courseid',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'grouping',
			type: 'localstorage',
		}
	}
});
