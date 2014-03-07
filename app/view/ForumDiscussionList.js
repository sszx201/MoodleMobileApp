Ext.define("MoodleMobApp.view.ForumDiscussionList", {
	extend: 'Ext.DataView',
	xtype: 'forumdiscussionlist',

	config: {
		id: 'forum_discussion_list',
	   	title: 'List of discussions', 
		emptyText: 'No discussions available in this forum.',
		useComponents: true,
		defaultType: 'forumdiscussion',
		intro: null,
		items: [
			{
				xtype: 'button',
				text: 'New Discussion',
				docked: 'top',
				ui: 'confirm',
				action: 'adddiscussion',
				hidden: true
			},
			{
				xtype: 'container',
				cls: 'forum-intro',
				scrollDock: 'top',
				styleHtmlContent: true,
				html: ''
			}
		]
	},

	getIntro: function() {
		return this.down('container[cls=forum-intro]').getHtml();
	},

	setIntro: function(intro) {
		this.down('container[cls=forum-intro]').setHtml(intro);
	}
});
