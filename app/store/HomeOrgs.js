Ext.define('MoodleMobApp.store.HomeOrgs', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.HomeOrg'
	],

	config: {
		storeId: 'homeorganisations_store',
		model: 'MoodleMobApp.model.HomeOrg',
		autoLoad: true,
		proxy: {
			type: 'ajax',	
			url: MoodleMobApp.Config.getHomeOrgsUrl(),
			reader: {
				type: 'json'
			}
		}
	}
});
