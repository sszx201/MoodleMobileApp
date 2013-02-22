Ext.define("MoodleMobApp.view.Partecipants", {
	extend: 'Ext.DataView',
	xtype: 'partecipants',
	requires: [ ],
	config: {
		id: 'partecipants',
	   	title: 'Partecipants', 
		emptyText: 'No partecipants in this course.',
		useComponents: true,
		defaultType: 'partecipant',
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
						action: 'clearselection',
					},
					{
						xtype: 'button',	
						text: 'All',
						action: 'selectall',
					},
					{
						xtype: 'button',	
						text: 'Contact',
						action: 'contactpartecipants',
					},
					{
						xtype: 'spacer'
					},
				]
			},
		],
	},
});

