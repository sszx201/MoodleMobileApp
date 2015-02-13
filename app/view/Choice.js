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
				xtype: 'panel',
				itemId: 'statistics',
				html: '<div id="choice_stats"></div>',
				hidden: true
			},
			{
				xtype: 'fieldset',
				title: 'Options',
				hidden: true,
				defaults: {
					labelWrap: true
				}
			},
			{
				xtype: 'button',
				text: 'Submit',
				hidden: true,
				ui: 'confirm',
				action: 'submit'
			}
		]
	}
});
