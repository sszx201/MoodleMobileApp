Ext.define('MoodleMobApp.controller.course.Navigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.course.Content'	
		],
		views: [
			'MoodleMobApp.view.course.Content'	
		],
		refs: {
			navigator: '#course_navigator',
			course: '#course_list'
		},

		control: {
			course: {
				select: 'selectCourse',

			}
		}
	},

	selectCourse: function (view, record) {
		//console.log(record.getData());
		var course_modules_store = this.getCourseModules(record.getData());
		this.getNavigator().push({
			xtype: 'coursecontent',	
			store: course_modules_store
		});
	},

	selectModule: function (view, record) {
		console.log(record.getData());
	},

	//*****************************	
	// rest getters
	//*****************************	
	webServiceRequest: function(wstoken, wsfunction, params) {
		var query = MoodleMobApp.Config.getWebServiceUrl() + '?wstoken=' + wstoken + '&wsfunction=' + wsfunction + '&' + params + '&moodlewsrestformat=json'; 
		//console.log(query);

		var content_store = Ext.create('Ext.data.Store', {
			model: 'MoodleMobApp.model.course.Content',
			proxy: {
				type: 'ajax',
				url: query,
				pageParam: false,
				startParam: false,
				limitParam: false,
				noCache: false,
				reader: {
					type: 'json'
				}
			}
		});

		// get the content
		return content_store.load({
			callback: function(records, operation, success) {
				// check if there are any exceptions 
				if( this.first().raw.exception == undefined) {
					return this;
				} else {
					Ext.Msg.alert(
						this.first().raw.exception,
						this.first().raw.message
					);
				}
			}
		});
	},
	
	getCourseModules: function(course) {
		return this.webServiceRequest(course.token, 'local_uniappws_get_course_modules', 'id='+course.id);
	}
});
