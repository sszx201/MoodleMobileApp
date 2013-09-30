Ext.define("MoodleMobApp.view.Main", {
	extend: 'Ext.tab.Panel',

	requires: [
		'MoodleMobApp.view.CourseNavigator',
		'MoodleMobApp.view.CourseList',
	],

	config: {
		tabBarPosition: 'bottom',

		items: [
			{
				title: 'Courses',
				iconCls: 'home',
				xtype: 'coursenavigator'
			},
			{
				title: 'Settings',
				iconCls: 'settings',
				xtype: 'settings',
			},
		]
	}
});
