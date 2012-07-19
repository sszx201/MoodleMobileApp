Ext.define("MoodleMobApp.view.ModuleList", {
	extend: 'Ext.List',
	xtype: 'modulelist',

	config: {
		id: 'module_list',
	   	title: 'List of modules', 
		grouped: true,
		itemTpl: '{name}',
		onItemDisclosure: true,
	},
});
