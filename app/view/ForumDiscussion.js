Ext.define("MoodleMobApp.view.ForumDiscussion", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumdiscussion',

	config: {
		cls: 'x-forum-discussion',
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-forum-discussion-name'
			},
			{
				itemId: 'status',
				xtype: 'component',
				cls: 'x-forum-discussion-status'
			}
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record != null) {
			this.down('#name').setHtml(record.get('name'));
		} 
	}
});

