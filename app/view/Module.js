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
				cls: 'x-course-name'
			},
			{
				itemId: 'modname',
				xtype: 'component',
				cls: 'x-course-module-status'
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
				module == 'data' ||
				module == 'feedback' ||
				module == 'workshop' ||
				module == 'quiz' ||
				module == 'wiki'
			) {
				modname += ' <img src="resources/images/online.png"/>';
			}

			if( module == 'resource' ) { // check the cache
				var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);

				console.log(resource.getData());
				console.log(resource.get('filemime').indexOf('html'));
				if(resource.get('filemime').indexOf('html') == -1) {
					var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + resource.get('fileid');
					var filePath = '';
					if(resource.get('filemime') == 'application/zip') {
						filePath = dirPath + '/_archive_extracted_';
					} else {
						filePath = dirPath + '/' + resource.get('filename').split(' ').join('_');
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
				} else {
					modname += ' <img src="resources/images/online.png"/>';
				}
			}

			this.down('#modname').setHtml(modname);
			classes+= ' x-module-section-'+record.get('section');
			this.setCls(classes);
		} 
	},

	setCached: function(isCached) {
		this.config.cached = isCached;
		var cachedFlag = ' <img src="resources/images/download.png"/>';
		if(isCached) {
			console.log(this.getRecord().get('name') + ' is cached');
			this.down('#modname').setHtml(this.down('#modname').getHtml() + cachedFlag);
		} else {
			this.down('#modname').setHtml(this.down('#modname').getHtml().replace(cachedFlag, ''));
		}
	},

	getCached: function() {
		return this.config.cached;
	}

});

