Ext.define('MoodleMobApp.store.account.HomeOrgs', {
    extend: 'Ext.data.Store',

	requires: ['MoodleMobApp.model.account.HomeOrg'],

    config: {
        model: 'MoodleMobApp.model.account.HomeOrg',
		proxy: {
			type: 'ajax',	
			url: 'http://localhost/moodle_dev2/auth/mobileaai/get_idps.php',
			reader: {
				type: 'json'
			}
		},
		autoLoad: true
    }
});
