Ext.define("MoodleMobApp.view.Module", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'module',

	config: {
		cls: 'x-module',
		autoDestroy: true,
		cached: false, // states if the file has been cached
		cachable: false, // stats if there is a file to be cached
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-module-name'
			},
			{
				itemId: 'modname',
				xtype: 'component',
				cls: 'x-module-status'
			},
			{
				itemId: 'intro',
				xtype: 'component',
				cls: 'x-module-intro',
				docked: 'bottom',
				styleHtml: true,
				hidden: true
			},
			{
				itemId: 'queuefordownload',
				xtype: 'checkboxfield',
				cls: 'download-file-selection',
				labelWidth: '0%',
				docked: 'left',
				hidden: true
			},
			{
				itemId: 'introButton',
				xtype: 'button',
				baseCls: 'x-module-info',
				docked: 'right',
				listeners: {
					tap: function(btn, e, opts) {
						e.stopPropagation();
						if(btn.getParent().down('#intro').isHidden()) {
							btn.getParent().down('#intro').show();
						} else {
							btn.getParent().down('#intro').hide();
						}
					}
				}
			}
		]
	},

	updateRecord: function(record){
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record != null) {
			this.down('#queuefordownload').hide();
			this.down('#name').setHtml(record.get('name'));

			var classes = 'x-module';
			var modname = '';
			if(record.get('visible') == 0) {
				this.down('#name').addCls('x-module-icon-'+record.get('modname')+'-gray');
				//classes+= ' x-module-icon-'+record.get('modname')+'-gray';
				modname = record.get('modname') + ' <img src="resources/images/invisible.png"/>';
			} else {
				this.down('#name').addCls('x-module-icon-'+record.get('modname'));
				//classes+= ' x-module-icon-'+record.get('modname');
				modname = record.get('modname');
			}
			var module = record.get('modname');
			if(
				module == 'url' ||
				module == 'data' ||
				module == 'feedback' ||
				module == 'workshop' ||
				module == 'quiz' ||
				module == 'wiki'
			) {
				modname += ' <img src="resources/images/online.png"/>';
				this.setCachable(false);
			}

			var file = null;
			switch(module) {
				case 'resource':
					var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);	

					if(resource.get('filemime').indexOf('html') == -1) {
						file = {
							name: resource.get('filename'),
							fileid: resource.get('fileid'),
							mime: resource.get('filemime'),
							size: resource.get('filesize')
						};
					} else {
						modname += ' <img src="resources/images/online.png"/>';
					}
				break;

				case 'scorm':
					file = {
						'moduleid': record.get('id'),
						'scormid': record.get('instanceid'),
						'name': record.get('id') + '.zip',
						'mime': 'application/zip'
					};
				break;

				case 'folder':
					file = {
						'rootid': record.get('instanceid'),
						'fileid': null,
						'name': record.get('name'),
						'mime': 'inode/directory'
					};
				break;

			}

			this.down('#modname').setHtml(modname);
			classes+= ' x-module-section-'+record.get('section');
			this.setCls(classes);

			if( file != null ) { // check the cache
				this.setCachable(true); // this content can be stored in the cache
				var self = this;
				MoodleMobApp.Session.getDownloader().findCachedFile(
					file,
					function() {
						self.setCached(true);
					},
					function() {
						self.setCached(false);
						self.toggleDownloadSelection();
					}
				);
			} else {
				this.setCachable(false); // this content cannot be stored in the cache
			}

			// intro section
			this.down('#intro').setHtml(record.get('intro'));
			if(record.get('intro') == "" || record.get('intro') == null) {
				this.down('#introButton').hide();
			}
		} 
	},

	setCachable: function(value) {
		this.config.cachable = value;
	},

	getCachable: function() {
		return this.config.cachable;
	},

	setCached: function(isCached) {
		this.config.cached = isCached;
		var onlineFlag = ' <img src="resources/images/online.png"/>';
		var cachedFlag = ' <img src="resources/images/download.png"/>';
		if(isCached) {
			this.down('#modname').setHtml(this.getRecord().get('modname') + cachedFlag);
			// this file has already been downloaded
			this.down('#queuefordownload').hide();
		} else {
			this.down('#modname').setHtml(this.getRecord().get('modname') + onlineFlag);
		}
	},

	getCached: function() {
		return this.config.cached;
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

