Ext.define('MoodleMobApp.store.CourseSections', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.CourseSection',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'coursesections',
		model: 'MoodleMobApp.model.CourseSection',
		sorters: 'courseid',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'coursesection',
			type: 'localstorage',
		}
	}
});
