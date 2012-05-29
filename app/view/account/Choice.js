Ext.define("iCorsi.view.account.Choice", {
    extend: 'Ext.Panel',
	xtype: 'accountchoice',

    requires: [
        'Ext.TitleBar',
        'iCorsi.view.account.Aai',
        'iCorsi.view.account.Manual',
    ],

    config: {
		id: 'accountchoice_panel',

		layout: {
			type: "card",
			animation: {
				type: "slide",
				direction: "left"
			}
		},
        items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				items: [
					{
						xtype: 'spacer'
					},
					{
						xtype: 'button',	
						text: 'AAI/NetID account',
						action: 'select_aai_account',
					},
					{
						xtype: 'button',	
						text: 'External user account',
						action: 'select_manual_account',
					},

				]
			},
            {
                title: 'AAI/NetID account',
                xtype: 'aaiaccount',
            },
			{
                title: 'External User account',
                xtype: 'manualaccount',
            }

        ]
    }
});
