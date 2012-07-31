Ext.define("MoodleMobApp.view.CourseNavigator", {
	extend: 'Ext.navigation.View',
	xtype: 'coursenavigator',
	
	views:[
		'MoodleMobApp.view.CourseList',
	],

	config: {
		id: 'course_navigator',
		autoDestroy: false,
		items: [
			{
				xtype: 'courselist',
			}
		]
	}
});
