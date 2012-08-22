Ext.define("MoodleMobApp.view.ForumDiscussion", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'forumdiscussion',

	config: {
		cls: 'x-module',

		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'name'
			},
		},

		name: {
			cls: 'x-module-name',
		},

		layout: {
			type: 'hbox',
			align: 'center'
		},

		listeners: {
			updatedata: function(){ },
		}
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

});

