Ext.define('MoodleMobApp.store.Groups', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Group',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'groups',
		model: 'MoodleMobApp.model.Group',
		sorters: 'courseid',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'group',
			type: 'localstorage'
		}
	}
});
