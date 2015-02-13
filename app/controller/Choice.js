Ext.define('MoodleMobApp.controller.Choice', {
	extend: 'Ext.app.Controller',

	config: {
		models: [
			'MoodleMobApp.model.Choice'
		],

		views: [
			'MoodleMobApp.view.Module',
			'MoodleMobApp.view.Choice'
		],

		refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			choice: 'choice',
			submitBtn: 'choice button[action=submit]',
			recentActivity: 'recentactivitylist'
		},

		control: {
			moduleList: { itemtap: 'selectModule' },
			submitBtn: { tap: 'submitChoice' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'choice') {
						var choice_record = MoodleMobApp.Session.getChoicesStore().findRecord('id', record.get('instanceid'), null, false, true, true);
						if(choice_record != undefined) {
							this.showChoice(choice_record);
						}
					}
				}
			}
		}
	},

	init: function() {
		Ext.cc = this;
		this.choice = '';
	},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'choice') {
			// get choice data
			this.showChoice(MoodleMobApp.Session.getChoicesStore().findRecord('id', record.get('instanceid'), null, false, true, true));
		}
	},

	showChoice: function(record) {
		this.choice = record;
		var show_options = true;

		// display choice
		if(typeof this.getChoice() == 'object') {
			this.getNavigator().push(this.getChoice());
		} else {
			this.getNavigator().push({ xtype: 'choice' });
		}


		// show choices results
		// 0 - don't show results
		// 1 - show results only after the user has answered
		// 2 - show results only after the choice has been closed
		// 3 - always show the results
		if(
			(this.choice.get('showresults') == 0) ||
			(this.choice.get('showresults') == 1 && this.choice.get('answer') == 0) ||
			(this.choice.get('showresults') == 2 && this.choice.get('timeclose') > Math.floor(Date.now() / 1000))
		) {
			this.getChoice().down('#statistics').hide();
		} else {
			this.showStats();
		}

		// set intro
		var intro_html = '<div class="x-form-fieldset-title x-docked-top">'+ this.choice.get('name') +'</div>'+ 
							'<div class="choice-intro">'+ this.choice.get('intro') +'</div>';
		this.getChoice().getItems().getAt(0).setHtml(intro_html);

		// set the activity_status message
		var activity_status_html = '';

		var now = Date.now() / 1000;

		if(this.choice.get('answer') > 0) {
			for(var i=0; i < this.choice.get('options').length; ++i) {
				if(this.choice.get('options')[i].optionid == this.choice.get('answer')) {
					activity_status_html += '<div class="choice-status">'+'Your answer: '+ this.choice.get('options')[i].text+'</div>';
					break;
				}
			}
		} else if(this.choice.get('timeopen') > now && this.choice.get('timeopen') > 0) {
			show_options = false;
			var date = MoodleMobApp.app.formatDate(this.choice.get('timeopen'));
			activity_status_html += '<div class="choice-status">This activity will be available on: '+date+'</div>';
		} else if(this.choice.get('timeclose') < now && this.choice.get('timeclose') > 0) {
			show_options = false;
			var date = MoodleMobApp.app.formatDate(this.choice.get('timeclose'));
			activity_status_html += '<div class="choice-status">This activity has been closed on: '+date+'</div>';
		}

		if(this.choice.get('allowupdate') == 0){
			if(this.choice.get('answer') > 0) {
				show_options = false;
				activity_status_html += '<div class="choice-status">Updating the answer is not allowed in this activity.</div>';
			}
		}

		this.getChoice().down('panel[name=status]').setHtml(activity_status_html);

		// set the options
		this.getChoice().down('fieldset').removeAll();
		if(show_options){
			// add a hidden field containing the choice module instance id
			this.getChoice().down('fieldset').add({
				xtype: 'hiddenfield',
				name : 'instanceid',
				value: this.choice.get('id')
			});
			// add the options
			var self = this;
			Ext.each(this.choice.get('options'), function(option){
				self.getChoice().down('fieldset').add({
					xtype: 'radiofield',
					name : 'optionid',
					label: option.text,
					value: option.optionid,
					checked: self.choice.get('answer') == option.optionid ? true : false,
					labelWidth: '70%'
				});
			});
			// hide the fieldset
			this.getChoice().down('fieldset').show();
			// hide the submit button
			this.getChoice().down('button').show();
		} else {
			// show the fieldset
			this.getChoice().down('fieldset').hide();
			// show the submit button
			this.getChoice().down('button').hide();
		}
	},

	submitChoice: function(button) {
		if(MoodleMobApp.app.isConnectionAvailable()) {
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
						this.updateChoiceData();
						this.backToTheCourseModulesList();
					}
				},
				this,
				{single: true}
			);
		}
	},

	backToTheCourseModulesList: function() {
		// remove the view from the navigator
		this.getNavigator().pop();
	},

	showStats: function() {
		// prepare data
		var options = [];
		Ext.each(this.choice.get('options'), function(option){
			options.push([option.text, option.answers]);
		});
		this.getChoice().down('#statistics').show();
		// show data
		$('#choice_stats').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: true
			},
			credits: { enabled: false },
			title: {
				text: '&nbsp;',
				useHTML: true
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: false,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Answers',
				data: options
			}]
		});
	},

	updateChoiceData: function() {
		var token = MoodleMobApp.Session.getCourse().get('token');
		var updated_choice_data_store = MoodleMobApp.WebService.getChoice({instanceid: this.choice.get('id')}, token);
			updated_choice_data_store.on(
				'load',
				function(store, records){
					if(store.first().raw.exception == undefined) {
						var rec = store.first();
						this.choice.set('name', rec.get('name'));
						this.choice.set('intro', rec.get('intro'));
						this.choice.set('options', rec.get('options'));
						this.choice.set('answer', rec.get('answer'));
						this.choice.set('timemodified', rec.get('timemodified'));
						this.choice.set('timeopen', rec.get('timeopen'));
						this.choice.set('timeclose', rec.get('timeclose'));
						this.choice.set('showresults', rec.get('showresults'));
						this.choice.set('allowupdate', rec.get('allowupdate'));
						this.choice.set('limitanswers', rec.get('limitanswers'));
						MoodleMobApp.Session.getChoicesStore().sync();
					} else {
						Ext.Msg.alert(
							store.first().raw.exception,
							store.first().raw.message
						);
					}
				},
				this,
				{single: true}
			);
	}
});
