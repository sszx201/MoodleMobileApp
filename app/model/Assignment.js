Ext.define('MoodleMobApp.model.Assignment', {
	extend: 'Ext.data.Model',

	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'course', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'intro', type: 'string' },
			{ name: 'introformat', type: 'int' },
			{ name: 'assignmenttype', type: 'string' },
			{ name: 'resubmit', type: 'int' },
			{ name: 'preventlate', type: 'int' },
			{ name: 'emailteachers', type: 'int' },
			{ name: 'var1', type: 'int' },
			{ name: 'var2', type: 'int' },
			{ name: 'var3', type: 'int' },
			{ name: 'var4', type: 'int' },
			{ name: 'var5', type: 'int' },
			{ name: 'maxbytes', type: 'int' },
			{ name: 'timedue', type: 'int' },
			{ name: 'timeavailable', type: 'int' },
			{ name: 'grade', type: 'int' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
