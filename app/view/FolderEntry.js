Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',
		cached: false, // states if the file or directory has been cached

		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-folder-entry-name'
			},
			{
				itemId: 'status',
				xtype: 'component',
				cls: 'x-folder-entry-status'
			},
			{
				itemId: 'queuefordownload',
				xtype: 'checkboxfield',
				cls: 'download-file-selection',
				labelWidth: '0%',
				docked: 'left',
				//hidden: true
			},
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#name').setHtml(record.get('name'));

		// remove previous css classes if any
		// this is the folder navigation icons glitch fix
		// without this sometimes the folder entries get
		// the file icon and viceversa
		this.removeCls('x-subfolder-icon');
		this.removeCls('x-file-icon');
		// add the correct css class
		if(record.get('mime') == 'inode/directory'){
			this.down('#name').addCls('x-subfolder-icon');
		} else {
			this.down('#name').addCls('x-file-icon');
		}

		if(record.get('mime') != 'inode/directory'){
			var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + record.get('fileid');
			var filePath = '';
			if(record.get('mime') == 'application/zip') {
				filePath = dirPath + '/_archive_extracted_';
			} else {
				filePath = dirPath + '/' + record.get('name').split(' ').join('_');
			}
			var self = this;
			MoodleMobApp.FileSystem.getFile(
				filePath,
				function() {
					self.setCached(true);
				},
				function() {
					self.setCached(false);
				}
			);
		}
	},

	setCached: function(isCached) {
		this.config.cached = isCached;
		var onlineFlag = ' <img src="resources/images/online.png"/>';
		var cachedFlag = ' <img src="resources/images/download.png"/>';
		if(isCached) {
			this.down('#status').setHtml(cachedFlag);
		} else {
			this.down('#status').setHtml(onlineFlag);
		}
	},

	getCached: function() {
		return this.config.cached;
	}
});

