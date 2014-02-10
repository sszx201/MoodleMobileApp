Ext.define("MoodleMobApp.view.ForumPostList", {
	extend: 'Ext.DataView',
	xtype: 'forumpostlist',
	requires: [ ],
	config: {
		id: 'forum_post_list',
	   	title: 'List of Posts', 
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'forumpost',

		listeners: {
			itemsingletap: function (dataview, index, target, record, e) {
				if(typeof dataview.selectedItem == 'undefined') {
					dataview.selectedItem = target;
					dataview.selectedItem.addCls('forum-post-selected');
				} else if (typeof dataview.selectedItem == 'object') {
					// unselect the previous item
					dataview.selectedItem.down('#replyButton').hide();
					dataview.selectedItem.removeCls('forum-post-selected');
					// set the new selected item
					dataview.selectedItem = target;
					dataview.selectedItem.addCls('forum-post-selected');
				}
				target.down('#replyButton').show();
			}
		}
	}
});

