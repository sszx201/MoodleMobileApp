Ext.define('MoodleMobApp.model.ScormMetadata', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
//            { name: 'identifier', type: 'string' },
            { name: 'data', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'href', type: 'string' },
            { name: 'index', type: 'integer' },
            { name: 'timestamp', type: 'integer' }
        ]
    }
});
