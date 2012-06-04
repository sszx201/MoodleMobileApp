Ext.define("MoodleMobApp.view.course.List", {
    extend: 'Ext.List',
	xtype: 'courselist',

	stores: [ 'MoodleMobApp.store.course.Courses' ],

    config: {
		id: 'course_list',
       	title: 'Course List', 
		itemTpl: '{name}',
		store: Ext.create('MoodleMobApp.store.course.Courses'),
		onItemDisclosure: true,
    },
});
