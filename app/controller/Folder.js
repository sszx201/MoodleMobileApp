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
		this.folders_store = Ext.data.StoreManager.lookup('folders');
	},

	selectModule: function(view, index, target, record) {
		if(record.raw.modname === 'folder'){
			this.selectFolder(record.getData());
		}
	},

	selectFolder: function(folder) {
		// filter discussions
		this.folders_store.clearFilter();
		this.folders_store.filterBy(
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
				store: this.folders_store
			});
		}
	},

	selectFolderEntry: function(view, index, target, entry) {
		if(entry.get('name') == '..') { // up dir
			this.folders_store.clearFilter();
			// get the parent folder
			var parent_folder_position = this.folders_store.findBy(
				function(record){
					return record.get('name') == entry.get('parent') && record.get('rootid') == entry.get('rootid');
				}
			);
			var parent_folder = this.folders_store.getAt(parent_folder_position);
			// get the parent of the parent folder
			var parent_parent_folder_position = this.folders_store.findBy(
				function(record){
					return record.get('name') == parent_folder.get('parent') && record.get('rootid') == parent_folder.get('rootid');
				}
			);
			var parent_parent_folder = this.folders_store.getAt(parent_parent_folder_position);
			if(parent_parent_folder.get('name') != '/') {
				// add the upper folder reference
				this.addUpperFolderEntry(parent_parent_folder);
			}

			// sort and filter folders
			this.sortFolder();
			this.folders_store.filterBy(
				function(record) {
					return (record.get('rootid') === parent_folder.get('rootid')) && (record.get('parent') == parent_folder.get('parent') && (record.get('name') != '/'));
				}	
			);
			// display folder
			this.getNavigator().push(this.getFolder());

		} else if(entry.get('type') == 'dir') { // subdir
			this.folders_store.clearFilter();
			this.sortFolder();
			this.addUpperFolderEntry(entry);
			this.folders_store.filterBy(
				function(record) {
					return (record.get('rootid') === entry.get('rootid')) && (record.get('parent') == entry.get('name'));
				}	
			);
			this.getNavigator().push(this.getFolder());
		} else if(entry.get('type') == 'file'){
			MoodleMobApp.log(' >>>>>> downloading file: '+entry.get('url'));
			//window.open( entry.get('url'), "_blank");
		}
		
	},

	addUpperFolderEntry: function(currentFolder){
		this.folders_store = Ext.data.StoreManager.lookup('folders');
		var position = this.folders_store.findExact('name', '..');
		if(position != -1){
			var upper_folder_entry = this.folders_store.getAt(position);
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
			this.folders_store.add(upper_folder_entry);
		}
	},

	sortFolder: function(){
		this.folders_store.sort([{property: 'type'}, {property: 'name'}]);
	}

});
