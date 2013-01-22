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
				iconCls: 'usi_home',
				xtype: 'coursenavigator'
			},
			{
				title: 'Account Settings',
				iconCls: 'usi_user',
				xtype: 'accountchoice',
				
			},
			{
				title: 'Shell',
				iconCls: 'usi_info',
				xtype: 'shell',
				
			}
		]
	}
});
