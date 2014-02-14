Ext.define('MoodleMobApp.store.RecentActivities', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.RecentActivity',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'recentactivities',
		model: 'MoodleMobApp.model.RecentActivity',
		groupField: 'courseid',
		sorters: 'courseid',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'recentactivity',
			type: 'localstorage'
		}
	}
});
