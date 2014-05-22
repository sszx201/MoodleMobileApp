Ext.define('MoodleMobApp.FileSystem', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
  		return this;
	},

	config : { },

	access: function(successCallback, failCallback) {
		var self = this;
		window.requestFileSystem(
			LocalFileSystem.PERSISTENT, 0,
			function onFileSystemSuccess(fileSystem) {
				// get the filesystem
				fileSystem.root.getFile(
					'dummy.html', 
					{
						create: true,
						exclusive: false
					},
					function(fileEntry) {
						var sPath = fileEntry.toURL().replace("dummy.html","");
						sPath = sPath.replace("cdvfile://localhost/persistent/","");
						fileEntry.remove();
						successCallback(sPath, fileSystem);
					},
					function(error) {
						failCallback(error);
					}
				);
			},
			// file system error
			function(){
				Ext.Msg.alert(
					'File system error',
					'Cannot access the local filesystem.'
				);
			});
	},

	removeDirectory: function(dirPath, successCallback, failCallback) {
		var self = this;
		var gotPath = function(path, fileSystem) {
			fileSystem.root.getDirectory(
				path + dirPath,
				{
					create : true, 
					exclusive : false
				},
				function(entry) {
					entry.removeRecursively(successCallback, failCallback);
				}, 
				function() {
					Ext.Msg.alert(
						'File system error',
						'Cannot delete the iCorsi directory.'
					);
				});
		}
		// error callback: notify the error
		var error =  function(error) {
			Ext.Msg.alert(
				'File system error',
				'Directory does not exist yet: ' + dir 
			);
			failCallback(error);
		}
		this.access(gotPath, error);
	},

	getFile: function(uri, successCallback, failCallback) {
		var gotPath = function(path, fileSystem) {
			fileSystem.root.getFile(
				uri,
				{
					create : false, 
					exclusive : false
				},
				function(entry) {
					console.log('got the entry: ' + uri);
					successCallback(entry);
				}, 
				function(error) {
					console.log('NOPE:::no entries such as: ' + uri);
					failCallback(error);
				});
		}
		// error callback: notify the error
		var error =  function(error) {
			Ext.Msg.alert(
				'File system error',
				'File does not exist or is not accessible to the app: ' + uri 
			);
			failCallback(error);
		}
		this.access(gotPath, error);
	},

	resolveFilePath: function(uri, successCallback, failCallback) {
		window.resolveLocalFileSystemURL(
			uri,
			function(fileEntry) {
				fileEntry.file(
					successCallback,
					failCallback
				);
			},
			failCallback
		);	
	},

	selectFile: function(successCallback, failCallback) {
		var self = this;
		// the Android 4.4 has dropped the support for input tags of the
		// file type. This is a fix to make it work on Android 4.4.x platforms
		//if(window.device != undefined && window.platform == 'Android' && parseFloat(window.device.version) > 4.3 ) {
		if(window.device != undefined && window.device.platform == 'Android') {
			console.log('NOTE: selecting files with the fileChooser plugin');
			var _success = function(uri) {
				console.log('file chosen');
				MoodleMobApp.FileSystem.resolveFilePath(uri,
					function(file) {
						// set a better name instead of only 'content'.
						// hacky but it is only thing I can do here.
						if(file.name == 'content') {
							file.name = file.name + '_' + file.localURL.match(/([^\/]*)\/*$/)[1] + file.type.replace(/^.*\//g, '.');
						}
						successCallback(file);
					}
					,
					failCallback
				);
			}
			var _error = function(error) {
				Ext.Msg.alert(
					'File selecting error: code 1',
					'File cannot be selected: ' + uri 
				);
				MoodleMobApp.app.dump(error);
			}
			fileChooser.open(_success, _error);
		} else {
			console.log('NOTE: selecting files with the input tag');
			var input = document.createElement('input');
			input.type = 'file';
			input.onchange = function() {
				successCallback(this.files.item(0));
			};
			input.onerror = function(error) {
				Ext.Msg.alert(
					'File selecting error: code 2',
					'Cannot select the file. The app cannot read this file.' 
				);
				MoodleMobApp.app.dump(error);
				failCallback(error);
			}
			input.click();
		}	
	}
});
