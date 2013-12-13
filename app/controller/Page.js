Ext.define('MoodleMobApp.controller.Page', {
    extend: 'Ext.app.Controller',
    
    config: {
		views: [
			'MoodleMobApp.view.Page',
		],

        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			page: 'page',
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
		if(record.get('modname') === 'page'){
			if(typeof this.getPage() == 'object') {
				this.getPage().destroy(); // if the previous instance is still there remove it
			}
			var page = MoodleMobApp.Session.getPageStore().findRecord('id', record.get('instanceid'));
			this.getNavigator().push({
				xtype: 'page',
				record: page,
			});
		}
	},
});
