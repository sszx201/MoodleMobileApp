Ext.define("MoodleMobApp.view.Module", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'module',

	config: {
		cls: 'x-module',

		// map records to the DataItem
		items: [
			{
				itemId: 'name',
				xtype: 'component',
				cls: 'x-course-name',
			},
			{
				itemId: 'modname',
				xtype: 'component',
				cls: 'x-course-module-status',
			}
		]
	},

	updateRecord: function(record){
		this.down('#name').setHtml(record.get('name'));
		var classes = 'x-module';
			classes+= ' x-module-icon-'+record.get('modname'); 
			classes+= ' x-module-section-'+record.get('section'); 
		this.setCls(classes);

		if(record.get('isnew') == true) {
			var notification = record.get('modname');
			notification += ' | <span class="x-module-new">new</span>';
			this.down('#modname').setHtml(notification);
		} else {
			this.down('#modname').setHtml(record.get('modname'));
		}

		if(this.getRecord().get('isupdated') == true) {
			var notification = record.get('modname');
			notification += ' | <span class="x-module-updated">updated</span>';
			this.down('#modname').setHtml(notification);
		} else {
			this.down('#modname').setHtml(record.get('modname'));
		}
	},

});

