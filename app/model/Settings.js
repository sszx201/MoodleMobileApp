Ext.define('MoodleMobApp.model.Settings', {
	extend: 'Ext.data.Model',
	
	config: {
		identifier: 'uuid',
		fields: [
			{ name: 'usageagreement', type: 'boolean' },
			{ name: 'accounttype', type: 'string' },
			{ name: 'storeaccount', type: 'boolean' },
			{ name: 'justdownload', type: 'boolean'},
			{ name: 'showrecentactivity', type: 'boolean'},
			{ name: 'autohideappbar', type: 'boolean', defaultValue: true }
		]
	}
});
