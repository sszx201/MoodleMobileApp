Ext.define('MoodleMobApp.controller.Folder', {
	extend: 'Ext.app.Controller',

	config: {
		models: [ ],
		views: [
			'MoodleMobApp.view.Folder',
			'MoodleMobApp.view.FolderEntry'
		],


		refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			folder: 'folder',
			recentActivity: 'recentactivitylist'
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			folder: { itemtap: 'selectFolderEntry' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'folder') {
						var folder_record = MoodleMobApp.Session.getModulesStore().findRecord('id', record.get('moduleid'));
						if(folder_record != undefined) {
							this.selectFolder(folder_record);
						}
					}
				}
			}
		}
	},

	init: function(){
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'folder'){
			// download mode functionality
			if(MoodleMobApp.Session.getMultiDownloadMode() && !target.getCached()) {
				if(target.down('#queuefordownload').getChecked()) {
					target.down('#queuefordownload').uncheck();
				} else {
					target.down('#queuefordownload').check();
				}
			} else {
				this.selectFolder(record);
			}
		}
	},

	selectFolder: function(folder) {
		var folder_tree = this.getFolderRoot(folder.get('instanceid'));
		// display folder
		if(typeof this.getFolder() == 'object') {
			this.getFolder().setStore(folder_tree);
			this.getNavigator().push(this.getFolder());
			this.getNavigator().down('#topBar').setTitle(folder.get('name'));
		} else {
			this.getNavigator().push({
				xtype: 'folder',	
				title: folder.get('name'),
				store: folder_tree
			});
		}
	},

	getFolderRoot: function(folderid) {
		// filter modules
		var folders_store = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.Folder' });
		MoodleMobApp.Session.getFoldersStore().each(
			function(record) {
				if( record.get('rootid') === folderid && record.get('parent') == '/' && record.get('name') != '/' ) {
					folders_store.add(record);
				}
			}, this
		);
		folders_store.sort([{property: 'type'}, {property: 'name'}]);
		return folders_store;
	},

	getSubFolder: function(folder) {
		// filter modules
		var folders_store = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.Folder' });
		MoodleMobApp.Session.getFoldersStore().each(
			function(record) {
				if( record.get('rootid') === folder.get('rootid') && record.get('parent') == folder.get('name') ) {
					folders_store.add(record);
				}
			}, this
		);
		// add .. entry
		var upper_folder_entry = Ext.create( 'MoodleMobApp.model.Folder', {
			'name': '..',
			'rootid': folder.get('rootid'),
			'parent': folder.get('name'),
			'mime': folder.get('mime'),
			'type': folder.get('type')
		});
		folders_store.add(upper_folder_entry);
		folders_store.sort([{property: 'type'}, {property: 'name'}]);
		return folders_store;
	},

	getParentFolder: function(folder) {
		// get the parent folder
		var parent_folder_position = MoodleMobApp.Session.getFoldersStore().findBy(
			function(record) {
				return record.get('name') == folder.get('parent') && record.get('rootid') == folder.get('rootid');
			}
		);
		var parent_folder = MoodleMobApp.Session.getFoldersStore().getAt(parent_folder_position);

		// get the parent of the parent folder
		var parent_parent_folder_position = MoodleMobApp.Session.getFoldersStore().findBy(
			function(record){
				return record.get('name') == parent_folder.get('parent') && record.get('rootid') == parent_folder.get('rootid');
			}
		);
		var parent_parent_folder = MoodleMobApp.Session.getFoldersStore().getAt(parent_parent_folder_position);

		if(parent_parent_folder.get('name') == '/') {
			return this.getFolderRoot(parent_parent_folder.get('rootid'));
		} else {
			return this.getSubFolder(parent_parent_folder);
		}
	},

	selectFolderEntry: function(view, index, target, entry) {
		// download mode functionality
		if(MoodleMobApp.Session.getMultiDownloadMode() && !target.getCached()) {
			if(entry.get('name') != '..') { // consider only if the entry is not the up dir
				if(target.down('#queuefordownload').getChecked()) {
					target.down('#queuefordownload').uncheck();
				} else {
					target.down('#queuefordownload').check();
				}
			}
		} else {
			if(entry.get('name') == '..') { // up dir
				var parent_folder_store = this.getParentFolder(entry);
				this.getFolder().setStore(parent_folder_store);
				// display folder
				this.getNavigator().push(this.getFolder());
			} else if(entry.get('type') == 'dir') { // subdir
				var subfolder_store = this.getSubFolder(entry);	
				this.getFolder().setStore(subfolder_store);;
				this.getNavigator().push(this.getFolder());
			} else if(entry.get('type') == 'file'){
				var file = entry.getData();
				var callback = function(fileEntry) {
					target.setCached(true);
					if(file.mime == 'application/zip') {
						var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + file.fileid + '/' + file.name;
							dirPath = dirPath.split(' ').join('_').latinise().replace(/\.zip$/, '');
						MoodleMobApp.app.getController('FileBrowser').openDirectory(dirPath);
					} else {
						MoodleMobApp.app.openFile(fileEntry.toURL(), file.mime);
					}
				};
				this.getNavigator().fireEvent('downloadfile', file, callback);
			}
		}
		
	},

	addUpperFolderEntry: function(currentFolder){
		var upper_folder_entry = MoodleMobApp.Session.getFoldersStore().findRecord('name', '..');
		if(upper_folder_entry != null){
			upper_folder_entry.set('rootid', currentFolder.get('rootid'));
			upper_folder_entry.set('parent', currentFolder.get('name'));
		} else {
			// add .. entry
			var upper_folder_model = {
				'name': '..',
				'rootid': currentFolder.get('rootid'),
				'parent': currentFolder.get('name'),
				'mime': currentFolder.get('mime'),
				'type': currentFolder.get('type')
			};
			upper_folder_entry = Ext.create('MoodleMobApp.model.Folder', upper_folder_model);
			MoodleMobApp.Session.getFoldersStore().add(upper_folder_entry);
		}
	}
});
