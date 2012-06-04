Ext.define('MoodleMobApp.controller.course.Navigator', {
	extend: 'Ext.app.Controller',
	requires: [
		'MoodleMobApp.view.course.Content'	
	],	
	config: {
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
		//console.log(record.internalId);
		this.getNavigator().push({
			xtype: 'coursecontent',	
		});
	},

});
