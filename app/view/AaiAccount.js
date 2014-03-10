Ext.define("MoodleMobApp.view.AaiAccount", {
	extend: 'Ext.form.Panel',
	xtype: 'aaiaccount',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.field.Text',
		'Ext.field.Password',
		'Ext.field.Select'
	],

	controllers: [
		'MoodleMobApp.controller.AaiAccount'
	],

	config: {
		id: 'aaiaccount_form',
		items: [
			{
				xtype: 'fieldset',
				title: 'Your AAI/NetID profile',
				instructions: 'Set your AAI/NetID account here.',
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
						itemId: 'homeorganisation',
						name: 'homeorganisation',
						label: 'Home Organisation',
						usePicker: false,
						displayField: 'name',
						valueField: 'url'
					},
					{
						xtype: 'button',
						text: 'Save',
						ui: 'confirm',
						action: 'save'
					}
				]
			}
		]
	}
});
