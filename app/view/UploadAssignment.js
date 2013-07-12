Ext.define("MoodleMobApp.view.UploadAssignment", {
	extend: 'Ext.form.Panel',
	xtype: 'uploadassignment',
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
		title: ' Upload Assignment',
		autoDestroy: true,
		listeners: {
			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>'+ 
									'<div class="assignment-intro">'+ data.intro + '</div>';
				var previous_submission = '';

				if(data.submission != null) {
					previous_submission += '<div class="assignment-previous-submission">Previously submitted files: ';
					previous_submission += '<ul>';
					for(var i=0; i < data.submission.length; ++i) {
						previous_submission += '<li>' + data.submission[i] + '</li>';
					}
					previous_submission += '</ul>';
					previous_submission += '</div>';
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
				title: 'Choose files',
				items: [	
					{
						xtype: 'container',
						//cls: 'filelist',
					},
					{
						xtype: 'container',
						layout: 'hbox', 
						defaults: {
							padding: 10,
						},
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
					},
					{
						xtype: 'hiddenfield',	
						name: 'id',
					},
					{
						xtype: 'hiddenfield',	
						name: 'instanceid',
					},
				]
			},
		]
	}
});
