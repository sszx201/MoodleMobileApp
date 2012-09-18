Ext.define("MoodleMobApp.view.CourseList", {
	extend: 'Ext.DataView',
	xtype: 'courselist',

	requires: [ 'MoodleMobApp.store.Courses' ],
	stores: [ 'MoodleMobApp.store.Courses' ],

	config: {
		id: 'course_list',
	   	title: 'Course List', 
		store: 'courses',
		emptyText: 'No courses available.',
		useComponents: true,
		defaultType: 'course',
	},
});
