Ext.define('MoodleMobApp.controller.ScormSettings', {
	extend: 'Ext.app.Controller',
	config: {
		requires: [
			'Supsi.Constants',
			'Supsi.ScormPanel',
			'Supsi.Utils'
		],
		refs: {
			scormPanel: 'scormpanel',
			smallerFontBtn: '#smallerFontBtn',
			biggerFontBtn: '#biggerFontBtn'
		},
		control: {
			smallerFontBtn: {
				tap: 'reduceFont'
			},
			biggerFontBtn: {
				tap: 'increaseFont'
			}
		}
	},
	increaseFont: function(){
		var currentFontSize = Math.min(+(localStorage['ScormReaderFontSize'] || '1') +.1, 1.5);
		this.getScormPanel().setFontSize(currentFontSize);
		localStorage['ScormReaderFontSize'] = currentFontSize;
	},
	reduceFont: function(){
		var currentFontSize = Math.max(+(localStorage['ScormReaderFontSize'] || '1') -.1, .8);
		this.getScormPanel().setFontSize(currentFontSize);
		localStorage['ScormReaderFontSize'] = currentFontSize;
	}
});