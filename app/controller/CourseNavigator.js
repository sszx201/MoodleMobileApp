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
			navigator:  { pop: 'clearStoreFilters' },
			courseList: { itemtap: 'selectCourse' },
			moduleList: { itemtap: 'selectModule' },
		}
	},

	init: function(){
		this.current_course = null;
	},

	selectCourse: function(view, index, target, record) {
		this.selected_course = record;
		var course_data = record.getData();
		// set the course token inside the session
		MoodleMobApp.Session.setCourseToken(course_data.token);
		// filter modules
		MoodleMobApp.Session.getModulesStore().clearFilter();
		MoodleMobApp.Session.getModulesStore().filterBy(
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
				store: MoodleMobApp.Session.getModulesStore()
			});
		}
		
	},

	selectModule: function(view, index, target, record) {
		var update_stats = false;
		target.getModName().setHtml(target.getRecord().get('modname'));

		if(record.get('isnew') == true) {
			record.set('isnew', false);
			update_stats = true;
		}

		if(record.get('isupdated') == true) {
			record.set('isupdated', false);
			update_stats = true;
		}
		
		if(update_stats){
			MoodleMobApp.Session.getModulesStore().sync();
			this.getApplication().getController('Main').updateCourseModulesStats(this.selected_course);
		}
	},

	clearStoreFilters: function(controller, view, opts) {
		switch(view.getId()){
			case 'module_list':
				MoodleMobApp.Session.getModulesStore().clearFilter();
				break;
			case 'forum_discussions_list':
				MoodleMobApp.Session.getForumDiscussionsStore().clearFilter();
				break;
			case 'offline_assignment_form':
				MoodleMobApp.Session.getOfflineAssignmentSubmissionsStore().clearFilter();
				break;
			case 'folder':
				MoodleMobApp.Session.getFoldersStore().clearFilter();
				break;
			default:
				console.log('no instructions on how to clear stores for view: '+view.getId());
		}
	}

});
