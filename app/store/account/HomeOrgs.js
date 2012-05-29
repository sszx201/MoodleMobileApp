Ext.define('iCorsi.store.account.HomeOrgs', {
    extend: 'Ext.data.Store',

	requires: ['iCorsi.model.account.HomeOrg'],

    config: {
        model: 'iCorsi.model.account.HomeOrg',
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
