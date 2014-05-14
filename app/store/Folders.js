Ext.define('MoodleMobApp.store.Folders', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Folder',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'folders',
		groupField: 'rootid',
		model: 'MoodleMobApp.model.Folder',
		autoLoad: true,
		autoSync: true,
		proxy : {
			id: 'folder',
			type: 'localstorage'
		}
	}
});
