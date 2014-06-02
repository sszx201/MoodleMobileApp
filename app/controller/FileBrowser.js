Ext.define('MoodleMobApp.controller.FileBrowser', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.DirectoryEntry'
		],
		views: [
			'MoodleMobApp.view.Directory',
			'MoodleMobApp.view.DirectoryEntry'
		],


		refs: {
			navigator: 'coursenavigator',
			directory: 'directory'
		},

		control: {
			// generic controls
			directory: { itemtap: 'selectEntry' }
		}
	},

	init: function(){
	},

	openDirectory: function(path) {
		// Reference to the path. 
		this.rootPath = path;
		this.readDirectory(path);	
	},

	readDirectory: function(path) {	
		var self = this;
		path = path.replace(/^\//, "");
		MoodleMobApp.FileSystem.readDirectory(
			path,
			function(entries){
				Ext.each(entries, function(item) {
					item.fileEntry = item;
				})
				// check if subdirectory
				if(path != self.rootPath) {
					var parentEntry = Ext.create('MoodleMobApp.model.DirectoryEntry', {
						name: '..',
						isDirectory: true,
						fullPath: path.substring(0, path.lastIndexOf("/")),
						fileEntry: null
					});
					entries.push(parentEntry);
				}
				var directoryStore = Ext.create('Ext.data.Store', {
					model: 'MoodleMobApp.model.DirectoryEntry',
					sorters: [
						{ property: 'isDirectory', direction: 'DESC' },
						{ property: 'name' }
					],
					data: entries
				});
				// display directory
				if(typeof self.getDirectory() == 'object') {
					self.getDirectory().setStore(directoryStore);
					self.getNavigator().push(self.getDirectory());
					self.getNavigator().down('#topBar').setTitle(path.split("/").pop());
				} else {
					self.getNavigator().push({
						xtype: 'directory',	
						title: path.split("/").pop(),
						store: directoryStore
					});
				}
			},
			function(error) {
				Ext.Msg.alert(
					'Opening directory failed',
					'Error message: ' + error.message
				);
			}
		);	
	},

	selectEntry: function(view, index, target, entry) {
		if(entry.get('isDirectory')) { // subdir
			this.readDirectory(entry.get('fullPath'));
		} else {
			entry.get('fileEntry').file(function(file){
				MoodleMobApp.app.openFile(entry.get('fileEntry').nativeURL, file.type);
			});
		}
	}
});
