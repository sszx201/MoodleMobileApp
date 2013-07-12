Ext.define("MoodleMobApp.view.Assign", {
	extend: 'Ext.form.Panel',
	xtype: 'assign',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.Button',
		'Ext.field.Text',
		'Ext.field.Hidden',
		'Ext.field.File',
	],

	controllers: [ ],

	config: {
		id: 'assign_form',
		title: 'Assignment',
		listeners: {
			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>'+ 
									'<div class="assignment-intro">'+ data.intro + '</div>';
				var previous_submission = '';
				if(data.submission != null) {
					previous_submission += '<div class="assignment-previous-submission">Previously submitted files: ' + data.submission + '</div>';
				}
				// inject html
				this.getItems().first().setHtml(intro_html+previous_submission);
			},
		},
		items: [	
			{
				xtype: 'panel',	
				name: 'intro',
				html: '',
			},
			{
				xtype: 'fieldset',
				title: 'Submit the file',
				items: [
					{
						xtype: 'hiddenfield',	
						name: 'id',
					},
					{
						xtype: 'hiddenfield',	
						name: 'instanceid',
					},
					{
						xtype: 'textfield',
						disabled: false,
						id: 'filepath',
						name: 'filepath',
						component: { 
							xtype: 'file',
							disabled: false,
						}
					},
					{
						xtype: 'panel',
						layout: 'hbox', 
						items: [
							{
								xtype: 'button',
								text: 'Add File',
								action: 'addfile',	
								flex: 1,
							},

							{
								xtype: 'button',
								text: 'Submit',
								ui: 'confirm',
								action: 'submit',	
								flex: 1,
							},
						] 
					}
					
				]
			},
		]
	}
});
