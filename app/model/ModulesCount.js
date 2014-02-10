Ext.define('MoodleMobApp.model.ModulesCount', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			{
				name: 'courseid', type: 'int',
				name: 'modulescount', type: 'int'
			}
		]
	}
});
