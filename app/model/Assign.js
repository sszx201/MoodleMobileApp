Ext.define('MoodleMobApp.model.Assign', {
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
			{ name: 'introformat', type: 'auto' },
			{ name: 'alwaysshowdescription', type: 'auto' },
			{ name: 'nosubmissions', type: 'int' },
			{ name: 'submissiondrafts', type: 'int' },
			{ name: 'sendnotifications', type: 'int' },
			{ name: 'sendlatenotifications', type: 'int' },
			{ name: 'duedate', type: 'int' },
			{ name: 'allowsubmissionsfromdate', type: 'int' },
			{ name: 'cutoffdate', type: 'int' },
			{ name: 'requiresubmissionstatement', type: 'int' },
			{ name: 'completionsubmit', type: 'int' },
			{ name: 'teamsubmission', type: 'int' },
			{ name: 'requireallteammemberssubmit', type: 'int' },
			{ name: 'teamsubmissiongroupingid', type: 'int' },
			{ name: 'blindmarking', type: 'int' },
			{ name: 'revealidentities', type: 'int' },
			{ name: 'grade', type: 'int' },
			{ name: 'plugconf', type: 'auto' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
