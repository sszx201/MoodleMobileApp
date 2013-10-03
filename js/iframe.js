require([
//	'../../../../../js/supsi/TouchHandler.js',
//	'../../../../../js/supsi/SelectionHandler.js'
	localStorage['filesystemOrigin'] + 'js/supsi/EventHandler.js',
	localStorage['filesystemOrigin'] + 'js/supsi/SelectionHandler.js'
], function(ScrollHandler, SelectionHandler){
	window.__selectionHandler = SelectionHandler;
});