Ext.define("MoodleMobApp.view.Shell", {
	extend: 'Ext.form.Panel',
	xtype: 'shell',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.field.Text',
		'Ext.field.TextArea',
		'Ext.Button',
	],

	controllers: [
		'MoodleMobApp.controller.Shell'
	],

	config: {
		id: 'shell',
		items: [
			{
				docked: 'top',
				xtype: 'titlebar',
				title: 'Shell',
				iconCls: 'settings'
			},
			{
				xtype: 'fieldset',
				items: [	
					{
						id: 'output',
						xtype: 'textareafield',	
						name: 'output',
						label: 'Output'
					},
					{
						id: 'prompt',
						xtype: 'textfield',	
						name: 'prompt',
						label: 'Prompt'
					},
					{
						xtype: 'button',
						text: 'Run',
						ui: 'confirm',
						action: 'run',	
					},
					{
						xtype: 'button',
						text: 'Clear Databases',
						ui: 'confirm',
						action: 'clear_all_db',	
					},

				]
			}
		]
	}
});
