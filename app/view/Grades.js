Ext.define("MoodleMobApp.view.Grades", {
	extend: 'Ext.DataView',
	xtype: 'grades',

	config: {
		id: 'grades',
	   	title: 'Grades', 
		emptyText: 'No grades available.',
		useComponents: true,
		defaultType: 'grade',
		grouped: true
	}
});
