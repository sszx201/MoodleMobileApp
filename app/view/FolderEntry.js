Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',

		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-folder-entry-name'
			},
			{
				itemId: 'mime',
				xtype: 'component',
				cls: 'x-folder-entry-mime'
			}
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#name').setHtml(record.get('name'));
		this.down('#mime').setHtml(record.get('mime'));

		// remove previous css classes if any
		// this is the folder navigation icons glitch fix
		// without this sometimes the folder entries get
		// the file icon and viceversa
		this.removeCls('x-subfolder-icon');
		this.removeCls('x-file-icon');
		// add the correct css class
		if(record.get('mime') == 'inode/directory'){
			this.addCls('x-subfolder-icon');
		} else {
			this.addCls('x-file-icon');
		}
	}
});

