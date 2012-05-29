Ext.define('MoodleMobApp.model.account.Aai', {
    extend: 'Ext.data.Model',
	
    config: {
		identifier: 'uuid',
        fields: [ 
            {name: 'username', type: 'string'},
            {name: 'password', type: 'string'},
            {name: 'homeorganisation', type: 'string'}
        ]
    }

});
