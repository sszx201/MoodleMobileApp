Ext.define("MoodleMobApp.view.CalendarEvents", {
	extend: 'Ext.DataView',
	xtype: 'calendarevents',

	requires: [ 'MoodleMobApp.store.CalendarEvents' ],
	stores: [ 'MoodleMobApp.store.CalendarEvents' ],

	config: {
		id: 'calendarevents',
	   	title: 'Calendar Events', 
		store: 'calendar_events',
		emptyText: 'No events available.',
		useComponents: true,
		defaultType: 'calendarevent',	
	},
});
