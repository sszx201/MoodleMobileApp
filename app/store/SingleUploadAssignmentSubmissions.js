Ext.define('MoodleMobApp.store.SingleUploadAssignmentSubmissions', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.SingleUploadAssignmentSubmission',
		'Ext.data.proxy.LocalStorage'
		],

	config: {
		storeId: 'singleuploadassignmentsubmissions',
		model: 'MoodleMobApp.model.SingleUploadAssignmentSubmission',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'singleuploadassignmentsubmission',
			type: 'localstorage',
		}
	}
});
