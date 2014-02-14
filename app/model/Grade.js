Ext.define('MoodleMobApp.model.Grade', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'itemid', type: 'int' },
			{ name: 'rawgrade', type: 'float' },
			{ name: 'rawgrademax', type: 'float' },
			{ name: 'rawgrademin', type: 'float' },
			{ name: 'finalgrade', type: 'float' },
			{ name: 'locked', type: 'int' }, // 1 if locked 0 if not
			{ name: 'hidden', type: 'int' }, // 1 if hidden 0 if not
			{ name: 'feedback', type: 'auto' },
			{ name: 'feedbackformat', type: 'int' },
			{ name: 'timecreated', type: 'int' },
			{ name: 'timemodified', type: 'int' }
		]
	}
});
