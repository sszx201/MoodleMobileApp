// require this script before your document is done loading
;(function () {
	var is_Droid = navigator.userAgent.match(/Android/);
	var is_iOS = navigator.userAgent.match(/(iPhone|iPod|iPad)/);
	var droidScripts = [
		"js/android/cordova.js",
		"js/android/extensions.js",
		"js/android/plugins/WebIntent.js",
		"js/android/plugins/ExtractZipFilePlugin.js",
	];
	var iosScripts = [
		"js/ios/cordova.js",
		"js/android/extensions.js",
	];

	var browserScripts = [
		"js/browser/extensions.js",
	];


	if(is_Droid) {
		droidScripts.forEach(loadScript)
	} else if(is_iOS) {
		iosScripts.forEach(loadScript)
	} else { // just a normal browser
		browserScripts.forEach(loadScript)
	}

	function loadScript(src) {
		var line = '<script type="text/javascript" charset="utf-8" src="' + src + '"></script>';
		document.writeln(line);
	}
})();
