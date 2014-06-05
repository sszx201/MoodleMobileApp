Ext.define("MoodleMobApp.view.Choice", {
	extend: 'Ext.form.Panel',
	xtype: 'choice',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.form.Radio'
	],
	
	config: {
		cls: 'choice',
		title: 'Choice',
		items: [
			{
				xtype: 'panel',	
				name: 'intro',
				html: ''
			},
			{
				xtype: 'panel',	
				name: 'status',
				html: ''
			},
			{
				xtype: 'fieldset',
				title: 'Options',
				defaults: {
					labelWrap: true
				}
			},
			{
				xtype: 'button',
				text: 'Submit',
				ui: 'confirm',
				action: 'submit'
			}
		]
	}
});
