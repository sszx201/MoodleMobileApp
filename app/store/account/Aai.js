Ext.define('iCorsi.store.account.Aai', {
    extend: 'Ext.data.Store',

	requires: [
		'iCorsi.model.account.Aai',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
        model: 'iCorsi.model.account.Aai',
		proxy: {
			type: 'localstorage',	
			id: 'aaiaccount'
		},
    }
});
