Ext.define('MoodleMobApp.model.GradeItem', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{name: 'localid', type: 'auto'},
			{name: 'id', type: 'int'},
			{name: 'courseid', type: 'int'},
			{name: 'itemname', type: 'string'},
			{name: 'itemtype', type: 'string'},
			{name: 'itemmodule', type: 'string'},
			{name: 'iteminstance', type: 'int'},
			{name: 'itemnumber', type: 'int'},
			{name: 'gradepass', type: 'int'},
			{name: 'grademax', type: 'int'},
			{name: 'grademin', type: 'int'},
			{name: 'locked', type: 'int'}, // 1 if locked 0 if not
			{name: 'hidden', type: 'int'}, // 1 if hidden 0 if not
			{name: 'timemodified', type: 'int'},
			{name: 'isnew', type: 'boolean'},
			{name: 'isupdated', type: 'boolean'},
		]
	}
});
