Ext.define("MoodleMobApp.view.OfflineAssignment", {
	extend: 'Ext.form.Panel',
	xtype: 'offlineassignment',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
	],

	controllers: [ ],

	config: {
		id: 'offline_assignment_form',
		title: 'Offline Assignment',
		listeners: {
			initialize: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>'+ 
									'<div class="assignment-intro">'+ data.intro + '</div>';
				// inject html
				this.getItems().first().setHtml(intro_html);
				
			}	
		},
		items: [	
			{
				xtype: 'panel',	
				name: 'intro',
				html: '',
			},
		]
	}
});
