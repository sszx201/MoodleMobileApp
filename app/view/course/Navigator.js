Ext.define("MoodleMobApp.view.course.Navigator", {
	extend: 'Ext.navigation.View',
	xtype: 'coursenavigator',
	
	views:[
		'MoodleMobApp.view.course.List',
	],

	config: {
		id: 'course_navigator',
		items: [
			{
				xtype: 'courselist',
			}
		]
	}
});
