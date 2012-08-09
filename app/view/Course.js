Ext.define("MoodleMobApp.view.Course", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'course',

	config: {
		cls: 'x-course',
		// map records to the DataItem
		dataMap: {
			getName: {
				setHtml: 'name'
			},

			getModuleStatus: {
				setHtml: 'modulestatus'
			},
		},

		name: {
			cls: 'x-course-name',
		},

		moduleStatus: {
			cls: 'x-course-module-status',
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

	applyModuleStatus: function(config) {
		return Ext.factory(config, Ext.Component, this.getModuleStatus());
	},

	updateModuleStatus: function(newModuleStatus, oldModuleStatus) {
		if (newModuleStatus) {
			this.add(newModuleStatus);
		}

		if (oldModuleStatus) {
			this.remove(oldModuleStatus);
		}
	},

});

