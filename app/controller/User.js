Ext.define('MoodleMobApp.controller.User', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			
		},
		control: {
			
		}
	},
	
	//***************************************************
	// Given the userid this function stores the new user 
	//***************************************************
	addToStore: function(userid){
		var new_user_store = MoodleMobApp.WebService.getUserById(userid);
		new_user_store.load({
			callback: function(records){
				if(this.first().raw.exception == undefined){
					// hook up the users store
					var users_store = Ext.data.StoreManager.lookup('users');
					records[0].setDirty();
					users_store.add(records);
					users_store.sync();
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			}	
		});

	},
	
});
