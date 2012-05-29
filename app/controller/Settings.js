Ext.define('MoodleMobApp.controller.Settings', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            
        },
        control: {
            
        }
    },
    
    init: function() {
		// Check if db exists or not.
		// Initialize if it does not exist.
		var settings_store = Ext.create('MoodleMobApp.store.Settings');
		settings_store.load({
			callback: function(records, operation, success) {
				if( records.length == 0 ) { // initialize usersettings
					var settings_init_data = Ext.create('MoodleMobApp.model.Settings', {
						usageagreement: false,
						accounttype: '',
						storeaccount: false
					});	
					this.setData(settings_init_data);
					this.sync();
				}
			}
		});
	}
});
