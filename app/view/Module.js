Ext.define("MoodleMobApp.view.Module", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'module',

	config: {
		cls: 'x-module',
		autoDestroy: true,
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-module-name'
			},
			{
				itemId: 'modname',
				xtype: 'component',
				cls: 'x-course-module-status'
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
			this.down('#name').setHtml(record.get('name'));

			var classes = 'x-module';
			var modname = '';
			if(record.get('visible') == 0) {
				classes+= ' x-module-icon-'+record.get('modname')+'-gray';
				modname = record.get('modname') + ' <img src="resources/images/invisible.png"/>';
			} else {
				classes+= ' x-module-icon-'+record.get('modname');
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
			}

			var filePath = null;
			switch(module) {
				case 'resource':
					var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);

					if(resource.get('filemime').indexOf('html') == -1) {
						var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + resource.get('fileid');
						if(resource.get('filemime') == 'application/zip') {
							filePath = dirPath + '/_archive_extracted_';
						} else {
							filePath = dirPath + '/' + resource.get('filename').split(' ').join('_');
						}
					} else {
						modname += ' <img src="resources/images/online.png"/>';
					}
				break;

				case 'scorm':
					filePath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/scorm/' + record.get('id') + '/_scorm_extracted_';
				break;
			}

			this.down('#modname').setHtml(modname);
			classes+= ' x-module-section-'+record.get('section');
			this.setCls(classes);

			if( filePath != null ) { // check the cache
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

			// intro section
			this.down('#intro').setHtml(record.get('intro'));
			if(record.get('intro') == "" || record.get('intro') == null) {
				this.down('#introButton').hide();
			}
		} 
	},

	setCached: function(isCached) {
		this.config.cached = isCached;
		var onlineFlag = ' <img src="resources/images/online.png"/>';
		var cachedFlag = ' <img src="resources/images/download.png"/>';
		if(isCached) {
			this.down('#modname').setHtml(this.getRecord().get('modname') + cachedFlag);
		} else {
			this.down('#modname').setHtml(this.getRecord().get('modname') + onlineFlag);
		}
	},

	getCached: function() {
		return this.config.cached;
	}

});

