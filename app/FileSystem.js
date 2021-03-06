Ext.define('MoodleMobApp.FileSystem', {
	singleton : true,

	constructor: function(config) {
  		this.initConfig(config);
		// prevent the fileCacheDir to be backuped on iCloud
		if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
			var self = this;
			setTimeout(function() {
				self.access(
					function(fs) {
						fs.root.getDirectory(
							MoodleMobApp.Config.getFileCacheDir(),
							{
								create : true,
								exclusive : false
							},
							function(entry) {
								if(entry.isDirectory === true) {
									entry.setMetadata(
										function() { },
										function() {
											Ext.Msg.alert(
												'File system error',
												'Cannot disable the iCloud backup for the fileCache directory.'
											);
										},
										{ "com.apple.MobileBackup": 1}
									);
								} else {
									Ext.Msg.alert(
										'File system error',
										'Cannot create the fileCache directory and disable the iCloud backup.'
									);
								}
							},
							function() {
								Ext.Msg.alert(
									'File system error',
									'Cannot read the directory: ' + MoodleMobApp.Cache.getFileCacheDir()
								);
							}
						);
					},
					function() {
						Ext.Msg.alert(
							'File system error',
							'Cannot disable the iCloud backup on fileCache directory.'
						);
					}
				);
			}, 1000);
		}
  		return this;
	},

	config : { },

	isSupportedPlatform: function() {
		var is_Droid = navigator.userAgent.match(/Android/);
		var is_iOS = navigator.userAgent.match(/(iPhone|iPod|iPad)/);
		if(is_Droid || is_iOS) {
			return true;
		} else {
			return false;
		}
	},

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
						fileEntry.remove();
						successCallback(fileSystem);
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

	readDirectory: function(dirPath, successCallback, failCallback) {
		if(this.isSupportedPlatform()) {
			var self = this;
			var gotFS = function(fileSystem) {
				fileSystem.root.getDirectory(
					dirPath,
					{
						create : false,
						exclusive : false
					},
					function(entry) {
						if(entry.isDirectory === true) {
							var directoryReader = entry.createReader();
							directoryReader.readEntries(function(results) {
								successCallback(results);
							});
						} else {
							failCallback({message: 'No directory with path: ' + dirPath});
						}
					},
					function() {
						Ext.Msg.alert(
							'File system error',
							'Cannot read the directory: ' + dirPath
						);
					});
			}
			// error callback: notify the error
			var errorCallback =  function(error) {
				Ext.Msg.alert(
					'File system error',
					'Directory does not exist yet: ' + dirPath
				);
				failCallback(error);
			}
			this.access(gotFS, errorCallback);
		} else {
			console.log('FILESYSTEM: reading directory:' + dirPath);
		}
	},

	removeDirectory: function(dirPath, successCallback, failCallback) {
		if(this.isSupportedPlatform()) {
			var self = this;
			var gotFS = function(fileSystem) {
				fileSystem.root.getDirectory(
					dirPath,
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
							'Cannot delete the directory: ' + dirPath
						);
					});
			}
			// error callback: notify the error
			var errorCallback =  function(error) {
				Ext.Msg.alert(
					'File system error',
					'Directory does not exist yet: ' + dirPath
				);
				failCallback(error);
			}
			this.access(gotFS, errorCallback);
		} else {
			console.log('FILESYSTEM: removing directory:' + dirPath);
		}
	},

	getFile: function(uri, successCallback, failCallback) {
		if(this.isSupportedPlatform()) {
			var gotFS = function(fileSystem) {
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
						console.error('NOPE:::no entries such as: ' + uri, error);
						failCallback(error);
					});
			}
			// error callback: notify the error
			var errorCallback =  function(error) {
				Ext.Msg.alert(
					'File system error',
					'File does not exist or is not accessible to the app: ' + uri 
				);
				failCallback(error);
			}
			this.access(gotFS, errorCallback);
		} else {
			console.log('FILESYSTEM: getting file:' + uri);
		}
	},

	createFile: function(uri, successCallback, failCallback) {
		if(this.isSupportedPlatform()) {
			var gotFS = function(fileSystem) {
				fileSystem.root.getFile(
					uri,
					{
						create : true,
						exclusive : false
					},
					function(entry) {
						console.log('got the entry: ' + uri);
						successCallback(entry);
					},
					function(error) {
						console.error('NOPE:::no entries such as: ' + uri, error);
						failCallback(error);
					});
			}
			// error callback: notify the error
			var errorCallback =  function(error) {
				Ext.Msg.alert(
					'File system error',
					'Cannot create the file: ' + uri
				);
				failCallback(error);
			}
			this.access(gotFS, errorCallback);
		} else {
			console.log('FILESYSTEM: getting file:' + uri);
		}
	},

	removeFile: function(uri, successCallback, failCallback) {
		if(this.isSupportedPlatform()) {
			var gotFS = function(fileSystem) {
				fileSystem.root.getFile(
					uri,
					{
						create : false,
						exclusive : false
					},
					function(entry) {
						console.log('removing the entry: ' + uri);
						entry.remove(successCallback, failCallback);
					},
					function(error) {
						console.error('NOPE:::no entries such as: ' + uri, error);
						failCallback(error);
					});
			}
			// error callback: notify the error
			var errorCallback =  function(error) {
				Ext.Msg.alert(
					'File system error',
					'File does not exist or is not accessible to the app: ' + uri
				);
				failCallback(error);
			}
			this.access(gotFS, errorCallback);
		} else {
			console.log('FILESYSTEM: removing file:' + uri);
		}
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
		if(this.isSupportedPlatform()) {
			var self = this;
			// the Android 4.4 has dropped the support for input tags of the
			// file type. This is a fix to make it work on Android 4.4.x platforms
			//if(window.device != undefined && window.platform == 'Android' && parseFloat(window.device.version) > 4.3 ) {
			if(window.device != undefined && window.device.platform == 'Android') {
				console.log('NOTE: selecting files with the fileChooser plugin');
				var _success = function(uri) {
					console.log('file chosen: ' + uri);
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
					console.error('File cannot be selected, code 1: ' + uri, error);
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
					console.error('Cannot select the file. The app cannot read this file., code 2: ', error);
					failCallback(error);
				}
				input.click();
			}
		} else {
			console.log('FILESYSTEM: select file:');
		}
	}

});
