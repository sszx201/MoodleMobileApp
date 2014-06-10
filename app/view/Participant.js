Ext.define("MoodleMobApp.view.Participant", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'participant',

	config: {
		cls: 'participant',

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
						cls: 'x-participant-firstname'
					},
					{
						itemId: 'lastname',
						xtype: 'component',
						cls: 'x-participant-lastname'
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
				cls: 'x-participant-email'
			},
			{
				itemId: 'selection',
				xtype: 'checkboxfield',
				docked: 'right',
				cls: 'x-participant-select'
			},
			{
				itemId: 'networks',
				docked: 'bottom',
				xtype: 'component',
				cls: 'x-participant-networks'
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
		var networks = '';
		if(record.get('phone') != null && record.get('phone') != '') {
			networks += '<img src="resources/images/phone.png" />';
		} 
		if(record.get('skype') != null && record.get('skype') != '') {
			networks += '<img src="resources/images/skype.png" />';
		} 
		this.down('#networks').setHtml(networks);
	}
});

