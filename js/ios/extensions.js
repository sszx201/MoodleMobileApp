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
		console.log('sending mail to ' + to);
		var mailto = 'mailto:'+to;
			/*
			mailto = mailto + '?subject=' + subject;
			mailto = mailto + '&body=' + body;
			*/
		window.open(mailto, '_system');
	};
	//////////////////////////////////////////////////////////////////////////
	// this function sends a sms to a list of users
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.sendSMS = function(to) {
		var smsto = 'sms:'+to;
		window.open(smsto, '_system');
	};
	//////////////////////////////////////////////////////////////////////////
	// this function starts skype conference with a number of users
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.startSkype = function(list) {
		//var skypeto = 'skype:'+list;
		var skypeto = 'skype:'+list+'?chat';
		console.log('skyping:::::' + skypeto);
		window.open(skypeto, '_system');
	};
	//////////////////////////////////////////////////////////////////////////
	// this function starts phone call
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.phone = function(num) {
		var phone = 'phone:'+num;
		window.open(phone, '_system');
	};

	//////////////////////////////////////////////////////////////////////////
	// this function opens a file by using the web intent mechanism
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.openFile = function(path, mimetype) {
		window.open(path, '_blank', 'location=yes,hidden=no,enableViewportScale=yes');
	};

	MoodleMobApp.app.calculateDownloadPercentage = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			return Math.round(progressEvent.loaded/progressEvent.total * 100);
		} else {
			return '...';
		}
	};
}
