Ext.define("MoodleMobApp.view.Settings", {
	extend: 'Ext.Panel',
	xtype: 'settings',

	requires: [
		'Ext.TitleBar',
		'MoodleMobApp.view.AaiAccount',
		'MoodleMobApp.view.ManualAccount',
	],

	config: {
		layout: {
			type: "vbox",
		},
		defaults: { 
			flex: 1,
		},
		items: [
			{
				docked: 'top',
				xtype: 'titlebar',
				title: 'Settings',
				iconCls: 'user'
			},
			{
				xtype: 'tabpanel',
				tabBar: {
					layout: {
						type: 'hbox',
						align: 'center',
						pack: 'center'
					}
    			},
				items: [
					{
						title: 'AAI/NetID account',
						xtype: 'aaiaccount',
					},
					{
						title: 'External User account',
						xtype: 'manualaccount',
					}
				]
			},
			{
				xtype: 'formpanel',
				items: [
					{
					xtype: 'fieldset',
					title: 'Local cache',
					instructions: 'Purge the downloaded data and the downloaded files from the smartphone memory. This does not affect the data and the files on the iCorsi platform. <span style="color: red">NOTE: Purging the downloaded files will also clear all the scorm notes.</span>',
					defaults: {
						margin: 10,
					},
					items: [
						{
							xtype: 'button',
							text: 'Purge data',
							ui: 'decline',
							action: 'purgedata',
						},
						{
							xtype: 'button',
							text: 'Purge files',
							ui: 'decline',
							action: 'purgefiles',	
						}
					]
				}
			]
			},

		]
	}
});
