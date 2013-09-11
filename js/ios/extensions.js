/* 
 * This file contains the extensions for the MoodleMobApp app.
 * 
 * All the functions added here are platform dependant.
 *
 * This file contains the android related functions.
 *
 */
function addExtensions() {
	//////////////////////////////////////////////////////////////////////////
	// this function opens a file by using the web intent mechanism
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.openFile = function(path, mimetype) {
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
						// success callback: remove the previous file
						function gotFileEntry(fileEntry) {
							var sPath = fileEntry.fullPath.replace("/dummy.html","");
							fileEntry.remove();
							console.log('opening file');
							console.log(sPath+path);
							window.open(sPath+path, '_blank', 'enableViewportScale=yes');
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Cannot write on the filesystem'
							);
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

	//////////////////////////////////////////////////////////////////////////
	// this function extracts a compressed zip archive 
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.unzip = function(path, successFunc, failFunc) {
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
						// success callback: remove the previous file
						function gotFileEntry(fileEntry) {
							var sPath = fileEntry.fullPath.replace("dummy.html","");
							fileEntry.remove();
							console.log('unzipping file');
							console.log(sPath+path);
							var win = function(json) {
			if (json.zipProgress) {
				// {"zipProgress":{"entryNumber":1,"source":"/path/to/test.zip","filename":"myfolder/myfile.png","entryTotal":10,"zip":false}}
				console.log((json.zipProgress.zip? "zip" : "unzip") + " entry " + json.zipProgress.entryNumber + "/" + json.zipProgress.entryTotal + " ("+ ((json.zipProgress.entryNumber/json.zipProgress.entryTotal)*100).toFixed(2) + "%)" );
		
			} else if (json.zipResult) {
				// zip ok, and done
				// {"zipResult":{"zip":false,"source":"/path/to/test.zip","target":"/path/to/targetfolder/"}}
		
				console.log((json.zipResult.zip? "zip" : "unzip") + " OK: " + JSON.stringify(json));
				successFunc(json.zipResult.target);
			}
		};
		
		// handles failure
		var fail = function(obj) {
			if (obj && obj.zipResult) {
				// zip failed, and done
				// {"zipResult":{"zip":false,"source":"/path/to/test.zip","target":"/path/to/targetfolder/"}}
				console.log((obj.zipResult.zip? "zip" : "unzip") + " FAIL: " + JSON.stringify(obj));
			} else {
				// general failure message
				console.log("FAIL: " + obj);
			}
		}

		var zu = cordova.require("cordova/plugin/ziputil");
		var source = sPath+path;
		var target = source.substring(0, source.lastIndexOf("/"));
		zu.unzip(win, fail, source, target);	
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Cannot write on the filesystem'
							);
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
}
