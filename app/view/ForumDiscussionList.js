Ext.define("MoodleMobApp.view.ForumDiscussionList", {
	extend: 'Ext.List',
	xtype: 'forumdiscussionlist',

	config: {
		id: 'forum_discussion_list',
	   	title: 'List of discussions', 
		itemTpl: '{name}',
		emptyText: 'No discussions available in this forum.',
		onItemDisclosure: true,
	},
});
