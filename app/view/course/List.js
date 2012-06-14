Ext.define("MoodleMobApp.view.course.List", {
    extend: 'Ext.List',
	xtype: 'courselist',

	requires: [ 'MoodleMobApp.store.course.Courses' ],
	stores: [ 'MoodleMobApp.store.course.Courses' ],

    config: {
		id: 'course_list',
       	title: 'Course List', 
		itemTpl: '{name}',
		store: 'courses',
		onItemDisclosure: true,
    },
});
