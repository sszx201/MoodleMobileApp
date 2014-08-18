Ext.define("MoodleMobApp.view.About", {
	extend: 'Ext.Component',
	xtype: 'about',

	config: {
		styleHtmlContent: true,
		cls: 'about',
		html:    '<div class="title">About the app</div>'
				+'<div class="content">'
				+'This is the mobile app for the platform iCorsi2. '
				+'It was developed by <a href="http://www.elearninglab.org">eLearning Lab USI</a>. '
				+'<br /><br />'
				+'Please help us improve the app.<br />Send us bug reports at <a href="mailto:helpdesk@elearninglab.org">helpdesk@elearninglab.org</a>'
				+'</div>'
				+'</div>'

				+'<div class="title">NOTE!</div>'
				+'<div class="content">'
				+'This app downloads contents from the iCorsi2 platform. '
				+'Please be aware that additional cost may be charged by your provider on the amount of the downloaded data. Check the contract with your provider for more information.'
				+'</div>'
				+'</div>'

				+'<br /><br />'
				+'<div class="content">'
				+'Keep up the good work! =)'
				+'</div>'
				+'</div>'
	}
});
