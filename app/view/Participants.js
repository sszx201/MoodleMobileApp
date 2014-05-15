Ext.define("MoodleMobApp.view.Participants", {
	extend: 'Ext.DataView',
	xtype: 'participants',
	requires: [ ],
	config: {
	   	title: 'Participants', 
		emptyText: 'No participants in this course.',
		useComponents: true,
		defaultType: 'participant',
		items: [
			{
				xtype: 'toolbar',
				docked: 'bottom',
				items: [
					{
						xtype: 'spacer'
					},
					{
						xtype: 'button',	
						text: 'Clear',
						action: 'clearselection'
					},
					{
						xtype: 'button',	
						text: 'All',
						action: 'selectall'
					},
					{
						xtype: 'button',	
						text: 'Contact',
						action: 'contactparticipants'
					},
					{
						xtype: 'spacer'
					}
				]
			}
		]
	}
});

