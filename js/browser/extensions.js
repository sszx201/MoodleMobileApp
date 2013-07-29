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
		console.log('opening file path: ' + path);
		console.log('mimetype: ' + mimetype);
	};

	//////////////////////////////////////////////////////////////////////////
	// this function extracts a compressed zip archive 
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.unzip = function(filePath, successFunc, failFunc) {
		console.log('extracting file path: ' + filePath);
	};
}
