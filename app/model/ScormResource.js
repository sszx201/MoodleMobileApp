Ext.define('MoodleMobApp.model.ScormResource', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
//            { name: 'identifier', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'href', type: 'string' },
            { name: 'src', type: 'string' }
        ]
    }
});
