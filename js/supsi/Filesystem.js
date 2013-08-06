//require(['js/supsi/Constants'], function(Constants){
;(function(){
	var
		isReady = false,
		cbacks = [],
		/**
		 * @private
		 * */
			existsCallback = function(evt){
		};
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

		getDirectory: function(directory){
			var dirs = directory.split('/'), dirName = '';
			for(var i = 0, l = dirs.length; i < l; i++){
				dirName += '/' + dirs[i];
				this.fileSystem.root.getDirectory(dirName, { create: true, exclusive: false });
			}
		},
		/**
		 * @arguments {String} path
		 * @arguments {boolean} create creates a new file if true
		 * @arguments {Function} success success callback
		 * @arguments {Function} failure failure callback
		 *
		 * */
		getFile: function(path, create, success, failure){
			console.log('[Filesystem] trying %s...', path);
			// var fullPath = Supsi.Constants.get('CLONED_BASE') + path;
			var fullPath = path;
			this.getDirectory(fullPath.substr(0, fullPath.lastIndexOf("/")));
//			console.log('directory creation ok ****************************')
			console.log('getFile path: ', path);
			this.fileSystem.root.getFile(path, {
				create: create,
				exclusive: false
			}, success, failure);
		},
		/**
		 * check the file existence
		 * @argument {File} the file to test
		 * @argument {Function} cback the callback function
		 * */
		exists: function(file, cback){
			var reader = new FileReader();
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
			console.log('getting ', Supsi.Constants.get('CLONED_BASE'));

			var dirs = Supsi.Constants.get('CLONED_BASE').split('/'), dirName = '';
			for(var i = 0, l = dirs.length; i < l; i++){
				dirName += '/' + dirs[i];
				fileSystem.root.getDirectory(dirName, { create: true, exclusive: false });
			}
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
			this.exists(Supsi.Constants.get('CLONED_BASE'), existsCallback);
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(){ that._fileSystemRequestSuccess.apply(that, arguments); }, this._fileSystemRequestError);
		}
	});
	
	//setTimeout(function() { Supsi.Filesystem.initialize(); }, 0);
})();

// Supsi.Filesystem.initialize();
//})
