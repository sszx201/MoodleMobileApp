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
		var protocol = 'file:///';
		var store = 'sdcard'
		window.plugins.webintent.startActivity(
			{
				action: WebIntent.ACTION_VIEW,
				type: mimetype,
				url: protocol+store+path,
			},
			function () {},
			function () {
				Ext.Msg.alert('File Error', 'Failed to open:'+path+' via Android Intent');
			});
	};

	//////////////////////////////////////////////////////////////////////////
	// this function extracts a compressed zip archive 
	//////////////////////////////////////////////////////////////////////////
	MoodleMobApp.app.unzip = function(filePath, successFunc, failFunc) {
		// Implementend in a separated javascript file because depends on 
		// the external plugin. The plugin is platform related.	

		var ZipClient = new ExtractZipFilePlugin();
        ZipClient.extractFile('sdcard/'+filePath, successFunc, failFunc);
	};

	MoodleMobApp.app.onBackKeyDown = function(e) {
		var popOutput = MoodleMobApp.app.getController('Main').getMain().pop();
		if(popOutput == undefined) {
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
