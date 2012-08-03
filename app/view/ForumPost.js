Ext.define("MoodleMobApp.view.ForumPost", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumpost',

	config: {
		cls: 'forum-post',

		// map records to the DataItem
		dataMap: {
			getImage: {
				setSrc: 'avatar'
			},

			getFirstname: {
				setHtml: 'firstname'
			},

			getLastname: {
				setHtml: 'lastname'
			},

			getSubject: {
				setHtml: 'subject'
			},

			getMessage: {
				setHtml: 'message'
			},
		},

		image: {
			cls: 'x-avatar',
			height: 35,
			width: 35,
		},

		firstname: {
			cls: 'x-post-firstname',
		},
		
		lastname: {
			cls: 'x-post-lastname',
		},

		replyButton: {
			cls: 'x-post-reply-button',
			text: 'reply',
			action: 'postreply',
			docked: 'bottom',
			ui: 'confirm',
			hidden: true,
			listeners: {
				tap: function () {
				}
			},
		},

		message: {
			cls: 'x-post-message',
			docked: 'bottom',
		},

		subject: {
			cls: 'x-post-subject',
			docked: 'bottom',
		},

		layout: {
            type: 'hbox',
            align: 'center'
        },

		listeners: {
			updatedata: function(){
				this.addCls('x-post-indentation-'+this.getRecord().get('indentation'));	
				// process attachments
				if(this.getRecord().getData().attachments.length > 0) {
					var message = this.getMessage().getHtml();
					var attachment_list = '<ul class="x-post-attachment-list">';
					var attachments = this.getRecord().getData().attachments;
					for(var i=0; i < attachments.length; ++i) {
						attachment_list +=  '<li class="x-post-attachment-entry">'+
												'<a class="x-post-attachment-file" href="'+attachments[i].url+'">'+
													attachments[i].filename+
												'</a>'+
												'  '+
												'<span class="x-post-attachment-size">'+
													attachments[i].filesize+'&nbsp;KB'+
												'</span>'+
											'</li>';
					}
					attachment_list += '</ul>';

					this.getMessage().setHtml(message+attachment_list);
				}
			},

		}
	},

	applyImage: function(config) {
		return Ext.factory(config, Ext.Img, this.getImage());
	},

	updateImage: function(newImage, oldImage) {
		if(newImage){
			this.add(newImage);
		}

		if(oldImage){
			this.remove(oldImage);
		}
	},

	applyFirstname: function(config) {
        return Ext.factory(config, Ext.Component, this.getFirstname());
    },

    updateFirstname: function(newFirstname, oldFirstname) {
        if (newFirstname) {
            this.add(newFirstname);
        }

        if (oldFirstname) {
            this.remove(oldFirstname);
        }
    },

	applyLastname: function(config) {
        return Ext.factory(config, Ext.Component, this.getLastname());
    },

    updateLastname: function(newLastname, oldLastname) {
        if (newLastname) {
            this.add(newLastname);
        }

        if (oldLastname) {
            this.remove(oldLastname);
        }
    },

	applySubject: function(config) {
        return Ext.factory(config, Ext.Component, this.getSubject());
    },

    updateSubject: function(newSubject, oldSubject) {
        if (newSubject) {
            this.add(newSubject);
        }

        if (oldSubject) {
            this.remove(oldSubject);
        }
    },

	applyMessage: function(config) {
        return Ext.factory(config, Ext.Component, this.getMessage());
    },

    updateMessage: function(newMessage, oldMessage) {
        if (newMessage) {
            this.add(newMessage);
        }

        if (oldMessage) {
            this.remove(oldMessage);
        }
    },

	applyReplyButton: function(config) {
        return Ext.factory(config, Ext.Button, this.getReplyButton());
    },

    updateReplyButton: function(newReplyButton, oldReplyButton) {
        if (newReplyButton) {
            this.add(newReplyButton);
        }

        if (oldReplyButton) {
            this.remove(oldReplyButton);
        }
    },

});

