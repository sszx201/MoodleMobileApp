Ext.define("MoodleMobApp.view.AaiAccount", {
	extend: 'Ext.form.Panel',
	xtype: 'aaiaccount',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.field.Text',
		'Ext.field.Password',
		'Ext.field.Select',
		'MoodleMobApp.store.HomeOrgs',
	],

	controllers: [
		'MoodleMobApp.controller.AaiAccount'
	],

	config: {
		id: 'aaiaccount_form',
		items: [
			{
				docked: 'top',
				xtype: 'titlebar',
				title: 'Your AAI/NetID profile',
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
						xtype: 'selectfield',
						name: 'homeorganisation',
						label: 'Home Organisation',
						usePicker: false,
						store: Ext.create('MoodleMobApp.store.HomeOrgs'),
						displayField: 'name',
						valueField: 'url'
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
