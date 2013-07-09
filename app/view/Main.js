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
				title: 'Account Settings',
				iconCls: 'user',
				xtype: 'accountchoice',
				
			},
			{
				title: 'Shell',
				iconCls: 'info',
				xtype: 'shell',
				
			}
		]
	}
});
