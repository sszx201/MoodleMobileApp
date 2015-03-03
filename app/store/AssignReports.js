Ext.define('MoodleMobApp.store.AssignReports', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.AssignReport',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'assignreport',
		model: 'MoodleMobApp.model.AssignReport',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'assignreport',
			type: 'localstorage'
		}
	}
});
