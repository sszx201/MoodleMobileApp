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
			'MoodleMobApp.view.Partecipants',
			'MoodleMobApp.view.Partecipant',
			'MoodleMobApp.view.Grades',
			'MoodleMobApp.view.Grade',
		],

		refs: {
			navigator: '#course_navigator',
			courseList: '#course_list',
			moduleList: '#module_list',
			partecipants: '#partecipants',
			partecipantsSelectors: '#partecipants checkbox',
			showPartecipantsButton: '#module_list button[action=showpartecipants]',
			clearPartecipantsSelectionButton: '#partecipants button[action=clearselection]',
			selectAllPartecipantsButton: '#partecipants button[action=selectall]',
			contactPartecipantsButton: '#partecipants button[action=contactpartecipants]',
			grades: '#grades',
			showGradesButton: '#module_list button[action=showgrades]',
		},

		control: {
			navigator:  { pop: 'clearStoreFilters' },
			courseList: { itemtap: 'selectCourse' },
			moduleList: { itemtap: 'selectModule' },
			showPartecipantsButton: { tap: 'showPartecipants' },
			contactPartecipantsButton: { tap: 'contactPartecipants' },
			clearPartecipantsSelectionButton: { tap: 'clearPartecipantsSelection' },
			selectAllPartecipantsButton: { tap: 'selectAllPartecipants' },
			showGradesButton: { tap: 'showGrades' },
		}
	},

	init: function() {
		Ext.c = this;
		this.current_course = null;
	},

	selectCourse: function(view, index, target, record) {
		this.current_course = record;
		// set the course token inside the session
		MoodleMobApp.Session.setCourse(record);

		// filter modules
		var modules = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.Module' });
		MoodleMobApp.Session.getModulesStore().each(
			function(record) { 
				if( parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) ) {
					modules.add(record);
				}
			}, this
		);
		// display modules
		if(typeof this.getModuleList() == 'object') {
			this.getModuleList().setStore(modules);
			this.getNavigator().push(this.getModuleList());
		} else {
			this.getNavigator().push({
				xtype: 'modulelist',	
				store: modules
			});
		}
	},

	selectModule: function(view, index, target, record) {
		var update_stats = false;
		target.down('#modname').setHtml(target.getRecord().get('modname'));

		if(record.get('isnew') == true) {
			record.set('isnew', false);
			update_stats = true;
		}

		if(record.get('isupdated') == true) {
			record.set('isupdated', false);
			update_stats = true;
		}
		
		if(update_stats) {
			MoodleMobApp.Session.getModulesStore().sync();
			this.getApplication().getController('Main').updateCourseModulesStats(MoodleMobApp.Session.getCourse());
		}
	},

	showPartecipants: function(button) {
		this.filterPartecipants();
		// display modules
		if(typeof this.getPartecipants() == 'object') {
			this.getNavigator().push(this.getPartecipants());
		} else {
			this.getNavigator().push({
				xtype: 'partecipants',	
				store: MoodleMobApp.Session.getUsersStore()
			});
		}
	},

	filterPartecipants: function() {
		MoodleMobApp.Session.getEnrolledUsersStore().filterBy(
			function(enrolled_user) {
				return parseInt(enrolled_user.get('courseid')) == parseInt(this.current_course.get('id'))
			}, this
		);
		MoodleMobApp.Session.getUsersStore().filterBy(
			function(user) {
				// if the value is different from -1 than the user is in the enrolled users
				return MoodleMobApp.Session.getEnrolledUsersStore().findExact('userid', user.get('id')) != -1;
			}, this
		);
	},

	contactPartecipants: function(button) {
		// extract the list of selected users
		var list = '';
		var separator = ';';
		var partecipants = this.getPartecipants().getInnerItems()[1].getInnerItems();
		Ext.each(partecipants, function(partecipant) {
			if(partecipant.getSelection().isChecked()) {
				list += partecipant.getRecord().get('email') + separator;
			}
		});

		if(list == '') {
			// no partecipants selected
			Ext.Msg.alert( 'Partecipants List Empty', 'No partecipants have been selected. Please select some of the partecipants and try again.');		
			return;
		} else {
			MoodleMobApp.app.sendEmail(list, '', '');	
		}
	},

	clearPartecipantsSelection: function() {
		var partecipants = this.getPartecipants().getInnerItems()[1].getInnerItems();
		Ext.each(partecipants, function(partecipant) {
			partecipant.down('#selection').uncheck();
		});
	},
	
	selectAllPartecipants: function() {
		var partecipants = this.getPartecipants().getInnerItems()[1].getInnerItems();
		Ext.each(partecipants, function(partecipant) {
			partecipant.down('#selection').check();
		});
	},

	clearStoreFilters: function(controller, view, opts) {
		switch(view.getId()) {
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
			case 'partecipants':
				MoodleMobApp.Session.getUsersStore().clearFilter();
				MoodleMobApp.Session.getEnrolledUsersStore().clearFilter();
				break;
			case 'grades':
				MoodleMobApp.Session.getGradeItemsStore().clearFilter();
				break;
			default:
				console.log('no instructions on how to clear stores for view: '+view.getId());
		}
	},

	showGrades: function(button) {
		MoodleMobApp.Session.getGradeItemsStore().filterBy(
			function(record) { 
				return parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) && record.get('hidden') == 0;
			}, this
		);

		// display modules
		if(typeof this.getGrades() == 'object') {
			this.getNavigator().push(this.getGrades());
		} else {
			this.getNavigator().push({
				xtype: 'grades',
				store: MoodleMobApp.Session.getGradeItemsStore()
			});
		}
	},

});
