Ext.define("MoodleMobApp.view.CourseList", {
	extend: 'Ext.DataView',
	xtype: 'courselist',

	requires: [ 'MoodleMobApp.store.Courses' ],
	stores: [ 'MoodleMobApp.store.Courses' ],

	config: {
		id: 'course_list',
	   	title: 'Course List', 
		itemTpl: '{name}',
		store: 'courses',
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'course',
	},
});
