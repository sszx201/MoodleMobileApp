require([
//	'../../../../../js/supsi/TouchHandler.js',
//	'../../../../../js/supsi/SelectionHandler.js'
	localStorage['filesystemOrigin'] + 'extensions/supsi/EventHandler.js',
	localStorage['filesystemOrigin'] + 'extensions/supsi/SelectionHandler.js'
], function(ScrollHandler, SelectionHandler){
	window.__selectionHandler = SelectionHandler;
});
