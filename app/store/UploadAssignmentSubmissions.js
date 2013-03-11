Ext.define('MoodleMobApp.store.UploadAssignmentSubmissions', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.UploadAssignmentSubmission',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'uploadassignmentsubmissions',
		model: 'MoodleMobApp.model.UploadAssignmentSubmission',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'uploadassignmentsubmission',
			type: 'localstorage',
		}
	}
});
