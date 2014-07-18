Ext.define("MoodleMobApp.view.CalendarEvent", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'calendarevent',

	config: {
		cls: 'x-calendar-event',
		// map records to the DataItem
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-calendar-event-name'
			},
			{
				itemId: 'timestart',
				xtype: 'component',
				cls: 'x-calendar-event-timestart'
			},
			{
				itemId: 'timeduration',
				xtype: 'component',
				cls: 'x-calendar-event-timeduration'
			},
			{
				itemId: 'description',
				xtype: 'component',
				cls: 'x-calendar-event-description',
				hidden: true
			}
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		this.down('#name').setHtml(record.get('name'));
		this.down('#description').setHtml(record.get('description'));
		// set the dates and duration
		if(record == null) { return; } 
		if(record.get('timeduration') > 0) {
			this.down('#timestart').setHtml('Starts on: ' + MoodleMobApp.app.formatDate(record.get('timestart')));
			var seconds = record.get('timeduration'); 
			var days = Math.floor(seconds / 86400);
			var hours = Math.floor((seconds % 86400) / 3600);
			var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
			var duration = 'Duration: ' + days + ' days; ' + hours + ' hours; ' + minutes + ' minutes; ';
			this.down('#timeduration').setHtml(duration);
		} else {
			this.down('#timestart').setHtml(MoodleMobApp.app.formatDate(record.get('timestart')));
		}
	}
});

