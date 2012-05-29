Ext.define('iCorsi.model.account.HomeOrg', {
    extend: 'Ext.data.Model',
	
    config: {
		identifier: 'uuid',
        fields: [ 
            {name: 'name', type: 'string'},
            {name: 'url', type: 'string'}
        ]
    }
});
