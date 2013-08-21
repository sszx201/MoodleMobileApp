Ext.define('MoodleMobApp.controller.ScormMetadataPanel', {
    extend: 'Ext.app.Controller',
    config: {
        requires: [
            'Supsi.Constants',
            'Supsi.Utils'
        ],
        refs: {
            metaExitBtn: 'metapanel button',
            scormToolbar: '#scormToolbar',
            metaPanel: '#metaPanel',
            metadataList: '#metadataList',
            scormPanel: 'scormpanel'
        },
        control: {
            metadataList: {
                itemtap: 'onListTap'
            },
            metaExitBtn: {
                tap: 'hideMetaPanel'
            }
        }
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