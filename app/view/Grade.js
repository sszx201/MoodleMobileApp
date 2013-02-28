Ext.define("MoodleMobApp.view.Grade", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'grade',

	config: {
		cls: 'x-grade',

		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'itemname'
			},

			getScore: {
				setHtml: ''
			},

			getModName: {
				setHtml: 'itemmodule'
			},
		},

		name: {
			cls: 'x-module-name',
		},

		score: {
			cls: 'x-grade-score',
		},

		modName: {
			cls: 'x-module-modname',
		},

		

		listeners: {
			painted: function(){
				this.formatElement();
			},
		}
	},

	formatElement: function(){
		var classes = 'x-module';
			classes+= ' x-module-icon-'+this.getRecord().get('itemmodule'); 
		this.setCls(classes);
		var userscore = '-';
		var index = MoodleMobApp.Session.getGradesStore().findExact('itemid', this.getRecord().get('id'));
		if(index != -1) {
			var grade = MoodleMobApp.Session.getGradesStore().getAt(index);
			userscore = grade.get('rawgrade');
		}

		var pass_class = 'x-grade-is-not-passing-grade';
		if(userscore > this.getRecord().get('gradepass')) {
			pass_class = 'x-grade-is-passing-grade';
		}

		var score = '<div class="x-grade-data">';
			score+= '<span class="x-grade-passed '+pass_class+'">';
			score+= userscore;
			score+= '</span>';
			score+= '/';
			score+= '<span class="x-grade-max">';
			score+= this.getRecord().get('grademax');
			score+= '</span>';
			score+= '</div>';
		this.getScore().setHtml(score);
		this.getModName().setHtml(this.getRecord().get('itemmodule'));
	},

	applyName: function(config) {
		return Ext.factory(config, Ext.Component, this.getName());
	},

	updateName: function(newName, oldName) {
		if (newName) {
			this.add(newName);
		}

		if (oldName) {
			this.remove(oldName);
		}
	},

	applyModName: function(config) {
		return Ext.factory(config, Ext.Component, this.getModName());
	},

	updateModName: function(newModName, oldModName) {
		if (newModName) {
			this.add(newModName);
		}

		if (oldModName) {
			this.remove(oldModName);
		}
	},

	applyScore: function(config) {
		return Ext.factory(config, Ext.Component, this.getScore());
	},

	updateScore: function(newScore, oldScore) {
		if (newScore) {
			this.add(newScore);
		}

		if (oldScore) {
			this.remove(oldScore);
		}
	},
});

