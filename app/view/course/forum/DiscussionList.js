Ext.define("MoodleMobApp.view.course.forum.DiscussionList", {
	extend: 'Ext.List',
	xtype: 'forumdiscussionlist',

	config: {
		id: 'forum_discussions_list',
	   	title: 'List of discussions', 
		itemTpl: '{name}',
		onItemDisclosure: true,
	},
});
