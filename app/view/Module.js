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
			painted: function(){
				this.formatElement();
			},
		}
	},

	formatElement: function(){
		var classes = 'x-module';
			classes+= ' x-module-icon-'+this.getRecord().get('modname'); 
			classes+= ' x-module-section-'+this.getRecord().get('section'); 
		this.setCls(classes);

		if(this.getRecord().get('isnew') == true) {
			var notification = this.getRecord().get('modname');
			notification += ' | <span class="x-module-new">new</span>';
			this.getModName().setHtml(notification);
		}

		if(this.getRecord().get('isupdated') == true) {
			var notification = this.getRecord().get('modname');
			notification += ' | <span class="x-module-updated">updated</span>';
			this.getModName().setHtml(notification);
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

