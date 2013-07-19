Ext.define("MoodleMobApp.view.Grade", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'grade',

	config: {
		cls: 'x-grade',

		items: [
			{
				itemId: 'itemname',
				xtype: 'component',
				cls: 'x-module-name',
			},
			{
				itemId: 'score',
				xtype: 'component',
				cls: 'x-module-score',
			},
			{
				itemId: 'modName',
				xtype: 'component',
				cls: 'x-module-modname',
			}

		]
		
	},

	updateRecord: function(record){
		this.down('#itemname').setHtml(record.get('itemname'));
		var classes = 'x-module';
			classes+= ' x-module-icon-'+record.get('itemmodule'); 
		this.setCls(classes);
		var userscore = '-';
		var index = MoodleMobApp.Session.getGradesStore().findExact('itemid', record.get('id'));
		if(index != -1) {
			var grade = MoodleMobApp.Session.getGradesStore().getAt(index);
			userscore = grade.get('rawgrade');
		}

		var pass_class = 'x-grade-is-not-passing-grade';
		if(userscore > record.get('gradepass')) {
			pass_class = 'x-grade-is-passing-grade';
		}

		var score = '<div class="x-grade-data">';
			score+= '<span class="x-grade-passed '+pass_class+'">';
			score+= userscore;
			score+= '</span>';
			score+= '/';
			score+= '<span class="x-grade-max">';
			score+= record.get('grademax');
			score+= '</span>';
			score+= '</div>';
		this.down('#score').setHtml(score);
		this.down('#modName').setHtml(record.get('itemmodule'));
	},
});

