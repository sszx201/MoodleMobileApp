Ext.define("MoodleMobApp.view.Module", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'module',

	config: {
		cls: 'x-module',
		autoDestroy: true,
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-course-name'
			},
			{
				itemId: 'modname',
				xtype: 'component',
				cls: 'x-course-module-status'
			}
		]
	},

	updateRecord: function(record){
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record != null) {
			this.down('#name').setHtml(record.get('name'));

			var classes = 'x-module';
			if(record.get('visible') == 0) {
				classes+= ' x-module-icon-'+record.get('modname')+'-gray';
				this.down('#modname').setHtml(record.get('modname') + ' <img src="resources/images/invisible.png"/>');
			} else {
				classes+= ' x-module-icon-'+record.get('modname');
				this.down('#modname').setHtml(record.get('modname'));
			}
			classes+= ' x-module-section-'+record.get('section');
			this.setCls(classes);
		} 
	}
});

