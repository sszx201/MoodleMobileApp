Ext.define('MoodleMobApp.store.OnlineAssignmentSubmissions', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.OnlineAssignmentSubmission',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'onlineassignmentsubmissions',
		model: 'MoodleMobApp.model.OnlineAssignmentSubmission',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'onlineassignmentsubmission',
			type: 'localstorage',
		}
	}
});
