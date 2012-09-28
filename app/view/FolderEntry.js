Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',

		
		//html: '<a href="http://mobile.icorsi.ch/pluginfile.php/45/mod_folder/content/1/second%20sub%20folder/pdf_sample.pdf">pdf</b>',
		//html: '<a href="http://mobile.icorsi.ch/pluginfile.php/45/mod_folder/content/1/boa.jpg?forcedownload=1">pdf</b>',

		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'name'
			},

			getMime: {
				setHtml: 'mime'
			},
		},

		name: {
			cls: 'x-folder-entry-name',
		},

		mime: {
			cls: 'x-folder-entry-mime',
		},

		listeners: {
			updatedata: function() {
				this.addIcons();
			},
		}
	},


	addIcons: function(){
		console.log('adding icons');
		this.removeCls('x-subfolder-icon');
		this.removeCls('x-file-icon');
		if(this.getRecord().get('mime') == 'inode/directory'){
			this.addCls('x-subfolder-icon');
		} else {
			this.addCls('x-file-icon');
		}
	},

	applyName: function(config) {
		return Ext.factory(config, Ext.Component, this.getName());
	},

	updateName: function(newName, oldName) {
		if (newName) {
			this.add(newName);
		}

		if (oldName) {
			this.remove(oldName);
		}
	},

	applyMime: function(config) {
		return Ext.factory(config, Ext.Component, this.getMime());
	},

	updateMime: function(newMime, oldMime) {
		if (newMime) {
			this.add(newMime);
		}

		if (oldMime) {
			this.remove(oldMime);
		}
	},
});

