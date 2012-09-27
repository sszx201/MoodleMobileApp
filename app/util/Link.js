Ext.define('MoodleMobApp.util.Link', {


	config: {
		linkId: 'ux-util-link'
	},


	constructor: function(config) {
		this.initConfig(config);
		this.callParent([config]);
		this.addHelperLinkToBody();
	},


	/**
	 * Ad helper link to body
	 */
	addHelperLinkToBody: function() {
		if (!Ext.get(this.getLinkId())) {
			Ext.DomHelper.append(
				Ext.getBody(),
				{
					tag: 'a',
					style: 'display:none;',
					id: this.getLinkId(),
					target: '_blank'
				}
			);
		}
	},


	/**
	 * open link in a new window
	 *
	 * @param {} url
	 */
	openLinkInNewWindow: function(url) {
		var link = Ext.getDom(this.getLinkId()),
			clickevent = document.createEvent('Event');


		link.href = url;


		clickevent.initEvent('click', true, false);
		link.dispatchEvent(clickevent);
	}
});
