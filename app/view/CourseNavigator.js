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
						id: 'participantsAppBtn',
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
						id: 'multiDownloadsAppBtn',
						iconCls: 'download',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'refreshBtn',
						iconCls: 'refresh',
						hidden: true
					},
					{
						xtype: 'button',
						id: 'settingsAppBtn',
						iconCls: 'settings'
					}
				]
			},
			{
				xtype: 'toolbar',
				docked: 'bottom',
				itemId: 'downloadsToolbar',
				hidden: true,
				items: [
					{
						xtype: 'spacer'
					},
					{
						xtype: 'button',
						text: 'Clear Selection',
						action: 'clearselection'
					},
					{
						xtype: 'button',
						text: 'Select All',
						action: 'selectall'
					},
					{
						xtype: 'button',
						text: 'Download',
						action: 'downloadfiles'
					},
					{
						xtype: 'spacer'
					}
				]
			}
		]
	}
});
