//require(['js/supsi/Constants'], function(Constants){
;(function(){
	var isReady = false,
		cbacks = [],
		/**
		 * @private
		 * */
		existsCallback = function(evt){ };

	Ext.define('Supsi.Filesystem', {
		singleton: true,
		requires: [
			'Supsi.Constants'
		],
		fileSystem: null,

		constructor: function(config) {
			this.initConfig(config);
			return this;
		},

		createDirectory: function(dirName, callback) {
			this.fileSystem.root.getDirectory(
					dirName,
					{ create: true, exclusive: false },
					function(dir) {
						console.log('Directory created: %s ', dirName);
						console.log(dir);
						callback();
					},
					function(error) {
						console.log('ERROR: Directory could not be created: %s ', dirName);
						console.log(error);
					}
				);
		},

		getDirectory: function(directory, callback){
			var dirs = directory.split('/');
			var dirName = dirs.shift();
			console.log('creating directories: ');
			console.log(dirs);
			var self = this;
			// subdirectory created callback
			var dirCreated = function() {
				var newDir = dirs.shift();
				if(newDir != undefined) {
					dirName += '/' + newDir;
					self.createDirectory(dirName, dirCreated);
				} else {
					// final callback; last directory created
					callback();
				}
			}
			this.createDirectory(dirName, dirCreated);
		},
		/**
		 * @arguments {String} path
		 * @arguments {boolean} create creates a new file if true
		 * @arguments {Function} success success callback
		 * @arguments {Function} failure failure callback
		 *
		 * */
		getFile: function(path, create, success, failure){
			// var fullPath = Supsi.Constants.get('CLONED_BASE') + path;
			var fullPath = path.replace(/cdvfile:\/\/localhost\/persistent\//, '');
			var dirPath = fullPath.substr(0, fullPath.lastIndexOf("/"));
			console.log('[Filesystem] trying %s...', path);
			console.log('[Filesystem] filered to %s...', fullPath);
			console.log('-create- flag value: ' + create);
			var self = this;
			// attempt to create the final directory
			// otherwise create all the path from scratch
			this.fileSystem.root.getDirectory(
					dirPath,
					{ create: true, exclusive: false },
					function(dir) {
						console.log('Final directory created: %s ', dirPath);
						console.log('Getting the file: ' + fullPath);
						self.fileSystem.root.getFile(fullPath, { create: create, exclusive: false }, success, failure);
					},
					function(error) {
						console.log('NOTICE! Final directory does not exist; RECURSIVE CREATION: %s ', dirPath);
						self.getDirectory(dirPath, function() {
							console.log('Getting the file: ' + fullPath);
							self.fileSystem.root.getFile(fullPath, { create: create, exclusive: false }, success, failure);
						});
					}
				);
		},
		/**
		 * check the file existence
		 * @argument {File} the file to test
		 * @argument {Function} cback the callback function
		 * */
		exists: function(file, cback){
			var reader = new FileReader();
			console.log('testing file existence: ');
			console.log(file);
//			reader.addEventListener('loadend', cback);
//			console.log('testing...', cback)
			reader.onloadend = cback;
			reader.onerror = function(){
				console.log('file error');
			};
		},
		IOError: function(){
			console.error('[Supsi.Filesystem] IO error');
		},
		/**
		 * @arguments {Function} cback
		 * */
		ready: function(cback){
			console.log('callback: ');
			console.log(cback);
			if(isReady){
				cback();
			}else{
				cbacks.push(cback);
			}
		},
		getDirs: function(){

		},
		_fileSystemRequestSuccess: function(fileSystem){
			this.fileSystem = fileSystem;
			console.log('Filesystem obtained');
			/*
			console.log('getting ', Supsi.Constants.get('CLONED_BASE'));
			var dirs = Supsi.Constants.get('CLONED_BASE').split('/'), dirName = '';
			for(var i = 0, l = dirs.length; i < l; i++){
				dirName += '/' + dirs[i];
				fileSystem.root.getDirectory(dirName, { create: true, exclusive: false });
			}
			*/
			while(cbacks.length){
				cbacks.pop()();
			}
			isReady = true;
			
			console.log('Filesystem initialization ok');
		},
		_fileSystemRequestError: function(){
			console.error('Error obtaining the filesystem');
		},
		initialize: function(){
			var that = this;
			//this.exists(Supsi.Constants.get('CLONED_BASE'), existsCallback);
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(){ that._fileSystemRequestSuccess.apply(that, arguments); }, this._fileSystemRequestError);
		}
	});
	
	//setTimeout(function() { Supsi.Filesystem.initialize(); }, 0);
})();

// Supsi.Filesystem.initialize();
//})
