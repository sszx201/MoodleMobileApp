Ext.define('iCorsi.controller.UsageAgreement', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			agree: '#usageagreement_panel button[action=agree]',
			disagree: '#usageagreement_panel button[action=disagree]'
        },
        control: {
           agree:  {
				tap: 'registerAgreement'
		   },
		   disagree: {
		   		tap: 'registerDisagreement'
		  }
        }
    },

	registerAgreement: function() {
		var settings_store = Ext.create('iCorsi.store.Settings');
		settings_store.load();
		settings_store.data.first().getData().usageagreement = true;
		settings_store.first().setDirty();
		settings_store.sync();
		location.reload();
	},

	registerDisagreement: function() {
		console.log('user disagreed');
	},
    
});
