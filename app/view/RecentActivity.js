Ext.define("MoodleMobApp.view.RecentActivity", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'recentactivity',

	config: {
		cls: 'x-recent-activity',
		autoDestroy: true,
		items: [
			{
				itemId: 'action',
				xtype: 'component',
				cls: 'x-recent-activity-action'
			},
			{
				itemId: 'itemName',
				xtype: 'component',
				cls: 'x-recent-activity-item-name'
			}
		]
	},

	updateRecord: function(record){
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record != null) {
			var classes = 'x-recent-activity';
			if(record.get('operation') == 'post') {
				classes += ' x-recent-activity-forum-post';
			} else {
				classes += ' x-recent-activity-course-update';
			}
			this.setCls(classes);

			var action = '';
			switch(record.get('operation')) {
				case 'add':
					action = 'Added: ' + record.get('modname');
				break;
				case 'update':
					action = 'Updated: ' + record.get('modname');
				break;
				case 'post':
					action = 'post: ';
				break;
			}
			console.log(action);
			this.down('#action').setHtml(action);

			this.down('#itemName').setHtml(record.get('name'));
		} 
	}
});

