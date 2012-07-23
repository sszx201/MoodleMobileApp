Ext.define("MoodleMobApp.view.ForumPostList", {
	extend: 'Ext.DataView',
	xtype: 'forumpostlist',
	requires: [
		'Ext.data.Store'	
	],
	config: {
		id: 'forum_post_list',
	   	title: 'List of Posts', 
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'forumpost',
		/*
		itemTpl: '<div class="post_depth_{indentation}">'+
					'<div class="post_user_avatar"><img src="{avatar}" /></div>'+
					'<div class="post_user_info">{firstname} {lastname}</div>'+
					'<div class="post_subject">{subject}</div>'+
					'<div class="post_message">{message}</div>'+
				'</div>',
		*/
		listeners: {
			itemsingletap: function (dataview, index, target, record, e) {
				if(typeof dataview.selectedItem == 'undefined') {
					dataview.selectedItem = target;
					dataview.selectedItem.addCls('forum-post-selected');
				} else if (typeof dataview.selectedItem == 'object') {
					// unselect the previous item
					dataview.selectedItem.getReplyButton().setHidden(true);
					dataview.selectedItem.removeCls('forum-post-selected');
					// set the new selected item
					dataview.selectedItem = target;
					dataview.selectedItem.addCls('forum-post-selected');
				}
				target.getReplyButton().setHidden(false);
			},
		}

	},
});

