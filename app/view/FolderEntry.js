Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',
		//cached: false, // states if the file or directory has been cached

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
				disabled: true,
				disabledCls: '',
				hidden: true,
				listeners: {
					check: function() {
						this.getParent().getRecord().selected = true;
					},
					uncheck: function() {
						this.getParent().getRecord().selected = false;
					}
				}
			}
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
		this.down('#name').removeCls('x-subfolder-icon');
		this.down('#name').removeCls('x-file-icon');
		// add the correct css class
		if(record.get('mime') == 'inode/directory'){
			this.down('#name').addCls('x-subfolder-icon');
		} else {
			this.down('#name').addCls('x-file-icon');
		}

		if(record.get('mime') != 'inode/directory') {
			var self = this;
			var file = {
					rootid: record.get('rootid'),
					name: record.get('name'),
					fileid: record.get('fileid'),
					mime: record.get('mime'),
					size: record.get('size')
				};

			MoodleMobApp.Session.getDownloader().findCachedFile(
				file,
				function() {
					self.setCached(true);
				},
				function() {
					self.setCached(false);
					// this is the navigation check; restore previous selections.
					// That is why the "selected" value is on the record value.
					// It makes it indipendend of the FolderEntry object.
					if(self.getRecord().selected == true) {
						self.down('#queuefordownload').check();
					}else{
						self.down('#queuefordownload').uncheck();
					}
					self.toggleDownloadSelection();
				}
			);
		} else {
			this.down('#status').setHtml('');
			this.down('#queuefordownload').uncheck();
			this.down('#queuefordownload').hide();
		}
	},

	setCached: function(isCached) {
		//this.config.cached = isCached;
		this.getRecord().cached = isCached;
		var onlineFlag = ' <img src="resources/images/online.png"/>';
		var cachedFlag = ' <img src="resources/images/download.png"/>';
		if(isCached) {
			this.down('#status').setHtml(cachedFlag);
			// this file has already been downloaded
			this.down('#queuefordownload').hide();
		} else {
			this.down('#status').setHtml(onlineFlag);
		}
	},

	getCached: function() {
		//return this.config.cached;
		return this.getRecord().cached;
	},

	toggleDownloadSelection: function() {
		// show the download block
		if(MoodleMobApp.Session.getMultiDownloadMode() && !this.getCached()) {
			this.down('#queuefordownload').show();
		} else {
			this.down('#queuefordownload').hide();
		}
	}
});

