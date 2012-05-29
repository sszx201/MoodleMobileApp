Ext.define("MoodleMobApp.view.Main", {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'MoodleMobApp home',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: [
					{
						docked: 'top',
						xtype: 'titlebar',
						title: 'MoodleMobApp Mobile app'
                	}
				],

                html: [
                    "Here bellow are listed your courses"
                ].join("")
            },
			{
                title: 'Account Settings',
                iconCls: 'user',
				xtype: 'accountchoice',
				
            }

        ]
    }
});
