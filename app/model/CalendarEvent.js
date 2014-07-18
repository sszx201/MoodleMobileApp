Ext.define('MoodleMobApp.model.CalendarEvent', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'description', type: 'string' },
			{ name: 'courseid', type: 'int' },
			{ name: 'groupid', type: 'int' },
			{ name: 'userid', type: 'int' },
			{ name: 'repeatid', type: 'int' },
			{ name: 'modulename', type: 'string' },
			{ name: 'instance', type: 'int' },
			{ name: 'eventtype', type: 'string' },
			{ name: 'timestart', type: 'int' },
			{ name: 'timeduration', type: 'int' }
		]
	}
});
