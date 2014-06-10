Ext.define("MoodleMobApp.view.FileSlot", {
	extend: 'Ext.Panel',
	xtype: 'fileslot',
	
	requires: [ ],
	
	config: {
		cls: 'fileslot',
		layout: 'hbox',
		clickToSelect: true,
		droppable: false,
		label: 'Tap to add the file',
		items: [
			{
				xtype: 'panel',
				itemId: 'filename',
				flex: 4,
				cls: 'fileslot-filename',
				listeners: {
					tap: {
						fn:function() {
							this.getParent().select();
						},
						element: 'element'
					}
				}
			},
			{
				xtype: 'button',
				itemId: 'dropbutton',
				text: 'Drop',
				ui: 'decline',
				flex: 1,
				margin: 10,
				listeners: {
					tap: function(self) {
						self.getParent().destroy();
					}
				}
			}
		]
	},

	setLabel: function(text) {
		this.label = text;
		this.down('#filename').setHtml(text);
	},

	getLabel: function() {
		return this.label;
	},

	setDroppable: function(value) {
		this.droppable = value;
		if(value == true) {
			this.down('#dropbutton').show();
		} else {
			this.down('#dropbutton').hide();
		}
	},

	getDroppable: function() {
		return this.droppable;
	},

	setClickToSelect: function(value) {
		this.clickToSelect = value;
		if(value == false) {
			this.select();
		}
	},

	getClickToSelect: function() {
		return this.clickToSelect;
	},

	select: function() {
		var self = this;
		MoodleMobApp.FileSystem.selectFile(
			function(file) {
				// MoodleMobApp.app.dump(file);
				self.setFile(file);
			},
			function(error) { });
	},

	setFile: function(file) {
		this.file = file;
		this.setLabel(file.name);
	},

	getFile: function() {
		return this.file;
	}
});
