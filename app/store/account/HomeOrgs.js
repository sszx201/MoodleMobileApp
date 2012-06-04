Ext.define('MoodleMobApp.store.account.HomeOrgs', {
    extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.account.HomeOrg'
	],

    config: {
		storeId: 'homeorganisations_store',
        model: 'MoodleMobApp.model.account.HomeOrg',
		autoLoad: true,
		proxy: {
			type: 'ajax',	
			url: 'http://localhost/moodle_dev2/auth/mobileaai/get_idps.php',
			reader: {
				type: 'json'
			}
		}
    }
});
