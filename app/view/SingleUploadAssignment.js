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
		title: 'Single Upload Assignment',
		autoDestroy: true,
		listeners: {
			show: function(){
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
				title: 'Submit the file',
				items: [	
					{
						xtype: 'textfield',
						disabled: false,
						name: 'filepath',
						component: { 
							xtype: 'file',
							disabled: false,
						}
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
	},

	displayPreviousSubmission: function(record) {
		var intro = this.getItems().first().getHtml();
		var previous_submission = '<div class="assignment-previous-submission">Previously submitted file: ' + record.get('userfiles')[0].filename + '</div>';
		this.getItems().first().setHtml(intro+previous_submission);
	}
});
