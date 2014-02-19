Ext.define("MoodleMobApp.view.Page", {
	extend: 'Ext.Panel',
	xtype: 'page',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar'
	],
	
	config: {
		id: 'page',
		cls: 'page',
		title: 'Page',
		scrollable: 'vertical',
		items: [
			{
				xtype: 'panel',	
				name: 'name',
				cls: 'name',
				html: ''
			},
			{
				xtype: 'panel',	
				name: 'intro',
				cls: 'intro',
				html: ''
			},
			{
				xtype: 'panel',	
				name: 'content',
				cls: 'content',
				styleHtmlContent: true,
				html: ''
			}
		],
		listeners: {
			initialize: function() {
				this.child('panel[name=name]').setHtml(this.getRecord().get('name'));
				this.child('panel[name=intro]').setHtml(this.getRecord().get('intro'));
				this.child('panel[name=content]').setHtml(this.getRecord().get('content'));
			}
		}
	}
});
