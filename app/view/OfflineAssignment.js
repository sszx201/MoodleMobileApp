Ext.define("MoodleMobApp.view.OfflineAssignment", {
	extend: 'Ext.Panel',
	xtype: 'offlineassignment',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar'
	],

	controllers: [ ],

	config: {
		title: 'Offline Assignment',
		cls: 'assignment',
		autoDestroy: true,
		listeners: {
			initialize: function() {
				// check the data
				var today = new Date();
				var duedate = new Date(this.config.settings.timedue * 1000);
				var availabledate = new Date(this.config.settings.timeavailable * 1000);
				if(today > duedate) {
					this.child('panel[name=toolate]').show();
					return;
				}

				if(today < availabledate) {
					this.child('panel[name=toosoon]').show();
					return;
				}
			},
			show: function(){
				// display the parent post
				var data = this.getRecord().getData();
				// prepare the html
				var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+data.name+'</div>';
					intro_html+= '<div class="intro">'+ data.intro + '</div>';
					intro_html+= '<div class="dates">';
					intro_html+= '<div class="date">Available from date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.timeavailable) + '</div>';
					intro_html+= '<div class="date">Deadline date: </br>'+ MoodleMobApp.app.formatDate(this.config.settings.timedue) + '</div>';
					intro_html+= '</div>';

				// display the intro
				this.child('panel[name=intro]').setHtml(intro_html);
			}	
		},
		items: [	
			{
				xtype: 'panel',	
				name: 'intro',
				html: ''
			},
			{
				xtype: 'panel',
				name: 'toosoon',
				cls: 'toosoon',
				docked: 'top',
				hidden: true,
				html: 'This assignment has not been opened yet.'
			},
			{
				xtype: 'panel',
				name: 'toolate',
				cls: 'toolate',
				docked: 'top',
				hidden: true,
				html: 'This assignment has been closed.'
			}
		]
	}
});
