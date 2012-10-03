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
		'Ext.field.Hidden',
	],

	controllers: [ ],

	config: {
		id: 'forum_post_reply_form',
		title: 'Form Post Reply',
		listeners: {
			initialize: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var parent_post_html = '<div class="x-form-fieldset-title x-docked-top">Reply To</div>'+ 
										'<div class="parent-post">'+ 
											'<div class="parent-post-user-info">'+
												'<div class="parent-post-user-avatar">'+
													'<img src="'+data.avatar+'" />'+
												'</div>'+
												'<div class="parent-post-user-firstname">'+data.firstname+'</div>'+
												'<div class="parent-post-user-lastname">'+data.lastname+'</div>'+
											'</div>'+
											'<div class="parent-post-content">'+
												'<div class="parent-post-subject">'+
													'<div class="parent-post-subject-label">Subject:</div>'+
													'<div class="parent-post-subject-content">'+data.subject+'</div>'+
												'</div>'+
												'<div class="parent-post-message">'+
													'<div class="parent-post-message-label">Message:</div>'+
													'<div class="parent-post-message-content">'+data.message+'</div>'+
												'</div>'+
											'</div>'+
										'</div>';
				// inject html
				this.getItems().first().setHtml(parent_post_html);
			}	
		},
		items: [	
			{
				xtype: 'panel',
				id: 'parent_post',	
				html: '',
			},
			{
				xtype: 'fieldset',
				title: 'Your reply',
				items: [	
					{
						xtype: 'textfield',
						name: 'subject',
						label: 'Subject',
					},
					{
						xtype: 'textareafield',
						name: 'reply',
						label: 'Message',
					},
					{
						xtype: 'hiddenfield',
						name: 'id',
					},
					{
						xtype: 'hiddenfield',
						name: 'discussion',
					},
					{
						xtype: 'hiddenfield',
						name: 'indentation',
					},
					{
						xtype: 'button',
						text: 'Save',
						ui: 'confirm',
						action: 'savereply',	
					},
				]
			},
		]
	}
});
