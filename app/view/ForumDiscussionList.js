Ext.define("MoodleMobApp.view.ForumDiscussionList", {
	extend: 'Ext.DataView',
	xtype: 'forumdiscussionlist',

	config: {
		id: 'forum_discussion_list',
	   	title: 'List of discussions', 
		emptyText: 'No discussions available in this forum.',
		useComponents: true,
		defaultType: 'forumdiscussion',
	},
});
