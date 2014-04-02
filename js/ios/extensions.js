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
							var sPath = fileEntry.toURL().replace("/dummy.html","");
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

	MoodleMobApp.app.calculateDownloadPercentage = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			return Math.round(progressEvent.loaded/progressEvent.total * 100);
		} else {
			return '...';
		}
	};
}
