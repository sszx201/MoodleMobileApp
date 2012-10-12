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
			moduleList: { itemtap: 'selectModule' },
		}
	},

	init: function(){
		this.modules_store = Ext.data.StoreManager.lookup('modules');
		this.current_course = null;
	},

	selectCourse: function(view, index, target, record) {
		this.selected_course = record;
		var course_data = record.getData();
		// set the course token inside the session
		MoodleMobApp.Session.setCourseToken(course_data.token);
		// filter modules
		this.modules_store.clearFilter();
		this.modules_store.filterBy(
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
				store: this.modules_store
			});
		}
		
	},

	selectModule: function(view, index, target, record) {
		var update_stats = false;
		target.getModName().setHtml(target.getRecord().get('modname'));
		if(target.getRecord().get('isnew') == true) {
			target.getRecord().set('isnew', false);
			update_stats = true;
		}
		if(target.getRecord().get('isupdated') == true) {
			target.getRecord().set('isupdated', false);
			update_stats = true;
		}

		if(update_stats){
			this.modules_store.sync();
			this.getApplication().getController('Main').updateCourseModulesStats(this.selected_course);
		}
	},

});
