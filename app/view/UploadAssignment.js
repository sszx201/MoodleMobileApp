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
		'Ext.field.File'
	],

	controllers: [ ],

	config: {
		title: 'Upload Assignment',
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
				} if(this.config.settings.resubmit == 0 && this.config.lastSubmission.id > 0) {
					this.child('panel[name=noresubmit]').show();
					this.child('fieldset').hide();
				} if(this.config.lastSubmission != null && this.config.lastSubmission.isfinal) {
					this.child('panel[name=lastsubmissionwasfinal]').show();
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
					intro_html += '<div class="last-submission">Previously submitted files: ';
					intro_html += '<ul>';
					for(var i=0; i < this.config.lastSubmission.userfiles.length; ++i) {
						intro_html += '<li>' + this.config.lastSubmission.userfiles[i].filename + '</li>';
					}
					intro_html += '</ul>';
					intro_html += '</div>';
				}

				this.child('panel[name=intro]').setHtml(intro_html);
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
				title: 'Choose files',
				items: [
					{
						xtype: 'checkboxfield',
						name: 'isfinal',
						value: 1,
						label: 'Final Submission'
					},
					{
						xtype: 'container',
						name: 'filelist'
					},
					{
						xtype: 'container',
						layout: 'hbox', 
						defaults: {
							padding: 10
						},
						items: [
							{
								xtype: 'button',
								text: 'Add File',
								action: 'addfile',
								flex: 1
							},
							{
								xtype: 'button',
								text: 'Submit',
								ui: 'confirm',
								action: 'submit',	
								flex: 1
							}
						] 
					},
					{
						xtype: 'hiddenfield',	
						name: 'instanceid'
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
			},
			{
				xtype: 'panel',
				name: 'lastsubmissionwasfinal',
				cls: 'lastsubmissionwasfinal',
				docked: 'top',
				hidden: true,
				html: 'The last submission was the final one.'
			}
		]
	}
});
