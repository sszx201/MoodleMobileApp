Ext.define('MoodleMobApp.controller.Resource', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			navigator: '#course_navigator',
			module: '#module_list',
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
		if(record.get('modname') === 'resource'){
			this.getFile(record);
		}
	},

	getFile: function(module){
		var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', module.get('instanceid'), 0, false, true, true);
		var file = {
			'name': resource.get('filename'),
			'fileid': resource.get('fileid'),
			'mime': resource.get('filemime'),
		};
		MoodleMobApp.app.downloadFile(file);
	}
});
