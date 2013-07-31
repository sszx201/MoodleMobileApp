localStorage.scormDocId = 'XGG003_DE/';

// todo: questo script deve essere fatto girare ogni volta che si cambia SCORM
Ext.define('Supsi.Constants', {
	singleton : true,

	constructor: function(config) {
		this.config.CLONED_BASE = '/sdcard/' + MoodleMobApp.Config.get('fileCacheDir') + '/__PRIVATE_SUPSI/' + this.config.DOC_ID;
		this.config.DOCS_BASE = 'data/scorm/';
		this.config.DATA_LOCATION = this.config.DOCS_BASE + this.config.DOC_ID + 'compendio/';
		this.config.TOC_LOCATION = this.config.DATA_LOCATION + 'whxdata/';
		this.config.RELATIVE_DOCS_LOCATION = 'LECD/Text/';
		this.config.DOCS_LOCATION = this.config.DOCS_BASE + this.config.DOC_ID + 'compendio/LECD/Text/';

		this.initConfig(config);
		return this;
	},

	config : {
		DOC_ID: localStorage.scormDocId,
		CLONED_BASE: '',
		DOCS_BASE: '',
		DATA_LOCATION: '',
		TOC_LOCATION: '',
		RELATIVE_DOCS_LOCATION: '',
		DOCS_LOCATION: ''
	}

});
