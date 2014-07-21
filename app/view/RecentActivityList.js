Ext.define("MoodleMobApp.view.RecentActivityList", {
	extend: 'Ext.DataView',
	xtype: 'recentactivitylist',

	config: {
		title: 'Recent Activity',
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'recentactivity',
		grouped: true,
		listeners: {
			itemtap: 'jumpTo'
		}
	},

	jumpTo: function(view, index, target, record) {
		this.fireEvent('checkActivity', record);
	}
});
