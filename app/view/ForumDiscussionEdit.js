Ext.define("MoodleMobApp.view.ForumDiscussionEdit", {
	extend: 'Ext.form.Panel',
	xtype: 'forumdiscussionedit',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.Button',
		'Ext.field.Text',
		'Ext.field.TextArea',
		'Ext.field.Hidden'
	],

	controllers: [ ],

	config: {
		title: 'Form Discussion Edit',
		listeners: {
		},
		items: [	
			{
				xtype: 'fieldset',
				title: 'Discussion data',
				items: [	
					{
						xtype: 'textfield',
						name: 'name',
						label: 'Subject'
					},
					{
						xtype: 'textareafield',
						name: 'intro',
						label: 'Message'
					},
					{
						xtype: 'hiddenfield',
						name: 'forumid',
						value: 0
					},
					{
						xtype: 'hiddenfield',
						name: 'groupid',
						value: -1
					},
					{
						xtype: 'hiddenfield',
						name: 'attachments',
						value: null
					},
					{
						xtype: 'hiddenfield',
						name: 'format',
						value: 1
					},
					{
						xtype: 'hiddenfield',
						name: 'mailnow',
						value: 0
					},
					{
						xtype: 'button',
						text: 'Save',
						ui: 'confirm',
						action: 'savediscussion'
					}
				]
			}
		]
	}
});
