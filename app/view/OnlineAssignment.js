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
		'Ext.field.File'
	],

	controllers: [ ],

	config: {
		title: 'Online Assignment',
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
						this.child('fieldset').child('textareafield[name=submission]').disable();
						this.child('fieldset').child('button[action=submit]').hide();
						return;
					}

					if(today < availabledate) {
						this.child('panel[name=toosoon]').show();
						this.child('fieldset').hide();
						return;
					}
				} if(this.config.settings.resubmit == 0 && this.config.lastSubmission != null && this.config.lastSubmission.id > 0) {
					this.child('panel[name=noresubmit]').show();
					this.child('fieldset').child('button[action=submit]').hide();
					this.child('fieldset').child('textareafield[name=submission]').disable();
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
				this.child('panel[name=intro]').setHtml(intro_html);

				if(this.config.lastSubmission != null && this.config.lastSubmission.id > 0) {
					this.child('fieldset').child('textareafield[name=submission]').setValue(this.config.lastSubmission.usertext);
				}
			}
		},
		items: [	
			{
				xtype: 'panel',	
				name: 'intro',
				html: ''
			},
			{
				xtype: 'fieldset',
				title: 'Your Submission',
				items: [	
					{
						xtype: 'textareafield',	
						name: 'submission'
					},
					{
						xtype: 'hiddenfield',	
						name: 'id'
					},
					{
						xtype: 'hiddenfield',	
						name: 'instanceid'
					},
					{
						xtype: 'button',
						text: 'Submit',
						ui: 'confirm',
						action: 'submit'
					}
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
	}
});
