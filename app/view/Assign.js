Ext.define("MoodleMobApp.view.Assign", {
	extend: 'Ext.form.Panel',
	xtype: 'assign',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.Button',
		'Ext.field.Text',
		'Ext.field.TextArea',
		'Ext.field.Hidden',
		'Ext.field.File'
	],

	controllers: [ ],

	config: {
		title: 'Assignment',
		cls: 'assignment',
		autoDestroy: true,
		scrollable: 'vertical',
		listeners: {
			initialize: function() {
				Ext.av = this;
				// check the data
				var today = new Date();
				var duedate = new Date(this.config.settings.duedate * 1000);
				var availabledate = new Date(this.config.settings.allowsubmissionsfromdate * 1000);
				var cutoffdate = new Date(this.config.settings.cutoffdate * 1000);
				var submission_enabled = true;

				if(
					(today > duedate && this.config.settings.duedate > 0) ||
					(today > cutoffdate && this.config.settings.cutoffdate > 0)
				) {
					this.child('fieldset').hide();
					this.child('panel[name=toolate]').show();
					submission_enabled = false;
				} else if(today < availabledate  && this.config.settings.allowsubmissionsfromdate > 0) {
					this.child('fieldset').hide();
					this.child('panel[name=toosoon]').show();
					submission_enabled = false;
					this.child('panel[name=textsubmission]').setHtml('<div class="label">Previously submitted text:</div>' + this.config.lastSubmission.usertext);
					this.child('panel[name=textsubmission]').show();
				}

				if(submission_enabled) {
					if(this.config.settings.teamsubmission == 1) {
						this.child('fieldset').child('textareafield[name=onlinetext]').show();
					}

					if(this.config.settings.plugconf.onlinetext.assignsubmission.enabled == 1) {
						this.child('fieldset').child('textareafield[name=onlinetext]').show();
					}

					if(this.config.settings.plugconf.files.assignsubmission.enabled == 1) {
						this.child('fieldset').down('#buttons').child('button[action=addfile]').show();
					}

					if(this.config.settings.plugconf.onlinetext.assignsubmission.enabled == 0 && this.config.settings.plugconf.files.assignsubmission.enabled == 0) {
						this.child('fieldset').hide();
						this.child('fieldset').down('#buttons').hide();
					}
				}
			},

			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				var from_date = null;
				var to_date = null;
				// prepare the intro
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>';
					intro_html+= '<div class="intro">'+ data.intro + '</div>';

				// date block
				if(this.config.settings.allowsubmissionsfromdate > 0 || this.config.settings.duedate > 0 || this.config.settings.cutoffdate > 0) {
					intro_html+= '<div class="dates">';
					if(this.config.settings.allowsubmissionsfromdate > 0) {
						intro_html+= '<div class="date">Available from date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.allowsubmissionsfromdate) + '</div>';
					}

					if(this.config.settings.duedate > 0) {
						intro_html+= '<div class="date">Due date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.duedate) + '</div>';
					}

					if(this.config.settings.cutoffdate > 0) {
						intro_html+= '<div class="date">Deadline date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.cutoffdate) + '</div>';
					}
					intro_html+= '</div>';
				}

				// display the intro
				this.child('panel[name=intro]').setHtml(intro_html);

				// prepare the textsubmission and filesubmission reports
				if(this.config.lastSubmission != undefined && this.config.lastSubmission != null && this.config.lastSubmission.id > 0) {
					if(this.config.lastSubmission.userfiles.length > 0) { // file check
						// show the previous textsubmission
						var filesubmission_html = '<div class="label">Previously submitted files:</div>';
						filesubmission_html += '<ul>';
						for(var i=0; i < this.config.lastSubmission.userfiles.length; ++i) {
							filesubmission_html += '<li>' + this.config.lastSubmission.userfiles[i].filename + '</li>';
						}
						filesubmission_html += '</ul>';

						// display the intro
						this.child('panel[name=filesubmission]').setHtml(filesubmission_html);
						this.child('panel[name=filesubmission]').show();

						// change the button text
						this.child('fieldset').down('#buttons').down('button[action=submit]').setText('Resubmit');
					}
					// set usertext for editing
					if(
						this.config.lastSubmission.usertext != undefined &&
						this.config.lastSubmission.usertext != null &&
						this.config.lastSubmission.usertext.length > 0
					) {
						// show the previous textsubmission
						this.child('panel[name=textsubmission]').setHtml('<div class="label">Previously submitted text:</div>' + this.config.lastSubmission.usertext);
						this.child('panel[name=textsubmission]').show();

						if(!this.child('fieldset').child('textareafield[name=onlinetext]').isHidden()) {
							this.child('fieldset').child('textareafield[name=onlinetext]').setValue(this.config.lastSubmission.usertext);
							// change the button text
							this.child('fieldset').down('#buttons').down('button[action=submit]').setText('Resubmit');
						}
					}
				}
			}
		},

		items: [	
			{
				xtype: 'panel',
				name: 'intro',
				styleHtmlContent: true,
				html: ''
			},
			{
				xtype: 'panel',
				name: 'filesubmission',
				cls: 'file-submission',
				styleHtmlContent: true,
				html: '',
				hidden: true
			},
			{
				xtype: 'panel',
				name: 'textsubmission',
				cls: 'text-submission',
				styleHtmlContent: true,
				html: '',
				hidden: true
			},
			{
				xtype: 'fieldset',
				title: 'Your Submission',
				items: [
					{
						xtype: 'hiddenfield',	
						name: 'instanceid'
					},
					/*
					{
						xtype: 'checkboxfield',
						name: 'finalsubmission',
						value: 1,
						label: 'Final submission'
					},
					*/
					{
						xtype: 'textareafield',
						name: 'onlinetext',
						hidden: true,
						listeners: {
							focus: function(comp, e, eopts) {
								var self = this;
								setTimeout(function() {
									//var ost = comp.element.dom.offsetTop;
									//self.getParent().getParent().getScrollable().getScroller().scrollTo(0, ost);
									self.getParent().getParent().getScrollable().getScroller().scrollToEnd();
								}, 1500)
							}
						}
					},
					{
						xtype: 'checkboxfield',
						name: 'teamsubmission',
						value: 1,
						label: 'Teamsubmission',
						hidden: true
					},
					{
						xtype: 'container',
						itemId: 'filelist',
						cls: 'filelist'
					},
					{
						xtype: 'container',
						itemId: 'buttons',
						cls: 'buttons',
						layout: 'hbox', 
						items: [
							{
								xtype: 'button',
								text: 'Add File',
								action: 'addfile',	
								flex: 1,
								hidden: true
							},
							{
								xtype: 'button',
								text: 'Submit',
								ui: 'confirm',
								action: 'submit',	
								flex: 1
							}
						] 
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
			}
		]
	}
});
