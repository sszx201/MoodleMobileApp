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
	/*
	MoodleMobApp.app.sendEmail = function(to, subject, body) {
		var extras = {};
		extras[WebIntent.EXTRA_SUBJECT] = subject;
		extras[WebIntent.EXTRA_TEXT] = body;
		var successFunc = function() {};
		// fail function
		var failFunc = function(){
			Ext.Msg.alert(
				'Sending e-mail error',
				'Failed to open the mail client and send a mail to: ' + to
			);
		};

		window.plugins.webintent.startActivity(
			{
				action: window.plugins.webintent.ACTION_SEND,
				//url: 'mailto:' + to,
				url: to,
				type: 'text/plain',
				extras: extras
			},
			successFunc,
			failFunc
		);
	};
	*/

	//////////////////////////////////////////////////////////////////////////
	// this function opens a file by using the web intent mechanism
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.openFile = function(path, mimetype) {
		window.plugins.webintent.startActivity(
			{
				action: window.plugins.webintent.ACTION_VIEW,
				type: mimetype,
				url: path
			},
			function () {},
			function () {
				Ext.Msg.alert('File Error', 'Failed to open:'+path+' via Android Intent');
			});
	};

	openURLinExternalBrowser = function(urladdr){
		if(MoodleMobApp.Config.getVerbose()) {
			console.log('===> Opening URL: '+urladdr);
		}

		window.plugins.webintent.startActivity(
			{
				action: window.plugins.webintent.ACTION_VIEW,
				url: urladdr
			},
			function () {},
			function () {
				Ext.Msg.alert('URL Error', 'Failed to open:'+path+' via Android Intent');
			});
	};

	MoodleMobApp.app.calculateDownloadPercentage = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			return Math.round(progressEvent.loaded/progressEvent.total * 100);
		} else {
			return '...';
		}
	};

	MoodleMobApp.app.onBackKeyDown = function(e) {
		if( MoodleMobApp.app.getController('Main').getNavigator() == undefined || MoodleMobApp.app.getController('Main').getNavigator().pop() == undefined) {
			navigator.app.exitApp();
			/*
			Ext.Msg.confirm(
				Ux.locale.Manager.get('title.exit'),
				Ux.locale.Manager.get('message.confirmExit'),
				function(btn) {
					if(btn == 'yes') {
						navigator.app.exitApp();
					}
				}
			);
			*/
		}
		e.preventDefault();
	};

	document.addEventListener("backbutton", Ext.bind(MoodleMobApp.app.onBackKeyDown, this), false);
}
