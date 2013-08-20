Ext.define('Supsi.MetaPanel', {
    extend: 'Ext.Panel',
    xtype: 'metapanel',

	requires: [
		'Ext.List'
	],
    config: {
        items: [
            {
                padding: 10,
                width: 400,
                html: 'Search Panel here '

            }
        ]
    }
});
