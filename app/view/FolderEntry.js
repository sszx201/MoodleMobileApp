Ext.define("MoodleMobApp.view.FolderEntry", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'folderentry',

	config: {
		cls: 'x-folder-entry',

		//html: '<a href="http://thumbs2.modthesims.info/img/6/4/3/3/1/8/MTS_Sango_91-857161-Chii.jpg">{name}</b>',

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
			updatedata: function(){ },
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

