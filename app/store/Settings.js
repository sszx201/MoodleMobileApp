Ext.define('iCorsi.store.Settings', {
    extend: 'Ext.data.Store',

	requires: [
		'iCorsi.model.Settings',
		'Ext.data.proxy.LocalStorage'
		],

    config: {
        model: 'iCorsi.model.Settings',
		proxy: {
			type: 'localstorage',	
			id: 'settings'
		},
    }
});
