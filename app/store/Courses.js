Ext.define('MoodleMobApp.store.Courses', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Course',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'courses',
		model: 'MoodleMobApp.model.Course',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'course',
			type: 'localstorage',
		}
	}
});
