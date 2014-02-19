Ext.define("MoodleMobApp.view.RecentActivity", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'recentactivity',

	config: {
		cls: 'x-recent-activity',
		autoDestroy: true,
		items: [
			{
				itemId: 'itemName',
				xtype: 'component',
				cls: 'x-recent-activity-item-name'
			},
			{
				itemId: 'status',
				xtype: 'component',
				cls: 'x-course-module-status'
			}
		]
	},

	updateRecord: function(record){
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record != null) {
			var classes = 'x-module-icon-' + record.get('modname') + ' x-recent-activity';
			if(record.get('operation') == 'post') {
				classes += ' x-recent-activity-forum-post';
			} else {
				classes += ' x-recent-activity-course-update';
			}
			this.setCls(classes);

			this.down('#itemName').setHtml(record.get('name'));

			var _status = '';
			switch(record.get('operation')) {
				case 'add':
					_status = 'new ' + record.get('modname');
				break;
				case 'update':
					_status = 'updated ' + record.get('modname');
				break;
				case 'post':
					_status = 'updated discussion';
					console.log(record.getData());
				break;
			}
			this.down('#status').setHtml(_status);
		} 
	}
});

