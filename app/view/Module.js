Ext.define("MoodleMobApp.view.Module", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'module',

	config: {
		cls: 'x-module',

		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'name'
			},

			getModName: {
				setHtml: 'modname'
			},
		},

		name: {
			cls: 'x-module-name',
		},

		modName: {
			cls: 'x-module-modname',
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

});

