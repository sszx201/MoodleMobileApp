Ext.define('MoodleMobApp.model.BookChapter', {
	extend: 'Ext.data.Model',
	
	config: {
		idProperty: 'localid',
		identifier: 'uuid',

		fields: [
			{ name: 'localid', type: 'auto' },
			{ name: 'id', type: 'int' },
			{ name: 'chapternumber', type: 'string', defaultValue: '' },
			{ name: 'index', type: 'int' },
			{ name: 'indentCls', type: 'string', defaultValue: '' },
			{ name: 'pagenum', type: 'int' },
			{ name: 'subchapter', type: 'int' },
			{ name: 'title', type: 'string' },
			{ name: 'content', type: 'string' }
		]
	}
});
