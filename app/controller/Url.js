Ext.define('MoodleMobApp.controller.Url', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
        },
        control: {
			// generic controls
			module: { itemtap: 'selectModule' },
        }
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        
    },

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'url'){
			this.openUrl(record);
		}
	},

	openUrl: function(module){
		var entry = MoodleMobApp.Session.getUrlStore().findRecord('id', module.get('instanceid'));
		MoodleMobApp.app.openURL(entry.get('url'));
	}
});
