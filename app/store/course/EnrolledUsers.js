Ext.define('MoodleMobApp.store.course.EnrolledUsers', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.course.EnrolledUser',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'enrolledusers',
		model: 'MoodleMobApp.model.course.EnrolledUser',
		groupField: 'courseid',
		autoLoad: true,
		proxy : {
			id: 'enrolleduser',
			type: 'localstorage',
		}
	}
});
