Ext.define("MoodleMobApp.view.CourseList", {
	extend: 'Ext.List',
	xtype: 'courselist',

	requires: [ 'MoodleMobApp.store.Courses' ],
	stores: [ 'MoodleMobApp.store.Courses' ],

	config: {
		id: 'course_list',
	   	title: 'Course List', 
		itemTpl: '{name}',
		store: 'courses',
		onItemDisclosure: true,
	},
});
