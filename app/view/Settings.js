Ext.define("MoodleMobApp.view.Settings", {
	extend: 'Ext.Panel',
	xtype: 'settings',

	requires: [
		'Ext.TitleBar',
		'Ext.TabPanel',
		'MoodleMobApp.view.AaiAccount',
		'MoodleMobApp.view.ManualAccount'
	],

	config: {
		title: '',
		layout: {
			type: "vbox"
		},
		defaults: { 
			flex: 1
		},
		items: [
			{
				xtype: 'tabpanel',
				tabBar: {
					layout: {
						type: 'hbox',
						align: 'center',
						pack: 'center',
						scrollable: 'horizontal'
					}
    			},
				items: [
					{
						title: 'AAI/NetID',
						xtype: 'aaiaccount'
					},
					{
						title: 'External User',
						xtype: 'manualaccount'
					},
					{
						title: 'App',
						xtype: 'formpanel',
						items: [
							{
								xtype: 'fieldset',
								title: 'Local cache',
								instructions: 'Purge the downloaded data and the downloaded files from the smartphone memory. This does not affect the data and the files on the iCorsi2 platform. <span style="color: red">NOTE: Purging the downloaded files will also clear all the scorm notes.</span>',
								defaults: {
									margin: 10
								},
								items: [
									{
										xtype: 'button',
										text: 'Purge data',
										ui: 'decline',
										action: 'purgedata'
									},
									{
										xtype: 'button',
										text: 'Purge files',
										ui: 'decline',
										action: 'purgefiles'
									}
								]
							},
							{
								xtype: 'fieldset',
								title: 'Downloads',
								items: [
									{
										xtype: 'checkboxfield',
										itemId: 'justdownload',
										name: 'justdownload',
										labelWidth: '80%',
										labelWrap: true,
										label: "Download files without confirming."
									}
								]
							},
							{
								xtype: 'fieldset',
								title: 'Show Recent Activities',
								items: [
									{
										xtype: 'checkboxfield',
										itemId: 'showrecentactivity',
										name: 'showrecentactivity',
										labelWidth: '80%',
										labelWrap: true,
										label: "Show recent activities after the course syncronisation."
									}
								]
							}

						]
					},
					{
						title: 'About',
						xtype: 'about'
					}
				]
			},
			{
				xtype: 'panel',
				cls: 'version',
				docked: 'bottom',
				html: MoodleMobApp.Config.getVersion()
			}
		]
	},

	getTitle: function() {
		return this.title;
	},

	setTitle: function(title) {
		this.title = title;
	}
});
