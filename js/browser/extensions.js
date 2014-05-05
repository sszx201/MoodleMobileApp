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
	// this function sends a mail to a list of users
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.sendEmail = function(to) {
		console.log('sending email to: ' + to);
	};
	//////////////////////////////////////////////////////////////////////////
	// this function sends a sms to a list of users
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.sendSms = function(to) {
		console.log('sending sms to: ' + to);
	};
	//////////////////////////////////////////////////////////////////////////
	// this function starts skype conference with a number of users
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.startSkype = function(to) {
		console.log('start skype with: ' + to);
	};
	//////////////////////////////////////////////////////////////////////////
	// this function starts phone call
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.phone = function(num) {
		console.log('tel:' + num);
	};
	//////////////////////////////////////////////////////////////////////////
	// this function opens a file by using the web intent mechanism
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.openFile = function(path, mimetype) {
		console.log('opening file path: ' + path);
		console.log('mimetype: ' + mimetype);
	};
	//////////////////////////////////////////////////////////////////////////
	// This function opens a url in the default browser app
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.openURL = function(urladdr) {
			console.log('===> Opening URL: '+urladdr);
			console.log('opening url '+urladdr);
			window.open(urladdr, '_blank', 'enableViewportScale=yes');
	};
	//////////////////////////////////////////////////////////////////////////
	// this function extracts a compressed zip archive 
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.unzip = function(filePath, successFunc, failFunc) {
		console.log('extracting file path: ' + filePath);
	};
}
