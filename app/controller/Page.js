Ext.define('MoodleMobApp.controller.Page', {
    extend: 'Ext.app.Controller',
    
    config: {
		views: [
			'MoodleMobApp.view.Page'
		],

        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			page: 'page',
			recentActivity: 'recentactivitylist'
        },
        control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'page') {
						var page_record = MoodleMobApp.Session.getPagesStore().findRecord('id', record.get('instanceid'));
						if(page_record != undefined) {
							this.showPage(page_record);
						}
					}
				}
			}
        }
    },
    
	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'page'){
			this.showPage(MoodleMobApp.Session.getPagesStore().findRecord('id', record.get('instanceid')));
		}
	},

	showPage: function(page) {
		if(typeof this.getPage() == 'object') {
			this.getPage().destroy(); // if the previous instance is still there remove it
		}
		this.getNavigator().push({
			xtype: 'page',
			record: page
		});
	}
});
