Ext.define('MoodleMobApp.controller.Resource', {
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
					if(record.get('modname') == 'resource') {
						var resource_record = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'));
						console.log(resource_record.getData());
						if(resource_record != undefined) {
							this.getFile(resource_record);
						}
					}
				}
			}
        }
    },
    
	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'resource'){
			var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);
			this.getFile(resource);
		}
	},

	getFile: function(resource){
		if(resource.get('filemime').indexOf('html') !== -1) {
			MoodleMobApp.app.openURL(MoodleMobApp.Config.getResourceViewUrl()+'?id='+module.get('id'));
		} else {
			var file = {
				'name': resource.get('filename'),
				'fileid': resource.get('fileid'),
				'mime': resource.get('filemime')
			};
			MoodleMobApp.app.downloadFile(file);
		}
	}
});
