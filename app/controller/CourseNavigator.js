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
			'MoodleMobApp.view.RecentActivityList',
			'MoodleMobApp.view.RecentActivity',
			'MoodleMobApp.view.Partecipants',
			'MoodleMobApp.view.Partecipant',
			'MoodleMobApp.view.Grades',
			'MoodleMobApp.view.Grade',
			'MoodleMobApp.view.CalendarEvents',
			'MoodleMobApp.view.CalendarEvent',
			'MoodleMobApp.view.NetworkPicker'
		],

		refs: {
			// app bar
			appBarButton: 'button#appBarBtn',
			appBar: 'container#appbar',
			homeButton: 'button#homeAppBtn',
			settingsButton: 'button#settingsAppBtn',
			recentActivityButton: 'button#recentActivityAppBtn',
			partecipantsButton: 'button#partecipantsAppBtn',
			gradesButton: 'button#gradesAppBtn',
			calendarButton: 'button#calendarAppBtn',
			// views
			navigator: 'coursenavigator',
			settings: 'settings',
			courseList: 'courselist',
			moduleList: 'modulelist',
			recentActivityList: 'recentactivitylist',
			partecipants: 'partecipants',
			partecipantsSelectors: 'partecipants checkbox',
			clearPartecipantsSelectionButton: 'partecipants button[action=clearselection]',
			selectAllPartecipantsButton: 'partecipants button[action=selectall]',
			contactPartecipantsButton: 'partecipants button[action=contactpartecipants]',
			networkPicker: 'networkpicker',
			networkPickerButton: 'networkpicker button',
			grades: 'grades',
			calendar: 'calendarevents'
		},

		control: {
			appBarButton: { tap: 'toggleSideMenu' },
			homeButton: { tap: 'goHome' },
			settingsButton: { tap: 'showSettings' },
			recentActivityButton: { tap: 'showRecentActivity' },
			partecipantsButton: { tap: 'showPartecipants' },
			gradesButton: { tap: 'showGrades' },
			calendarButton: { tap: 'showCalendarEvents' },
			navigator:  {
				pop: 'updateSideMenuStatus',
				courseUpdated: 'showCourse'
			},
			courseList: { itemtap: 'selectCourse' },
			//moduleList: { itemtap: 'selectModule' },
			contactPartecipantsButton: { tap: 'contactPartecipants' },
			clearPartecipantsSelectionButton: { tap: 'clearPartecipantsSelection' },
			selectAllPartecipantsButton: { tap: 'selectAllPartecipants' },
			networkPickerButton: { tap: 'contactPartecipantsWithSelectedNetwork' }
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
		// go back to the course list
		this.getNavigator().pop('courselist');
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
		// store the current course
		this.current_course = record;
		// set the course token inside the session
		MoodleMobApp.Session.setCourse(record);

		// update the app bar
		this.getHomeButton().show();
		this.getRecentActivityButton().show();
		this.getGradesButton().show();
		this.getPartecipantsButton().show();
		this.getCalendarButton().show();
		// check the course status
		// display if the course has already been synchronized
		if(record.get('synchronized') != true && MoodleMobApp.app.isConnectionAvailable()) {
			this.getNavigator().fireEvent('updateCourse', record);
		} else {
			this.showCourse();
		}
	},

	showCourse: function() {
		// filter activity
		var recent_activity = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.RecentActivity' });
		MoodleMobApp.Session.getRecentActivitiesStore().each(
			function(activity) {
				if( parseInt(activity.get('courseid')) == parseInt(this.current_course.get('id')) ) {
					recent_activity.add(activity);
				}
			}, this
		);
		if(recent_activity.getCount() > 0) {
			this.getRecentActivityButton().setBadgeText(recent_activity.getCount());
		}
		this.course_recent_activity = recent_activity;

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

	//selectModule: function(view, index, target, record) { target.down('#modname').setHtml(target.getRecord().get('modname')); },
	showRecentActivity: function(button) {
		// display recent activity
		if(typeof this.getRecentActivityList() == 'object') {
			this.getRecentActivityList().setStore(this.course_recent_activity);
			this.getNavigator().push(this.getRecentActivityList());
		} else {
			this.getNavigator().push({
				xtype: 'recentactivitylist',	
				store: this.course_recent_activity
			});
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
		this.list = new Array();
		var separator = ';';
		var partecipants = this.getPartecipants().getInnerItems()[1].getInnerItems();
		var skypeAvailable = true;
		var phoneAvailable = true;
		var smsAvailable = true;
		var partecipantsToContact = 0;
		Ext.each(partecipants, function(partecipant) {
			if(partecipant.down('#selection').isChecked()) {
				++partecipantsToContact;
				// skype check
				if(partecipant.getRecord().get('skype') == "") {
					skypeAvailable = false;
				}
				// phone number check --> enable only if just one contact has been selected
				if(partecipant.getRecord().get('phone') == "" || partecipantsToContact > 1) {
					phoneAvailable = false;
				}
				// sms check
				if(partecipant.getRecord().get('phone') == "") {
					smsAvailable = false;
				}

				this.list.push(partecipant.getRecord());
			}
		}, this);

		if(this.list.length == 0) {
			// no partecipants selected
			Ext.Msg.alert( 'Partecipants List Empty', 'No partecipants have been selected. Please select some of the partecipants and try again.');		
			return;
		} else {
			if(skypeAvailable || phoneAvailable) {
				this.chooseNetwork(skypeAvailable, phoneAvailable, smsAvailable);
			} else {
				this.sendEmail();
			}
		}
	},

	chooseNetwork: function(skypeAvailable, phoneAvailable, smsAvailable) {
		if(typeof this.getNetworkPicker() == 'object') {
			this.getNetworkPicker().setSkype(skypeAvailable);
			this.getNetworkPicker().setPhone(phoneAvailable);
			this.getNetworkPicker().setSms(smsAvailable);
			this.getNetworkPicker().show();
		} else {
			this.getNavigator().push({
				xtype: 'networkpicker',
				skype: skypeAvailable,
				phone: phoneAvailable,
				sms: smsAvailable
			});
		}
	},

	contactPartecipantsWithSelectedNetwork: function(button) {
		console.log('contacting the partecipants with:' + button.getItemId());
		this.getNetworkPicker().hide();
		switch(button.getItemId()) {
			case 'skype':
				this.startSkype();
			break;
			case 'phone':
				this.startPhoneCall();
			break;
			case 'sms':
				this.sendSms();
			break;
			case 'email':
				this.sendEmail();
			break;
		}
	},

	sendEmail: function() {
		var separator = ';';
		var list = '';
		for(var i = 0; this.list.length > i; ++i) {
			list += this.list[i].get('email') + separator;
		}
		MoodleMobApp.app.sendEmail(list);
	},

	sendSms: function() {
		var separator = ';';
		var list = '';
		for(var i = 0; this.list.length > i; ++i) {
			list += this.list[i].get('phone') + separator;
		}
		MoodleMobApp.app.sendSms(list);
	},

	startSkype: function() {
		var separator = ';';
		var list = '';
		for(var i = 0; this.list.length > i; ++i) {
			list += this.list[i].get('skype') + separator;
		}
		MoodleMobApp.app.startSkype(list);
	},

	startPhoneCall: function() { MoodleMobApp.app.phone(this.list.pop().get('phone')); },

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
				this.getRecentActivityButton().hide();
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
