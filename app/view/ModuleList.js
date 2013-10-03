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
				// wait 100ms for the classes to load
				Ext.defer(this.addSectionLabels, 250, this);
			},
		}
	},

	dropSectionLabels: function(){
		// remove old sections labels
		Ext.select('.x-module-section').each(function(section_label){
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
		
		// add section labels
		var number_of_sections = 50;
		for(var i=1; i < number_of_sections; ++i){
			var element = Ext.select('.x-module-section-'+i).first();
			if(element == null) {
				break;
			} else {
				if(course_format == 'weeks') {
					label = Ext.Date.format(new Date(begin_day), date_format) + ' - ' + Ext.Date.format(new Date(end_day), date_format);
					begin_day = end_day + day;
					end_day = begin_day + week;
					Ext.DomHelper.insertBefore(element, '<div class="x-module-section">'+label+'</div>');
				} else {
					Ext.DomHelper.insertBefore(element, '<div class="x-module-section">section '+i+'</div>');
				}
			}
		}
	}
});
