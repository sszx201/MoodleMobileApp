Ext.define("MoodleMobApp.view.course.forum.PostList", {
	extend: 'Ext.List',
	xtype: 'discussionpostlist',

	config: {
		id: 'discussion_post_list',
	   	title: 'List of Posts', 
		itemTpl: '<div class="post_depth_{indentation}"><div class="post_subject">{subject}</div><div class="post_message">{message}</div></div>',
	},
});
