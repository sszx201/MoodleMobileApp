Ext.define('MoodleMobApp.store.EnrolledUsers', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.EnrolledUser',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'enrolledusers',
		model: 'MoodleMobApp.model.EnrolledUser',
		groupField: 'courseid',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'enrolleduser',
			type: 'localstorage',
		}
	}
});
