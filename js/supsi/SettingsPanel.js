Ext.define('Supsi.SettingsPanel', {
    extend: 'Ext.Panel',
    xtype: 'settingspanel',
	requires: [
//        'Ext.NestedList',
		'Ext.Button',
		'Ext.Panel'
	],
    config: {
//        fullscreen: true,

//        tabBarPosition: 'bottom',
//        layout: 'hbox',
        items: [
			{
				xtype: 'toolbar',
				layout:{
					pack: "center"
				},
				items: [
					{
						xtype: 'button',
						text: 'A-',
						cls: 'smallerFontBtn',
						id: 'smallerFontBtn'
					},
					{
						xtype: 'button',
						text: 'A+',
						cls: 'biggerFontBtn',
						id: 'biggerFontBtn'
					}
				]
			}
        ]
    }
});
