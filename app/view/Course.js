Ext.define("MoodleMobApp.view.Course", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'course',

	config: {
		cls: 'x-course',
		// map records to the DataItem
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-course-name',
			},
			{
				itemId: 'modulestatus',
				xtype: 'component',
				cls: 'x-course-module-status',
			}
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#name').setHtml(record.get('name'));
		this.down('#modulestatus').setHtml(record.get('modulestatus'));
	}
	
});

