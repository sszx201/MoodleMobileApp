Ext.define("iCorsi.view.Main", {
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
                title: 'iCorsi home',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: [
					{
						docked: 'top',
						xtype: 'titlebar',
						title: 'iCorsi Mobile app'
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
