Ext.define("MoodleMobApp.view.DirectoryEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'directoryentry',

	config: {
		cls: 'x-directory-entry',

		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-directory-entry-name'
			}
		]
	},

	updateRecord: function(record) {
		console.log(record);
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#name').setHtml(record.get('name'));

		// remove previous css classes if any
		// this is the directory navigation icons glitch fix
		// without this sometimes the directory entries get
		// the file icon and viceversa
		this.removeCls('x-subdirectory-icon');
		this.removeCls('x-file-icon');
		// add the correct css class
		if(record.get('isDirectory')){
			this.addCls('x-subdirectory-icon');
		} else {
			this.addCls('x-file-icon');
		}
	}
});

