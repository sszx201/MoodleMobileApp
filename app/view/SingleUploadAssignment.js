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
		cls: 'assignment',
		autoDestroy: true,
		listeners: {
			initialize: function() {
				// check the data
				if(this.config.settings.preventlate == 1) { // check the dates
					var today = new Date();
					var duedate = new Date(this.config.settings.timedue * 1000);
					var availabledate = new Date(this.config.settings.timeavailable * 1000);
					if(today > duedate) {
						this.child('panel[name=toolate]').show();
						this.child('fieldset').hide();
						return;
					}

					if(today < availabledate) {
						this.child('panel[name=toosoon]').show();
						this.child('fieldset').hide();
						return;
					}
				} if(this.config.settings.resubmit == 0 && this.config.lastSubmission != null && this.config.lastSubmission.id > 0) {
					this.child('panel[name=noresubmit]').show();
					this.child('fieldset').hide();
				}
			},

			show: function() {
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>';
					intro_html+= '<div class="intro">'+ data.intro + '</div>';
					intro_html+= '<div class="dates">';
					intro_html+= '<div class="date">Available from date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.timeavailable) + '</div>';
					intro_html+= '<div class="date">Deadline date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.timedue) + '</div>';
					intro_html+= '</div>';

				// display the intro

				if(this.config.lastSubmission != null && this.config.lastSubmission.id > 0) {
					intro_html += '<div class="last-submission">Previously submitted file: ' + this.config.lastSubmission.userfiles[0].filename + '</div>';
				}

				this.child('panel[name=intro]').setHtml(intro_html);
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
			{
				xtype: 'panel',
				name: 'toosoon',
				cls: 'toosoon',
				docked: 'top',
				hidden: true,
				html: 'This assignment has not been opened yet.'
			},
			{
				xtype: 'panel',
				name: 'toolate',
				cls: 'toolate',
				docked: 'top',
				hidden: true,
				html: 'This assignment has been closed.'
			},
			{
				xtype: 'panel',
				name: 'noresubmit',
				cls: 'noresubmit',
				docked: 'top',
				hidden: true,
				html: 'No resubmit allowed.'
			}
		]
	},

});
