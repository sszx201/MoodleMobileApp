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
		console.log('record: ');
		console.log(record);
		if(record.get('modname') === 'resource'){
			var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);
			if(resource.get('filemime').indexOf('html') !== -1) {
				winref = MoodleMobApp.app.openMoodlePage(MoodleMobApp.Config.getResourceViewUrl()+'?id='+record.get('id'), record.get('display'));
			} else {
				this.getFile(resource);
			}
		}
	},

	getFile: function(resource){
		var file = {
			name: resource.get('filename'),
			fileid: resource.get('fileid'),
			mime: resource.get('filemime')
		};
		MoodleMobApp.app.downloadFile(file);
	}
});
