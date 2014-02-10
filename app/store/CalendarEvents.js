Ext.define('MoodleMobApp.store.CalendarEvents', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.CalendarEvent',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'calendarevents',
		model: 'MoodleMobApp.model.CalendarEvent',
		sorters: 'timestart',
		autoLoad: true,
		//autoSync: true,
		proxy : {
			id: 'calendarevent',
			type: 'localstorage'
		}
	}
});
