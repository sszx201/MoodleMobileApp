Ext.define('MoodleMobApp.controller.Scorm', {
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
		if(record.get('modname') === 'scorm'){
			var scormExtractedFileFlag = MoodleMobApp.Config.getFileCacheDir() + '/' + record.get('id') + '/_scorm_extracted_';
			var self = this;
			window.requestFileSystem(
				LocalFileSystem.PERSISTENT, 0,
				function onFileSystemSuccess(fileSystem) {
						// get the filesystem
						fileSystem.root.getFile(
							scormExtractedFileFlag, 
							{
								create: false,
								exclusive: false
							},
							function () {
								console.log('this scorm has already been extracted');
							},
							// error callback: notify the error
							function() {
								self.downloadArchive(record);
							}
						);
				},
				// error callback: notify the error
				function(){
					Ext.Msg.alert(
						'File system error',
						'Cannot access the local filesystem.'
					);
			});
		}
	},

	downloadArchive: function(module){
		var file = {
			'scormid': module.get('instanceid'),
			'name': module.get('id') + '.zip',
			'mime': 'application/zip',
		};

		// The archive is going to be named id.zip and is going to be stored in a directory named id
		// Example: 508/508.zip
		// Once extracted all the content is going to be contained in one directory.
		var dir = MoodleMobApp.Config.getFileCacheDir() + '/' + module.get('id'); 
		var scormExtractedFileFlag = dir + '/_scorm_extracted_';
		//this.showLoadMask('');
		// success function
		var downloadSuccessFunc = function(result) {
			//MoodleMobApp.app.hideLoadMask();
			var filePath = dir + '/' + file.name;
			var extractionSuccessFunc = function(status) {
					console.log('Success !!!!!!!!!!!!!!!!!');
					alert('Status: '+status);
					window.requestFileSystem(
						LocalFileSystem.PERSISTENT, 0,
						function onFileSystemSuccess(fileSystem) {
								// get the filesystem
								fileSystem.root.getFile(
									scormExtractedFileFlag, 
									{
										create: true,
										exclusive: false
									},
									function() {
										console.log('finalized the scorm');
									},
									function() {
										console.log('cannot finalize the scorm');
									}
								);
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Cannot access the local filesystem.'
							);
						});
			};        
			var extractionFailFunc = function(error) { 
					console.log('ERROR !!!!!!!!!!!!!!!!!');
					console.log(error);
			};
			// start the extraction
			MoodleMobApp.app.unzip(filePath, extractionSuccessFunc, extractionFailFunc);
		};

		// progress function
		var downloadProgressFunc = function(progressEvent){
			if (progressEvent.lengthComputable) {
				//MoodleMobApp.app.updateLoadMaskMessage(progressEvent.loaded+' bytes');
				console.log('downloaded : ' + progressEvent.loaded + ' bytes');
			} else {
				//this.hideLoadMask('');
				console.log('download complete');
			}
		};

		MoodleMobApp.WebService.getScorm(
			file,
			dir,
			downloadProgressFunc,
			downloadSuccessFunc,
			MoodleMobApp.Session.getCourse().get('token')
		);
	}
});
