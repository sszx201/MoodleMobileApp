Ext.define("MoodleMobApp.view.OnlineAssignment", {
	extend: 'Ext.form.Panel',
	xtype: 'onlineassignment',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.Button',
		'Ext.field.TextArea',
		'Ext.field.Hidden',
		'Ext.field.File',
	],

	controllers: [ ],

	config: {
		title: 'Online Assignment',
		autoDestroy: true,
		listeners: {
			initialize: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>'+ 
									'<div class="assignment-intro">'+ data.intro + '</div>';
				// inject html
				this.getItems().first().setHtml(intro_html);
			}	
		},
		items: [	
			{
				xtype: 'panel',	
				name: 'intro',
				html: '',
			},
			{
				xtype: 'fieldset',
				title: 'Your Submission',
				items: [	
					{
						xtype: 'textareafield',	
						name: 'submission',
					},
					{
						xtype: 'hiddenfield',	
						name: 'id',
					},
					{
						xtype: 'hiddenfield',	
						name: 'instanceid',
					},
					{
						xtype: 'button',
						text: 'Submit',
						ui: 'confirm',
						action: 'submit',	
					},
				]
			},
		]
	}
});
