Ext.define('MoodleMobApp.store.ScormMetadataStore', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.ScormMetadata'
		],

	config: {
		storeId: 'scormmetadatastore',
		model: 'MoodleMobApp.model.ScormMetadata',
		// autoLoad: true,
		// autoSync: true,
		proxy : {
			// id: 'resource',
			type: 'memory'
		}
	}
});
