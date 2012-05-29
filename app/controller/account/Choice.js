Ext.define('iCorsi.controller.account.Choice', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			accountChoicePanel: '#accountchoice_panel',
			selectAaiButton: '#accountchoice_panel button[action=select_aai_account]',
			selectManualButton: '#accountchoice_panel button[action=select_manual_account]'
        },
        control: {
			accountChoicePanel: {
				show: 'showTheActiveAccount'	
			},
			selectAaiButton: {
				tap: 'showAaiAccountForm'
			},
			selectManualButton: {
				tap: 'showManualAccountForm'
			},
        }
    },

  	showTheActiveAccount: function() {
		// set user accounttype setting
		var settings_store = Ext.create('iCorsi.store.Settings'); 
		settings_store.load();
		if(settings_store.data.first().getData().accounttype === 'aai') {
			this.getAccountChoicePanel().setActiveItem(0);
			this.getSelectAaiButton().setBadgeText('active');
		} else if(settings_store.data.first().getData().accounttype === 'manual') {
			this.getAccountChoicePanel().setActiveItem(1);
			this.getSelectManualButton().setBadgeText('active');
		}
	},

	showAaiAccountForm: function() {
		this.getAccountChoicePanel().setActiveItem(0);
	},

	showManualAccountForm: function() {
		this.getAccountChoicePanel().setActiveItem(1);
	},

});
