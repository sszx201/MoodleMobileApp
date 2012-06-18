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
		var course_modules_store = MoodleMobApp.WebService.getCourseModules(record.getData());
		this.getNavigator().push({
			xtype: 'coursecontent',	
			store: course_modules_store
		});
	},

});
