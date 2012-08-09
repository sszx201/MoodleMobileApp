Ext.define('MoodleMobApp.controller.Account', {
	extend: 'Ext.app.Controller',

	requires: [
		'MoodleMobApp.model.Course',
	],
   	
	config: {
		refs: {
		},

		control: {
		}
	},


	// The authentication function authenticates the user.
	// When the user is authenticated a list of courses and 
	// relative tokens is received. These info are then stored
	// in the localestorage. If the server responds with
	// an exception then an alert message is displayed.
	authenticate: function(auth_url, parameters) {
		
		var url_encoded_parms = '?';
		Ext.iterate(parameters, function(key, value){
			url_encoded_parms += '&'+key+'='+value;	
		});

		var store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.Course',
			proxy: {
				type: 'ajax',
				url : auth_url+url_encoded_parms, 
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				reader: {
					type: 'json'
				}
			}
		});

		store.load({
			callback: function(records, operation, success) {
				// check if there are any exceptions 
				if(this.first() == undefined){
					Ext.Msg.alert(
						'Authentication Failed',
						'The Authentication has failed. Please check your user data.'
					);
				} else if( this.first().raw.exception == undefined) {
					// store the username in the Session
					MoodleMobApp.Session.setUsername(parameters.username);
					// process courses
					var courses_store = Ext.data.StoreManager.lookup('courses');

					// remove courses the user is not enrolled in anymore
					courses_store.each(
						function(entry) {
							// refering as store because this has changed
							if(this.getById(entry.getData().id) === null) {
								courses_store.remove( entry );
							}
						}, this
					);

					// update local courses store
					this.each(
						function(entry) {
							if(courses_store.getById(entry.getData().id) === null) {
								courses_store.add( entry.getData() );
							} else {
								courses_store.getById(entry.getData().id).setData(entry.getData());
							}
						}
					);

					// prepare to write
					courses_store.each(
						function() { 
							this.setDirty();
						}
					);

					// store data
					courses_store.sync();
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
