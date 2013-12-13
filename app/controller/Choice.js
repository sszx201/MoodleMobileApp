Ext.define('MoodleMobApp.controller.Choice', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Choice',
		],

		views: [
			'MoodleMobApp.view.Module',
			'MoodleMobApp.view.Choice',
		],

		refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			choice: 'choice',
			submitBtn: 'choice button[action=submit]',
		},

		control: {
			moduleList: { itemtap: 'selectModule' },
			submitBtn: { tap: 'submitChoice' },
		}
	},

	init: function() {
		Ext.cc = this;
		this.choice = '';
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'choice') {
			this.showChoices(record);
		}
	},

	showChoices: function(module) {
		// display choice
		if(typeof this.getChoice() == 'object') {
			this.getNavigator().push(this.getChoice());
		} else {
			this.getNavigator().push({ xtype: 'choice' });
		}
		
		// get choice data
		var pos = MoodleMobApp.Session.getChoicesStore().findExact('id', module.get('instanceid'));
		this.choice = MoodleMobApp.Session.getChoicesStore().getAt(pos);
			
		// set intro
		var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+ this.choice.get('name') +'</div>'+ 
							'<div class="choice-intro">'+ this.choice.get('intro') +'</div>';
		this.getChoice().getItems().getAt(0).setHtml(intro_html);

		// set the activity_status message
		var activity_status_html = '';

		if(this.choice.get('answer') > 0) {
			activity_status_html += '<div class="choice-status">'+'You already submitted an answer to this choice.'+'</div>';
		}
		this.getChoice().getItems().getAt(1).setHtml(activity_status_html);

		// set the options
		this.getChoice().getItems().getAt(2).removeAll();
		// add a hidden field containing the choice module instance id
		this.getChoice().getItems().getAt(2).add({
			xtype: 'hiddenfield',
			name : 'instanceid',
			value: this.choice.get('id')
		});
		// add the options
		var self = this;
		Ext.each(this.choice.get('options'), function(option){
			self.getChoice().getAt(2).add({
				xtype: 'radiofield',
				name : 'optionid',
				label: option.text,
				value: option.optionid,
				checked: self.choice.get('answer') == option.optionid ? true : false,
				labelWidth: '70%',
			});
		});
	},

	submitChoice: function(button) {
		var submission_data = this.getChoice().getValues();
		var token = MoodleMobApp.Session.getCourse().get('token');
		var submission_status_store = MoodleMobApp.WebService.submitChoice(submission_data, token);
		// refresh the discussion content
		submission_status_store.on(
			'load', 
			function(status_store) {
				if(status_store.first().get('subid') != null) {
					// set the answer
					this.choice.set('answer', status_store.first().get('subid'));
					MoodleMobApp.Session.getChoicesStore().sync();
					this.backToTheCourseModulesList();
				}
			},
			this,
			{single: true}
 		);
	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},
});
