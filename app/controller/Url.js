Ext.define('MoodleMobApp.controller.Url', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			recentActivity: 'recentactivitylist'
        },
        control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'url') {
						var url_record = MoodleMobApp.Session.getUrlStore().findRecord('id', record.get('instanceid'));
						if(url_record != undefined) {
							this.openUrl(url_record);
						}
					}
				}
			}
        }
    },
    
	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'url'){
			var entry = MoodleMobApp.Session.getUrlStore().findRecord('id', record.get('instanceid'));
			this.openUrl(entry);
		}
	},

	openUrl: function(record){
		MoodleMobApp.app.openURL(record.get('url'));
	}
});
