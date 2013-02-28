Ext.define("MoodleMobApp.view.ModuleList", {
	extend: 'Ext.DataView',
	xtype: 'modulelist',

	config: {
		id: 'module_list',
	   	title: 'List of modules', 
		emptyText: 'No posts available in this discussion.',
		useComponents: true,
		defaultType: 'module',
		grouped: true,
		items: [
			{
				xtype: 'toolbar',
				docked: 'bottom',
				items: [
					{
						xtype: 'spacer'
					},
					{
						xtype: 'button',	
						text: 'Partecipants',
						action: 'showpartecipants',
					},
					{
						xtype: 'button',	
						text: 'Grades',
						action: 'showgrades',
					},
					{
						xtype: 'spacer'
					},
				]
			},
		],

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
		var week = 6*24*3600*1000; // in miliseconds
		var date_format = 'd M';
		
		// add section labels
		var number_of_sections = 50;
		for(var i=1; i < number_of_sections; ++i){
			var element = Ext.select('.x-module-section-'+i).first();
			if(element == null) {
				break;
			} else {
				if(course_format == 'weeks') {
					var begin_day = new Date(course_start_date + week*(i-1));
					var end_day = new Date(course_start_date + week*i);
					var label = Ext.Date.format(begin_day, date_format) + ' - ' + Ext.Date.format(end_day, date_format);
					Ext.DomHelper.insertBefore(element, '<div class="x-module-section">'+label+'</div>');
				} else {
					Ext.DomHelper.insertBefore(element, '<div class="x-module-section">section '+i+'</div>');
				}
			}
		}
	}
});
