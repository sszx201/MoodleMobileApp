Ext.define("MoodleMobApp.view.Main", {
	extend: 'Ext.tab.Panel',

	requires: [
		'MoodleMobApp.view.course.Navigator',
		'MoodleMobApp.view.course.List',
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
				
			}

		]
	}
});
