Ext.define('MoodleMobApp.store.Grades', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.Grade',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'grades',
		model: 'MoodleMobApp.model.Grade',
		proxy : {
			id: 'grade',
			type: 'localstorage'
		}
	}
});
