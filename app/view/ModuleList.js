Ext.define("MoodleMobApp.view.ModuleList", {
	extend: 'Ext.DataView',
	xtype: 'modulelist',

	config: {
		id: 'module_list',
		//title: 'List of modules',
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'module',
		grouped: true,
		listeners: {
			painted: function(){
				this.dropSectionLabels();
				// wait some time for the modules to load
				Ext.defer(this.addSectionLabels, 250, this);
			},
		}
	},

	dropSectionLabels: function(){
		// remove old sections labels
		Ext.select('.x-course-section').each(function(section_label){
			section_label.destroy();
		});
	},

	addSectionLabels: function(){
		var course_format = MoodleMobApp.Session.getCourse().get('format');
		var course_start_date = MoodleMobApp.Session.getCourse().get('startdate')*1000; //
		var day = 24 * 3600 * 1000;
		var week = 6 * day; // in miliseconds
		var date_format = 'd M';
		var begin_day = course_start_date;
		var end_day = course_start_date + week;
		// get course sections
		// filter course sections
		var course_sections = Ext.create('Ext.data.Store', { model: 'MoodleMobApp.model.CourseSection', sorters: 'number' });
		MoodleMobApp.Session.getCourseSectionsStore().each(
			function(record) {
				if( parseInt(record.get('courseid')) == parseInt(MoodleMobApp.Session.getCourse().get('id')) ) {
					course_sections.add(record);
				}
			}, this
		);
		// add section labels
		var number_of_sections = course_sections.getCount();
		for(var i=1; i < number_of_sections; ++i){
			var section_number = course_sections.getAt(i).get('number');
			var element = Ext.select('.x-module-section-' + section_number).first();
			if(element == null) {
				break;
			} else {
				var title = null;
				var summary = null;
				if(course_sections.getAt(i).get('title') != null) {
					title = course_sections.getAt(i).get('title');
				}

				if(course_sections.getAt(i).get('summary') != null) {
					summary = course_sections.getAt(i).get('summary');
				}

				if(course_format == 'weeks') {
					if(title == null) {
						section_begin_day = begin_day + (section_number-1)*(week + day);
						section_end_day = end_day + (section_number-1)*(week + day);
						title = Ext.Date.format(new Date(section_begin_day), date_format) + ' - ' + Ext.Date.format(new Date(section_end_day), date_format);
					}
				} else {
					if(title == null) {
						title = 'Section ' + i;
					}
				}
				var section_label = '';
				if(summary == null) {
					section_label = '<div class="x-course-section">'+title+'</div>';
				} else {
					section_label = '<div class="x-course-section">'+title+'<div class="summary">'+summary+'</div></div>';
				}
				// add the section title
				Ext.DomHelper.insertBefore(element, section_label);
			}
		}
	}
});
