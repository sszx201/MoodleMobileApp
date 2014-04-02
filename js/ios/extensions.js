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
	MoodleMobApp.app.sendEmail = function(to, subject, body) {
		console.log('sending mail to ' + to);
		console.log('subject ' + subject);
		console.log('body ' + body);
		var mailto = 'mailto:'+to;
			mailto = mailto + '?subject=' + subject;
			mailto = mailto + '&body=' + body;
		window.open(mailto, '_system');
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
