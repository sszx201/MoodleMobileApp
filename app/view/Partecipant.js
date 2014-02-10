Ext.define("MoodleMobApp.view.Partecipant", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'partecipant',

	config: {
		cls: 'partecipant',

		// map records to the DataItem
		items: [
			{
				xtype: 'container',
				items: [
					{
						itemId: 'avatar',
						xtype: 'image',
						height: 35,
						width: 35,
						docked: 'left',
						cls: 'x-avatar'
					},
					{
						itemId: 'firstname',
						xtype: 'component',
						cls: 'x-partecipant-firstname'
					},
					{
						itemId: 'lastname',
						xtype: 'component',
						cls: 'x-partecipant-lastname'
					}
				],
				layout: {
					type: 'hbox',
					align: 'center'
				}
			},
			{
				itemId: 'email',
				xtype: 'component',
				cls: 'x-partecipant-email'
			},
			{
				itemId: 'selection',
				xtype: 'checkboxfield',
				docked: 'right',
				cls: 'x-partecipant-select'
			}
		]
	},

	updateRecord: function(record) {
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#avatar').setSrc(record.get('avatar'));
		this.down('#firstname').setHtml(record.get('firstname'));
		this.down('#lastname').setHtml(record.get('lastname'));
		this.down('#email').setHtml(record.get('email'));
	}
});

