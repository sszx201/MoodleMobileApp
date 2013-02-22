Ext.define("MoodleMobApp.view.Partecipant", {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'partecipant',

	config: {
		cls: 'partecipant',

		// map records to the DataItem
		dataMap: {
			getImage: {
				setSrc: 'avatar'
			},

			getFirstname: {
				setHtml: 'firstname'
			},

			getLastname: {
				setHtml: 'lastname'
			},

			getEmail: {
				setHtml: 'email'
			},
		},

		image: {
			cls: 'x-avatar',
			height: 35,
			width: 35,
			docked: 'left',
		},

		firstname: {
			cls: 'x-partecipant-firstname',
		},
		
		lastname: {
			cls: 'x-partecipant-lastname',
		},

		email: {
			cls: 'x-partecipant-email',
			docked: 'bottom',
		},

		selection: {
			cls: 'x-partecipant-select',
			docked: 'right',
		},

		layout: {
            type: 'hbox',
            align: 'center'
        },

		listeners: {
			updatedata: function(){ },
		}
	},

	applyImage: function(config) {
		return Ext.factory(config, Ext.Img, this.getImage());
	},

	updateImage: function(newImage, oldImage) {
		if(newImage){
			this.add(newImage);
		}

		if(oldImage){
			this.remove(oldImage);
		}
	},

	applyFirstname: function(config) {
        return Ext.factory(config, Ext.Component, this.getFirstname());
    },

    updateFirstname: function(newFirstname, oldFirstname) {
        if (newFirstname) {
            this.add(newFirstname);
        }

        if (oldFirstname) {
            this.remove(oldFirstname);
        }
    },

	applyLastname: function(config) {
        return Ext.factory(config, Ext.Component, this.getLastname());
    },

    updateLastname: function(newLastname, oldLastname) {
        if (newLastname) {
            this.add(newLastname);
        }

        if (oldLastname) {
            this.remove(oldLastname);
        }
    },

	applyEmail: function(config) {
        return Ext.factory(config, Ext.Component, this.getEmail());
    },

    updateEmail: function(newEmail, oldEmail) {
        if (newEmail) {
            this.add(newEmail);
        }

        if (oldEmail) {
            this.remove(oldEmail);
        }
    },

	applySelection: function(config) {
        return Ext.factory(config, Ext.form.Checkbox, this.getSelection());
    },

    updateSelection: function(newSelection, oldSelection) {
        if (newSelection) {
            this.add(newSelection);
        }

        if (oldSelection) {
            this.remove(oldSelection);
        }
    },

});

