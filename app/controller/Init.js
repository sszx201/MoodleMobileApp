Ext.define('MoodleMobApp.controller.Init', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			
		},
		control: {
			
		}
	},
	
	init: function() {
		// create settings store
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

		// create courses store
		var courses_store = Ext.create('MoodleMobApp.store.Courses');
		courses_store.load();

		// create enrolledusers store
		var enrolled_users_store = Ext.create('MoodleMobApp.store.EnrolledUsers');
		enrolled_users_store.load();

		// create users store
		var users_store = Ext.create('MoodleMobApp.store.Users');
		users_store.load();
	}
});
