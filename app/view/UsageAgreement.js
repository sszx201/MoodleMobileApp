Ext.define("MoodleMobApp.view.UsageAgreement", {
	extend: 'Ext.Panel',
	xtype: 'usageagreement',

	config: {
		styleHtmlContent: true,
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: 'Usage Agreement'
			},
			{
				xtype: 'about'
			},
			{
				xtype: 'toolbar',
				docked: 'bottom',
				defaults: {
					flex: 1
				},
				items: [
					{
						xtype: 'button',
						text: 'I understand and agree',
						ui: 'confirm',
						action: 'agree'
					},	
					{
						xtype: 'button',
						text: 'I disagree',
						ui: 'decline',
						action: 'disagree'
					}	
				]
			}
		]
	}
});
