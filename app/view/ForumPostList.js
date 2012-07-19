Ext.define("MoodleMobApp.view.ForumPostList", {
	extend: 'Ext.List',
	xtype: 'discussionpostlist',

	config: {
		id: 'discussion_post_list',
	   	title: 'List of Posts', 
		itemTpl: '<div class="post_depth_{indentation}">'+
					'<div class="post_user_avatar"><img src="{avatar}" /></div>'+
					'<div class="post_user_info">{firstname} {lastname}</div>'+
					'<div class="post_subject">{subject}</div>'+
					'<div class="post_message">{message}</div>'+
				'</div>',
		emptyText: 'No posts available in this discussion.',

		listeners: {
			itemsingletap: function (view, index, target, record) {
				var actionSheet = Ext.create('Ext.ActionSheet', {
					autoDestroy: true,
					hideOnMaskTap: true,
					items: [
						{
							text: 'Reply',
							ui: 'confirm',
						}
					]	
				});
				Ext.Viewport.add(actionSheet);
				console.log(view);
				console.log(index);
				console.log(target);
				console.log(record);
			}
		}
	},
});

