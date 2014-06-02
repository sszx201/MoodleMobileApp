Ext.define("MoodleMobApp.view.Folder", {
	extend: 'Ext.DataView',
	xtype: 'folder',

	config: {
	   	title: 'Folder Content', 
		emptyText: 'No content in this folder.',
		useComponents: true,
		defaultType: 'folderentry'
	}
});
