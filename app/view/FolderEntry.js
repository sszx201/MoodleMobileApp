Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',

		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-folder-entry-name',
			},
			{
				itemId: 'mime',
				xtype: 'component',
				cls: 'x-folder-entry-mime',
			}
		],
	},

	updateRecord: function(record) {
		this.down('#name').setHtml(record.get('name'));
		this.down('#mime').setHtml(record.get('mime'));

		if(record.get('mime') == 'inode/directory'){
			this.addCls('x-subfolder-icon');
		} else {
			this.addCls('x-file-icon');
		}
	}
});

