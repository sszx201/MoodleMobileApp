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
						text: 'Clear all',
						ui: 'confirm',
						action: 'clear_all_db',	
					},
					{
						xtype: 'button',
						text: 'Clear courses db',
						ui: 'confirm',
						action: 'clear_courses_db',	
					},
					{
						xtype: 'button',
						text: 'Clear modules db',
						ui: 'confirm',
						action: 'clear_modules_db',	
					},
					{
						xtype: 'button',
						text: 'Clear users db',
						ui: 'confirm',
						action: 'clear_users_db',	
					},
					{
						xtype: 'button',
						text: 'Clear enrolled users db',
						ui: 'confirm',
						action: 'clear_enrolled_users_db',	
					},
					{
						xtype: 'button',
						text: 'Clear forum discussions db',
						ui: 'confirm',
						action: 'clear_forum_discussions_db',	
					},
					{
						xtype: 'button',
						text: 'Clear forum posts db',
						ui: 'confirm',
						action: 'clear_forum_posts_db',	
					},


				]
			}
		]
	}
});
