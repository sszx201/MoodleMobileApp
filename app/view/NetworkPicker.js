Ext.define("MoodleMobApp.view.NetworkPicker", {
	extend: 'Ext.Panel',
	xtype: 'networkpicker',

	config: {
		cls: 'networkpicker',
		modal: true,
		centered: true,
		hideOnMaskTap: true,
		layout: 'vbox',
		width: '90%',
		maxWidth: 300,
		height: 300,
		skype: true,
		sms: true,
		phone: true,
		defaults: {
			flex: 1
		},
		items: [
			{
				xtype: 'toolbar',
				title: 'Pick the network',
				docked: 'top'
			},
			{
				xtype: 'container',
				layout: 'hbox',
				defaults: {
					flex: 1
				},
				items: [
					{
						xtype: 'button',
						itemId: 'skype',
						cls: 'skype',
						baseCls: 'network_selector'
					},
					{
						xtype: 'button',
						itemId: 'phone',
						cls: 'phone',
						baseCls: 'network_selector'
					}
				]
			},
			{
				xtype: 'container',
				layout: 'hbox',
				defaults: {
					flex: 1
				},
				items: [
					{
						xtype: 'button',
						itemId: 'sms',
						cls: 'sms',
						baseCls: 'network_selector'
					},
					{
						xtype: 'button',
						itemId: 'email',
						cls: 'email',
						baseCls: 'network_selector'
					}
				]
			}
		]
	},

	setSkype: function(visible) {
		this.skype = visible;
		if(visible) {
			this.down('#skype').show();
		} else {
			this.down('#skype').hide();
		}
	},

	getSkype: function(visible) {
		return this.skype;
	},

	setPhone: function(visible) {
		this.phone = visible;
		if(visible) {
			this.down('#phone').show();
		} else {
			this.down('#phone').hide();
		}
	},

	getPhone: function(visible) {
		return this.skype;
	},
	
	setSms: function(visible) {
		this.sms = visible;
		if(visible) {
			this.down('#sms').show();
		} else {
			this.down('#sms').hide();
		}
	},

	getSms: function(visible) {
		return this.sms;
	}
});
