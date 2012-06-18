Ext.define("MoodleMobApp.view.course.Content", {
	extend: 'Ext.List',
	xtype: 'coursecontent',

	//stores: [ 'MoodleMobApp.store.course.Courses' ],

	config: {
		id: 'course_content',
	   	title: 'Course Content', 
		itemTpl: '{name}',
		//store: Ext.create('MoodleMobApp.store.course.Courses'),
		/*
		data: [
			{name: 'ciao'},
			{name: 'miao'},
		],
		*/
		onItemDisclosure: true,
	},
});
