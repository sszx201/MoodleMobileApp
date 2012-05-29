Ext.define('MoodleMobApp.model.account.Manual', {
    extend: 'Ext.data.Model',
	
    config: {
		identifier: 'uuid',
        fields: [ 
            {name: 'username', type: 'string'},
            {name: 'password', type: 'string'}
        ]
    }
});
