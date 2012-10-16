Ext.define("MoodleMobApp.view.ForumDiscussion", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumdiscussion',

	config: {
		cls: 'x-forum-discussion',

		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'name'
			},

			getStat: {
				setHtml: ''
			},
		},

		name: {
			cls: 'x-forum-discussion-name',
		},

		stat: {
			cls: 'x-forum-discussion-stat',
		},

		listeners: {
			painted: function(){
				this.formatElement();
			},
		}
	},

	formatElement: function(){
		var notification = '';

		if(this.getRecord().get('isnew') == true) {
			notification = ' <span class="x-module-new">new</span>';
		}

		if(this.getRecord().get('isupdated') == true) {
			notification = ' <span class="x-module-updated">updated</span>';
		}

		this.getStat().setHtml(notification);
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

	applyStat: function(config) {
		return Ext.factory(config, Ext.Component, this.getStat());
	},

	updateStat: function(newStat, oldStat) {
		if (newStat) {
			this.add(newStat);
		}

		if (oldStat) {
			this.remove(oldStat);
		}
	},

});

