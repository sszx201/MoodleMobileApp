Ext.define('iCorsi.store.account.Manual', {
    extend: 'Ext.data.Store',

	requires: [
		'iCorsi.model.account.Manual',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
        model: 'iCorsi.model.account.Manual',
		proxy: {
			type: 'localstorage',	
			id: 'manualaccount'
		},
    }
});
