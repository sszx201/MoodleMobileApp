Ext.define('MoodleMobApp.controller.CourseNavigator', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Module'
		],

		views: [
			'MoodleMobApp.view.ModuleList',
			'MoodleMobApp.view.Module',
			'MoodleMobApp.view.RecentActivityList',
			'MoodleMobApp.view.RecentActivity',
			'MoodleMobApp.view.Participants',
			'MoodleMobApp.view.Participant',
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
			participantsButton: 'button#participantsAppBtn',
			gradesButton: 'button#gradesAppBtn',
			calendarButton: 'button#calendarAppBtn',
			// views
			navigator: 'coursenavigator',
			settings: 'settings',
			courseList: 'courselist',
			moduleList: 'modulelist',
			recentActivityList: 'recentactivitylist',
			participants: 'participants',
			participantsSelectors: 'participants checkbox',
			clearParticipantsSelectionButton: 'participants button[action=clearselection]',
			selectAllParticipantsButton: 'participants button[action=selectall]',
			contactParticipantsButton: 'participants button[action=contactparticipants]',
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
			participantsButton: { tap: 'showParticipants' },
			gradesButton: { tap: 'showGrades' },
			calendarButton: { tap: 'showCalendarEvents' },
			navigator:  {
				show: 'initCourseNavigator',
				pop: 'updateSideMenuStatus',
				courseUpdated: 'showCourse'
			},
			courseList: { itemtap: 'selectCourse' },
			//moduleList: { itemtap: 'selectModule' },
			contactParticipantsButton: { tap: 'contactParticipants' },
			clearParticipantsSelectionButton: { tap: 'clearParticipantsSelection' },
			selectAllParticipantsButton: { tap: 'selectAllParticipants' },
			networkPickerButton: { tap: 'contactParticipantsWithSelectedNetwork' },
			recentActivityList: {
				checkActivity: function(record) {
					if(record.get('modname') == 'calendar_event') {
						var calendar_event = MoodleMobApp.Session.getCalendarEventsStore().findRecord('id', record.get('reference'));
						if(calendar_event != undefined && calendar_event != null) {
							this.showCalendarEvents();
						} else {
							Ext.Msg.alert(
								'Forum content',
								'This forum content is not available anymore. It was moved or deleted.'
							);
						}
					}
				}
			}
		}
	},

	init: function() {
		Ext.c = this;
		this.current_course = null;
	},

	initCourseNavigator: function() {
		if( window.device != undefined && parseInt(window.device.version) > 6 ) {
			this.getNavigator().setStyle('margin-top: 20px;');
		}
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
			this.getSettings().setStyle(''); // remove the top bar; ios7 fix
			this.getSettings().setTitle('Settings');
			this.getNavigator().push(this.getSettings());
		} else {
			var settings = Ext.create('MoodleMobApp.view.Settings');
			settings.setTitle('Settings');
			this.getNavigator().push(settings);
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
		this.getParticipantsButton().show();
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
		} else {
			this.getNavigator().push({
				xtype: 'modulelist',
				store: modules
			});
		}
		this.setCourseTitle();
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

	showParticipants: function(button) {
		var participants = this.getCourseParticipants();
		// display modules
		if(typeof this.getParticipants() == 'object') {
			this.getParticipants().setStore(participants);
			this.getNavigator().push(this.getParticipants());
		} else {
			this.getNavigator().push({
				xtype: 'participants',	
				store: participants
			});
		}
	},

	getCourseParticipants: function() {
		// filter modules
		var participants = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.EnrolledUser' });
		MoodleMobApp.Session.getEnrolledUsersStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) == parseInt(this.current_course.get('id')) ) {
					if (record.get('userid') != null) {
						var user = MoodleMobApp.Session.getUsersStore().findRecord('id', record.get('userid'));
						participants.add(user);
					}
				}
			}, this
		);
		return participants;
	},

	contactParticipants: function(button) {
		// extract the list of selected users
		this.list = new Array();
		var separator = ';';
		var participants = this.getParticipants().getInnerItems()[1].getInnerItems();
		var skypeAvailable = true;
		var phoneAvailable = true;
		var smsAvailable = true;
		var participantsToContact = 0;
		Ext.each(participants, function(participant) {
			if(participant.down('#selection').isChecked()) {
				++participantsToContact;
				// skype check
				if(participant.getRecord().get('skype') == "") {
					skypeAvailable = false;
				}
				// phone number check --> enable only if just one contact has been selected
				if(participant.getRecord().get('phone') == "" || participantsToContact > 1) {
					phoneAvailable = false;
				}
				// sms check
				if(participant.getRecord().get('phone') == "") {
					smsAvailable = false;
				}

				this.list.push(participant.getRecord());
			}
		}, this);

		if(this.list.length == 0) {
			// no participants selected
			Ext.Msg.alert( 'Participants List Empty', 'No participants have been selected. Please select some of the participants and try again.');		
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

	contactParticipantsWithSelectedNetwork: function(button) {
		console.log('contacting the participants with:' + button.getItemId());
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

	clearParticipantsSelection: function() {
		var participants = this.getParticipants().getInnerItems()[1].getInnerItems();
		Ext.each(participants, function(participant) {
			participant.down('#selection').uncheck();
		});
	},
	
	selectAllParticipants: function() {
		var participants = this.getParticipants().getInnerItems()[1].getInnerItems();
		Ext.each(participants, function(participant) {
			participant.down('#selection').check();
		});
	},

	updateSideMenuStatus: function(controller, view, opts) {
		switch(view.xtype) {
			case 'modulelist':
				this.getHomeButton().hide();
				this.getRecentActivityButton().hide();
				this.getParticipantsButton().hide();
				this.getGradesButton().hide();
				this.getCalendarButton().hide();
			break;
		}
		this.setCourseTitle();
	},

	setCourseTitle: function() {
		// set the title
		if(this.getNavigator().getActiveItem().xtype == 'modulelist') {
			this.getNavigator().down('#topBar').setTitle(this.current_course.get('name'));
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
