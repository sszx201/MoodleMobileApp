Ext.define('MoodleMobApp.model.ScormMetadata', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'data', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'href', type: 'string' },
            { name: 'index', type: 'integer' },
            { name: 'timestamp', type: 'integer' }
        ]
    }
});
