Ext.define('MoodleMobApp.store.ScormMetadataStore', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.ScormMetadata'
	],

	config: {
		storeId: 'scormmetadatastore',
		model: 'MoodleMobApp.model.ScormMetadata',
		grouper: {
			groupFn: function(record) {
				return record.get('href');
			}
		},
		// autoLoad: true,
		// autoSync: true,
		proxy : {
			// id: 'resource',
			type: 'memory'
		}
	}
});
