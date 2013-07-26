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
		// this function is called also when a DataItem is destroyed or the record is removed from the store
		// the check bellow avoids the running of the function when it is null
		if(record == null) { return; } 

		this.down('#itemname').setHtml(record.get('itemname'));
		var classes = 'x-module';
			classes+= ' x-module-icon-'+record.get('itemmodule'); 
		this.setCls(classes);
		var userscore = '-';
		var user_grade = MoodleMobApp.Session.getGradesStore().findRecord('itemid', record.get('id'), null, false, true, true);
		if(user_grade != null) {
			console.log(record.getData());
			console.log(user_grade.getData());
			if(record.get('scaleid') > 0) {
				var scale = record.get('scale').split(',');
				userscore = scale[user_grade.get('finalgrade') - 1];
			} else {
				userscore = user_grade.get('finalgrade');
			}
		}

		var pass_class = 'x-grade-is-not-passing-grade';
		if(userscore > record.get('gradepass')) {
			pass_class = 'x-grade-is-passing-grade';
		}

		var score = '<div class="x-grade-data">';
			score+= '<span class="x-grade-passed '+pass_class+'">';
			score+= userscore;
			score+= '</span>';
			if(record.get('scaleid') == 0) {
				score+= '/';
				score+= '<span class="x-grade-max">';
				score+= record.get('grademax');
				score+= '</span>';
			}
			score+= '</div>';
		this.down('#score').setHtml(score);
		this.down('#modName').setHtml(record.get('itemmodule'));
	},
});

