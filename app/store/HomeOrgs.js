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
			url: 'http://localhost/moodle22/auth/mobileaai/get_idps.php',
			reader: {
				type: 'json'
			}
		}
	}
});
