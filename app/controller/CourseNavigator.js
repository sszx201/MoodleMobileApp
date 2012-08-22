Ext.define('MoodleMobApp.controller.CourseNavigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Module',
			'MoodleMobApp.model.ModulesCount',
		],

		views: [
			'MoodleMobApp.view.ModuleList',
			'MoodleMobApp.view.Module',
		],

		refs: {
			navigator: '#course_navigator',
			courseList: '#course_list',
			moduleList: '#module_list',
		},

		control: {
			courseList: { itemtap: 'selectCourse' },
		}
	},
	
	selectCourse: function(view, index, target, record) {
		var modules_store = Ext.data.StoreManager.lookup('modules');
		var course_data = record.getData();
		// set the course token inside the session
		MoodleMobApp.Session.setCourseToken(course_data.token);
		// filter modules
		modules_store.clearFilter();
		modules_store.filterBy(
			function(record) { 
				return parseInt(record.get('courseid')) == parseInt(course_data.id)
			}
		);

		// display modules
		if(typeof this.getModuleList() == 'object') {
			this.getNavigator().push(this.getModuleList());
		} else {
			this.getNavigator().push({
				xtype: 'modulelist',	
				store: modules_store
			});
		}
		
	},

});
