Ext.define('MoodleMobApp.model.Choice', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'courseid', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'intro', type: 'string' },
			{ name: 'options', type: 'auto' },
			{ name: 'answer', type: 'int' },
			{ name: 'timemodified', type: 'int' },
			{ name: 'timeopen', type: 'int' },
			{ name: 'timeclose', type: 'int' },
			{ name: 'showresults', type: 'int' },
			{ name: 'allowupdate', type: 'int' },
			{ name: 'limitanswers', type: 'int' }
		]
	}
});
