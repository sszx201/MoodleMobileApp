Ext.define('MoodleMobApp.store.AssignSubmissions', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.AssignSubmission',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'assignsubmissions',
		model: 'MoodleMobApp.model.AssignSubmission',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'assignsubmission',
			type: 'localstorage'
		}
	}
});
