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
		var token = MoodleMobApp.Session.getCourse().get('token');
		var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', module.get('instanceid'));

		var callBackFunc = function() {
			var filePath = '/'+MoodleMobApp.Config.getFileCacheDir()+'/'+resource.get('filename');
			MoodleMobApp.app.openFile(filePath, resource.get('filemime'));
		};

		var file = {
			'name': resource.get('filename'),
			'fileid': resource.get('fileid')
		};

		MoodleMobApp.WebService.getFile(file, MoodleMobApp.Config.getFileCacheDir(), callBackFunc, token);
	}
});
