Ext.define('MoodleMobApp.controller.CourseNavigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Module',
			'MoodleMobApp.model.ModulesCount'
		],

		views: [
			'MoodleMobApp.view.ModuleList',
			'MoodleMobApp.view.Module',
			'MoodleMobApp.view.Partecipants',
			'MoodleMobApp.view.Partecipant',
			'MoodleMobApp.view.Grades',
			'MoodleMobApp.view.Grade',
			'MoodleMobApp.view.CalendarEvents',
			'MoodleMobApp.view.CalendarEvent'
		],

		refs: {
			// app bar
			appBarButton: 'button#appBarBtn',
			appBar: 'container#appbar',
			homeButton: 'button#homeAppBtn',
			settingsButton: 'button#settingsAppBtn',
			partecipantsButton: 'button#partecipantsAppBtn',
			gradesButton: 'button#gradesAppBtn',
			calendarButton: 'button#calendarAppBtn',
			// views
			navigator: 'coursenavigator',
			settings: 'settings',
			courseList: 'courselist',
			moduleList: 'modulelist',
			partecipants: 'partecipants',
			partecipantsSelectors: 'partecipants checkbox',
			clearPartecipantsSelectionButton: 'partecipants button[action=clearselection]',
			selectAllPartecipantsButton: 'partecipants button[action=selectall]',
			contactPartecipantsButton: 'partecipants button[action=contactpartecipants]',
			grades: 'grades',
			calendar: 'calendarevents'
		},

		control: {
			appBarButton: { tap: 'toggleSideMenu' },
			homeButton: { tap: 'goHome' },
			settingsButton: { tap: 'showSettings' },
			partecipantsButton: { tap: 'showPartecipants' },
			gradesButton: { tap: 'showGrades' },
			calendarButton: { tap: 'showCalendarEvents' },
			navigator:  {
				pop: 'updateSideMenuStatus',
				courseUpdated: 'showCourse'
			},
			courseList: { itemtap: 'selectCourse' },
			moduleList: { itemtap: 'selectModule' },
			contactPartecipantsButton: { tap: 'contactPartecipants' },
			clearPartecipantsSelectionButton: { tap: 'clearPartecipantsSelection' },
			selectAllPartecipantsButton: { tap: 'selectAllPartecipants' }
		}
	},

	init: function() {
		Ext.c = this;
		this.current_course = null;
	},

	toggleSideMenu: function() {
		if(this.getAppBar().getRight() == null || this.getAppBar().getRight() == '-200px') {
			// resize the container
			document.getElementsByClassName('x-navigationview-inner')[0].setAttribute('style', 'margin-right: 100px');
			this.getAppBar().setRight('0px');
		} else {
			document.getElementsByClassName('x-navigationview-inner')[0].setAttribute('style', 'margin-right: 0px');
			this.getAppBar().setRight('-200px');
		}
	},

	goHome: function() {
		//this.toggleSideMenu();
		this.getNavigator().pop(10);
	},

	showSettings: function() {
		//this.toggleSideMenu();
		// display modules
		if(typeof this.getSettings() == 'object') {
			this.getNavigator().push(this.getSettings());
		} else {
			this.getNavigator().push({
				xtype: 'settings'
			});
		}
	},

	selectCourse: function(view, index, target, record) {
		// update the app bar
		this.getHomeButton().show();
		this.getGradesButton().show();
		this.getPartecipantsButton().show();
		this.getCalendarButton().show();
		// store the current course
		this.current_course = record;
		// set the course token inside the session
		MoodleMobApp.Session.setCourse(record);
		if(record.get('synchronized') != true) {
			this.getNavigator().fireEvent('updateCourse', record);
		} else {
			this.showCourse();
		}
	},

	showCourse: function() {
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
			this.getNavigator().down('#topBar').setTitle(this.current_course.get('name'));
		} else {
			this.getNavigator().push({
				xtype: 'modulelist',
				store: modules,
				title: this.current_course.get('name')
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
		var partecipants = this.getCoursePartecipants();
		// display modules
		if(typeof this.getPartecipants() == 'object') {
			this.getPartecipants().setStore(partecipants);
			this.getNavigator().push(this.getPartecipants());
		} else {
			this.getNavigator().push({
				xtype: 'partecipants',	
				store: partecipants
			});
		}
	},

	getCoursePartecipants: function() {
		// filter modules
		var partecipants = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.EnrolledUser' });
		MoodleMobApp.Session.getEnrolledUsersStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) ) {
					if (record.get('userid') != null) {
						var user = MoodleMobApp.Session.getUsersStore().findRecord('id', record.get('userid'));
						partecipants.add(user);
					}
				}
			}, this
		);
		return partecipants;
	},

	contactPartecipants: function(button) {
		// extract the list of selected users
		var list = '';
		var separator = ';';
		var partecipants = this.getPartecipants().getInnerItems()[1].getInnerItems();
		Ext.each(partecipants, function(partecipant) {
			if(partecipant.down('#selection').isChecked()) {
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

	updateSideMenuStatus: function(controller, view, opts) {
		switch(view.xtype) {
			case 'modulelist':
				this.getHomeButton().hide();
				this.getPartecipantsButton().hide();
				this.getGradesButton().hide();
				this.getCalendarButton().hide();
			break;
		}
	},

	showGrades: function(button) {
		var grade_items = this.getGradeItems();	
		// display modules
		if(typeof this.getGrades() == 'object') {
			this.getGrades().setStore(grade_items);
			this.getNavigator().push(this.getGrades());
		} else {
			this.getNavigator().push({
				xtype: 'grades',
				store: grade_items
			});
		}
	},

	getGradeItems: function() {
		// filter modules
		var grade_items = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.GradeItem' });
		MoodleMobApp.Session.getGradeItemsStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) && record.get('hidden') == 0 ) {
						grade_items.add(record);
				}
			}, this
		);
		return grade_items;
	},

	showCalendarEvents: function(button) {
		var calendar_events = this.getCalendarEvents();
		// display modules
		if(typeof this.getCalendar() == 'object') {
			this.getCalendar().setStore(calendar_events);
			this.getNavigator().push(this.getCalendar());
		} else {
			this.getNavigator().push({
				xtype: 'calendarevents',	
				store: calendar_events
			});
		}
	},

	getCalendarEvents: function() {
		// filter modules
		var calendar_events = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.CalendarEvent' });
		MoodleMobApp.Session.getCalendarEventsStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) ) {
						calendar_events.add(record);
				}
			}, this
		);
		return calendar_events;
	}

});
