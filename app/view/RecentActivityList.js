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
			painted: function(){
				this.dropActivityLabels();
				// wait some time for the modules to load
				Ext.defer(this.addActivityLabels, 250, this);
			},

			itemtap: 'jumpTo'
		}
	},

	dropActivityLabels: function(){
		// remove old sections labels
		Ext.select('.x-recent-activity-label').each(function(activity_label){
			activity_label.destroy();
		});
	},

	addActivityLabels: function(){
		// console.log('adding activity labels');
		// course updates
		var element = Ext.select('.x-recent-activity-course-update').first();
		var label = '';
		// console.log(element);
		if(element != null) {
			label = '<div class="x-recent-activity-label">Course updates:</div>';
			// add the section title
			Ext.DomHelper.insertBefore(element, label);
		}
		// forum posts
		element = Ext.select('.x-recent-activity-forum-post').first();
		// console.log(element);
		if(element != null) {
			label = '<div class="x-recent-activity-label">New forum posts:</div>';
			// add the section title
			Ext.DomHelper.insertBefore(element, label);
		}
	},

	jumpTo: function(view, index, target, record) {
		this.fireEvent('checkActivity', record);
	}
});
