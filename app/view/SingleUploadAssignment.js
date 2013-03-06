Ext.define("MoodleMobApp.view.SingleUploadAssignment", {
	extend: 'Ext.form.Panel',
	xtype: 'singleuploadassignment',
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
		id: 'single_upload_assignment_form',
		title: 'Single Upload Assignment',
		listeners: {
			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>'+ 
									'<div class="assignment-intro">'+ data.intro + '</div>';
				var previous_submission = '';
				if(data.submission != null) {
					previous_submission += '<div class="assignment-previous-submission">Previously submitted file: ' + data.submission + '</div>';
				}
				// inject html
				this.getItems().first().setHtml(intro_html+previous_submission);
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
				title: 'Submit the file',
				items: [	
					{
						xtype: 'textfield',
						disabled: false,
						name: 'filepath',
						//value: 'boa.jpg',
						value: 'iCorsi/boa.jpg',
						/*
						component: { 
							xtype: 'file',
							disabled: false,
						}
						*/
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
