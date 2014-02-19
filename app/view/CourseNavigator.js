Ext.define("MoodleMobApp.view.CourseNavigator", {
	extend: 'Ext.navigation.View',
	xtype: 'coursenavigator',
	
	views:[
		'MoodleMobApp.view.CourseList'
	],

	config: {
		id: 'course_navigator',
		cls: 'course-navigator',
		autoDestroy: false,
		navigationBar: {
			itemId: 'topBar',
			items: [
				{
					xtype: 'button',
					id: 'appBarBtn',
					//iconCls: 'home',
					align: 'right',
					text: 'App Bar'
				}
			]
		},
		items: [
			{
				xtype: 'courselist'
			},
			{
				xtype: 'container',
				id: 'appbar',
				scrollable: 'vertical',
				baseCls: 'appbar',
				docked: 'top',
				right: '-200px',
				height: '100%',
				width: '100px',
				zIndex: 2,
				html: '&nbsp;',
				defaults: {
					margin: 10,
					width: '80%',
					height: '70px',
					ui: 'black_buttons',
					cls: 'app_bar_button'

				},
				items: [
					{
						xtype: 'button',
						id: 'homeAppBtn',
						iconCls: 'home',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'recentActivityAppBtn',
						iconCls: 'bullhorn',
						badgeText: null,
						hidden: true
					},
					{
						xtype: 'button',
						id: 'partecipantsAppBtn',
						iconCls: 'team',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'gradesAppBtn',
						iconCls: 'compose',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'calendarAppBtn',
						iconCls: 'calendar',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'settingsAppBtn',
						iconCls: 'settings'
					}
				]
			}
		]
	}
});
