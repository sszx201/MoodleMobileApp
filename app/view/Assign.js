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
		'Ext.field.File',
	],

	controllers: [ ],

	config: {
		title: 'Assignment',
		cls: 'assignment',
		listeners: {
			initialize: function() {
				Ext.av = this;
				// check the data
				var today = new Date();
				var duedate = new Date(this.config.settings.duedate * 1000);
				var availabledate = new Date(this.config.settings.allowsubmissionsfromdate * 1000);

				if(today > duedate) {
					this.child('fieldset').hide();
					this.child('panel[name=toolate]').show();
					return;
				}

				if(today < availabledate) {
					this.child('fieldset').hide();
					this.child('panel[name=toosoon]').show();
					return;
				}

				if(this.config.settings.teamsubmission == 1) {
					this.child('fieldset').child('textareafield[name=onlinetext]').show();
				}

				if(this.config.settings.plugconf.onlinetext.assignsubmission.enabled == 1) {
					this.child('fieldset').child('textareafield[name=onlinetext]').show();
				}

				if(this.config.settings.plugconf.files.assignsubmission.enabled == 1) {
					this.child('fieldset').child('container[cls=buttons]').child('button[action=addfile]').show();
				}

				if(this.config.settings.plugconf.onlinetext.assignsubmission.enabled == 0 && this.config.settings.plugconf.files.assignsubmission.enabled == 0) {
					this.child('fieldset').hide();
					this.child('fieldset').child('container[cls=buttons]').hide();
				}
			},

			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>';
					intro_html+= '<div class="intro">'+ data.intro + '</div>';
					intro_html+= '<div class="dates">';
					intro_html+= '<div class="date">Available from date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.allowsubmissionsfromdate) + '</div>';
					intro_html+= '<div class="date">Deadline date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.duedate) + '</div>';
					intro_html+= '</div>';

				this.child('panel[name=intro]').setHtml(intro_html);
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
						xtype: 'textareafield',
						label: 'Text to submit',
						name: 'onlinetext',
						labelAlign: 'top',
						hidden: true,
					},
					{
						xtype: 'checkboxfield',
						name: 'teamsubmission',
						value: 1,
						label: 'Teamsubmission',
						hidden: true,
					},
					{
						xtype: 'container',
						cls: 'filelist',
					},
					{
						xtype: 'container',
						cls: 'buttons',
						layout: 'hbox', 
						items: [
							{
								xtype: 'button',
								text: 'Add File',
								action: 'addfile',	
								flex: 1,
								hidden: true,
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
