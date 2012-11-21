Ext.define('MoodleMobApp.controller.Folder', {
	extend: 'Ext.app.Controller',

	config: {
		models: [ ],
		views: [
			'MoodleMobApp.view.Folder',
			'MoodleMobApp.view.FolderEntry',
		],


		refs: {
			navigator: '#course_navigator',
			module: '#module_list',
			folder: '#folder',
		},

		control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			folder: { itemtap: 'selectFolderEntry' },
		}
	},

	init: function(){
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'folder'){
			this.selectFolder(record.getData());
		}
	},

	selectFolder: function(folder) {
		// filter discussions
		MoodleMobApp.Session.getFoldersStore().clearFilter();
		MoodleMobApp.Session.getFoldersStore().filterBy(
			function(record) {
				return (record.get('rootid') === folder.instanceid) && (record.get('parent') == '/') && (record.get('name') != '/');
			}
		);
		this.sortFolder();

		// display folder
		if(typeof this.getFolder() == 'object') {
			this.getNavigator().push(this.getFolder());
		} else {
			this.getNavigator().push({
				xtype: 'folder',	
				store: MoodleMobApp.Session.getFoldersStore()
			});
		}
	},

	selectFolderEntry: function(view, index, target, entry) {
		if(entry.get('name') == '..') { // up dir
			MoodleMobApp.Session.getFoldersStore().clearFilter();
			// get the parent folder
			var parent_folder_position = MoodleMobApp.Session.getFoldersStore().findBy(
				function(record){
					return record.get('name') == entry.get('parent') && record.get('rootid') == entry.get('rootid');
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
			if(parent_parent_folder.get('name') != '/') {
				// add the upper folder reference
				this.addUpperFolderEntry(parent_parent_folder);
			}

			// sort and filter folders
			this.sortFolder();
			MoodleMobApp.Session.getFoldersStore().filterBy(
				function(record) {
					return (record.get('rootid') === parent_folder.get('rootid')) && (record.get('parent') == parent_folder.get('parent') && (record.get('name') != '/'));
				}	
			);
			// display folder
			this.getNavigator().push(this.getFolder());

		} else if(entry.get('type') == 'dir') { // subdir
			MoodleMobApp.Session.getFoldersStore().clearFilter();
			this.sortFolder();
			this.addUpperFolderEntry(entry);
			MoodleMobApp.Session.getFoldersStore().filterBy(
				function(record) {
					return (record.get('rootid') === entry.get('rootid')) && (record.get('parent') == entry.get('name'));
				}	
			);
			this.getNavigator().push(this.getFolder());
		} else if(entry.get('type') == 'file'){
			var token = MoodleMobApp.Session.getCourse().get('token');
			var file = entry.getData();

			var callBackFunc = function() {
				var filePath = '/'+MoodleMobApp.Config.getFileCacheDir()+'/'+entry.get('name');
				MoodleMobApp.app.openFile(filePath, entry.get('mime'));
			};

			MoodleMobApp.WebService.getFile(file, MoodleMobApp.Config.getFileCacheDir(), callBackFunc, token);
		}
		
	},

	addUpperFolderEntry: function(currentFolder){
		var position = MoodleMobApp.Session.getFoldersStore().findExact('name', '..');
		if(position != -1){
			var upper_folder_entry = MoodleMobApp.Session.getFoldersStore().getAt(position);
			upper_folder_entry.set('rootid', currentFolder.get('rootid'));
			upper_folder_entry.set('parent', currentFolder.get('name'));
		} else {
			// add .. entry
			var upper_folder_model = {
				'name': '..',
				'rootid': currentFolder.get('rootid'),
				'parent': currentFolder.get('name'),
				'mime': currentFolder.get('mime'),
				'type': currentFolder.get('type'),
			};
			var upper_folder_entry = Ext.create('MoodleMobApp.model.Folder', upper_folder_model);
			MoodleMobApp.Session.getFoldersStore().add(upper_folder_entry);
		}
	},

	sortFolder: function(){
		MoodleMobApp.Session.getFoldersStore().sort([{property: 'type'}, {property: 'name'}]);
	}

});
