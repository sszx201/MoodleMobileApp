Ext.define('MoodleMobApp.controller.ScormMetadataPanel', {
    extend: 'Ext.app.Controller',
    config: {
        requires: [
            'Supsi.Constants',
            'Supsi.Utils',
			'Ext.util.Filter'
        ],
        refs: {
            metaExitBtn: '#exitMetaBtn',
            scormToolbar: '#scormToolbar',
            metaPanel: '#metaPanel',
            metadataList: '#metadataList',
			notesFilterBtn: '#notesFilterBtn',
			clearNotesFilterBtn: '#clearNotesFilterBtn',
			notesFilterField: '#notesFilterField',
            scormPanel: 'scormpanel'
        },
        control: {
			clearNotesFilterBtn: {
				tap: 'clearNotesFilter'
			},
			notesFilterBtn: {
				tap: 'applyNotesFilter'
			},
            metadataList: {
                itemtap: 'onListTap'
            },
            metaExitBtn: {
                tap: 'hideMetaPanel'
            }
        }
    },

	/**
	 * clear the note filter
	 * */
	clearNotesFilter: function(){
		this.getNotesFilterField().setValue('');
		this.getMetadataList().getStore().clearFilter();
	},

	/**
	 * apply the text filter on the metadata list (notes only)
	 * */
	applyNotesFilter: function(){
		var metaList = this.getMetadataList(), store = metaList.getStore();
		var value = this.getNotesFilterField().getValue();
		store.clearFilter();
		value && store.filterBy(function(item){
				return (item.data['fragment'].indexOf(value) != -1 || item.data['data'].indexOf(value) != -1)
			}
		);
		store.sync();
	},
    /**
     * hide the metadata panel
     * */
    hideMetaPanel: function(){
        this.getMetaPanel().hide();
        this.getScormToolbar().show();
    },
    onListTap: function(dataview, index, target, record, el, options){
            // standard
            if(record.get('href')){
                this.getScormPanel().setURI(record.get('href'));
            }
            this.hideMetaPanel();
    }
});