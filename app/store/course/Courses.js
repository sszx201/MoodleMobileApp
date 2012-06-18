Ext.define('MoodleMobApp.store.course.Courses', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.course.Course',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'courses',
		model: 'MoodleMobApp.model.course.Course',
		autoLoad: true,
		proxy : {
			id: 'course',
			type: 'localstorage',
		}
	}
});
