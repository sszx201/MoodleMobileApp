Ext.define("MoodleMobApp.view.ForumPost", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumpost',

	config: {
		cls: 'forum-post',

		items: [
			{
				xtype: 'container',
				items: [
					{
						itemId: 'avatar',
						xtype: 'image',
						height: 35,
						width: 35,
						cls: 'x-avatar'
					},
					{
						itemId: 'firstname',
						xtype: 'component',
						cls: 'x-post-firstname'
					},
					{
						itemId: 'lastname',
						xtype: 'component',
						cls: 'x-post-lastname'
					}
				],
				layout: {
					type: 'hbox',
					align: 'center'
				},
			},
			{
				itemId: 'subject',
				xtype: 'component',
				cls: 'x-post-subject'
			},
			{
				itemId: 'message',
				xtype: 'component',
				cls: 'x-post-message'
			},
			{
				itemId: 'replyButton',
				xtype: 'button',
				text: 'reply',
				action: 'postreply',
				docked: 'bottom',
				ui: 'confirm',
				hidden: true,
				cls: 'x-post-message'
			}
		]
	},

	updateRecord: function(record){
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.setCls('forum-post x-post-indentation-' + record.get('indentation'));	
		this.down('#avatar').setSrc(record.get('avatar'));
		this.down('#firstname').setHtml(record.get('firstname'));
		this.down('#lastname').setHtml(record.get('lastname'));
		this.down('#subject').setHtml(record.get('subject'));
		// process attachments
		if(record.get('attachments') != null && record.get('attachments').length > 0) {
			var attachment_list = '<ul class="x-post-attachment-list">';
			var attachments = record.get('attachments');
			for(var i=0; i < attachments.length; ++i) {
				attachment_list +=  '<li class="x-post-attachment-entry">'+
										'<a class="x-post-attachment-file" href="javascript:MoodleMobApp.app.openURL(\''+attachments[i].url+'\')">'+
											attachments[i].filename+
										'</a>'+
										'  '+
										'<span class="x-post-attachment-size">'+
											attachments[i].filesize+'&nbsp;KB'+
										'</span>'+
									'</li>';
			}
			attachment_list += '</ul>';

			this.down('#message').setHtml(record.get('message')+attachment_list);
		} else {
			this.down('#message').setHtml(record.get('message'));
		}
	}
});

