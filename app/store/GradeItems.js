Ext.define('MoodleMobApp.store.GradeItems', {
	extend: 'Ext.data.Store',

	requires: [
		'MoodleMobApp.model.GradeItem',
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId: 'gradeitems',
		model: 'MoodleMobApp.model.GradeItem',
		proxy : {
			id: 'gradeitem',
			type: 'localstorage'
		}
	}
});
