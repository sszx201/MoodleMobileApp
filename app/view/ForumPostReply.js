Ext.define("MoodleMobApp.view.ForumPostReply", {
	extend: 'Ext.form.Panel',
	xtype: 'forumpostreply',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'Ext.form.FieldSet',
		'Ext.Button',
		'Ext.field.Text',
		'Ext.field.TextArea',
		'Ext.field.Hidden'
	],

	controllers: [ ],

	config: {
		title: 'Form Post Reply',
		cls: 'x-post-reply',
		listeners: {
			initialize: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var parent_post_html = '<div class="x-form-fieldset-title x-docked-top">Reply To</div>'+ 
										'<div class="parent-post">'+ 
											'<div class="userinfo">'+
												'<img src="'+data.avatar+'" /> '+
												'<span class="username">'+data.firstname + ' ' + data.lastname+'</span>'+
											'</div>'+
											'<div class="content">'+
												'<div class="subject">'+
													'<span class="label">Subject:</span> '+'<span class="text">'+data.subject+'</div>'+
												'</div>'+
												'<div class="message">'+
													'<div class="label">Message:</div>'+
													'<div class="text">'+data.message+'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
				// inject html
				this.child('panel[name=parentpost]').setHtml(parent_post_html);
			}	
		},
		items: [	
			{
				xtype: 'panel',
				name: 'parentpost',	
				html: ''
			},
			{
				xtype: 'fieldset',
				title: 'Your reply',
				items: [	
					{
						xtype: 'textfield',
						name: 'subject',
						label: 'Subject'
					},
					{
						xtype: 'textareafield',
						name: 'reply',
						label: 'Message'
					},
					{
						xtype: 'hiddenfield',
						name: 'id'
					},
					{
						xtype: 'hiddenfield',
						name: 'discussion'
					},
					{
						xtype: 'button',
						text: 'Save',
						ui: 'confirm',
						action: 'savereply'	
					}
				]
			}
		]
	}
});
