Ext.define("MoodleMobApp.view.Directory", {
	extend: 'Ext.DataView',
	xtype: 'directory',

	config: {
	   	title: 'Archive Content', 
		emptyText: 'No content in this archive.',
		useComponents: true,
		defaultType: 'directoryentry'
	}
});
