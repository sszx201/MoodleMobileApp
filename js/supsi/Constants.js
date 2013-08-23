localStorage.scormDocId = 'XGG003_DE/';

// todo: questo script deve essere fatto girare ogni volta che si cambia SCORM
Ext.define('Supsi.Constants', {
	singleton : true,

	constructor: function(config) {
		this.config.CLONED_BASE = '__PRIVATE_SUPSI/';
		this.config.DOCS_BASE = 'data/scorm/';
		// this.config.DATA_LOCATION = this.config.DOCS_BASE + this.config.DOC_ID + 'compendio/';
		this.config.DATA_LOCATION = 'compendio/';
		this.config.TOC_LOCATION = this.config.DATA_LOCATION + 'whxdata/';
		this.config.RELATIVE_DOCS_LOCATION = 'LECD/Text/';
		this.config.DOCS_LOCATION = 'compendio/LECD/Text/';

		this.config.SCORM_HIGHLIGHT_ATTRIBUTE = 'data-scorm-highlight';
		this.config.SCORM_ANNOTATION_ATTRIBUTE = 'data-scorm-annotation';

		this.initConfig(config);
		return this;
	},

	config : {
		BOOKMARK_ACTIVE_COLOR: 'red',
		SCORM_HIGHLIGHT_ATTRIBUTE: '',
		SCORM_ANNOTATION_ATTRIBUTE: '',
		DOC_ID: localStorage.scormDocId,
		CLONED_BASE: '',
		DOCS_BASE: '',
		DATA_LOCATION: '',
		TOC_LOCATION: '',
		RELATIVE_DOCS_LOCATION: '',
		DOCS_LOCATION: ''
	}

});
