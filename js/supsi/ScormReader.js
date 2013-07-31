Ext.define('Supsi.ScormReader', {
    extend: 'Ext.ux.slidenavigation.View',

    requires: [
        'Ext.Ajax'
//        'Ext.Button',
//        'Ext.Container',
//        'Ext.Function',
//        'Ext.Toolbar',
//        'Ext.data.Model',
//        'Ext.data.ModelManager',
//        'Ext.data.Store',
//        'Ext.dataview.List'
    ],

    xtype: 'scormreader',

    /**
     * @description Loads the given manifest
     * @param {String} manifest the manifest file
     * */
    loadManifest: function(manifest){
        Ext.Ajax.request({
            url: manifest,
            method: 'GET',
            scope: this,
            success: this.docLoaded

        });
    },
    docLoaded: function(data){
		console.log('***************** DOC LOADED ********************')
        var root = data.responseXML.documentElement;
        this.parseManifest(root);
    },
    parseManifest: function(root){
        var itemsNodes = root.querySelectorAll('organizations>organization>item'), i = 0, l = itemsNodes.length,
            items = [], item, attrs, itemNode, j = 0, ll
        ;
        for(; i < l; i++){
            items[i] = item = {};
            itemNode = itemsNodes[i];
            attrs = itemNode.attributes;
            for(j = 0, ll = attrs.length; j < ll; j++){
                item[attrs[j].name] = attrs[j].value;
            }
        }
        this.fireEvent('itemsUpdated', itemsNodes);
    },
    initialize: function(){
        this.callParent(arguments);
        console.log('SCORM Reader, initialization [ ok ]');
    }
});
