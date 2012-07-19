Ext.define("MoodleMobApp.view.ManualAccount", {
	extend: 'Ext.form.Panel',
	xtype: 'manualaccount',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.field.Text',
		'Ext.field.Password'
	],
	
	config: {
		id: 'manualaccount_form',
		items: [
			{
				docked: 'top',
				xtype: 'titlebar',
				title: 'Your External User profile',
				iconCls: 'user'
			},
			{
				xtype: 'fieldset',
				items: [
					{
						xtype: 'textfield',	
						name: 'username',
						label: 'Username'
					},
					{
						xtype: 'passwordfield',	
						name: 'password',
						label: 'Password'
					},
					{
						xtype: 'button',
						text: 'Save',
						ui: 'confirm',
						action: 'save',	
					}

				]
			}
		]
	}
});
