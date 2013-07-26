Ext.define("MoodleMobApp.view.ForumDiscussion", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumdiscussion',

	config: {
		cls: 'x-forum-discussion',
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-forum-discussion-name',
			},
			{
				itemId: 'stat',
				xtype: 'component',
				cls: 'x-forum-discussion-stat',
			}
		],
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#name').setHtml(record.get('name'));

		var notification = '';
		if(record.get('isnew') == true) {
			notification = ' <span class="x-module-new">new</span>';
		}

		if(record.get('isupdated') == true) {
			notification = ' <span class="x-module-updated">updated</span>';
		}
		this.down('#stat').setHtml(notification);
	}
});

