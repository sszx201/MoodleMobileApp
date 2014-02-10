localStorage.scormDocId = 'XGG003_DE/';

// todo: questo script deve essere fatto girare ogni volta che si cambia SCORM
define([], function(){

	var C = {}, sdid = localStorage.scormDocId;

	// locations
	C.DOC_ID = sdid;
	C.CLONED_BASE = '__PRIVATE_SUPSI/' + C.DOC_ID;
	C.DOCS_BASE = 'data/scorm/';
	C.DATA_LOCATION = C.DOCS_BASE + C.DOC_ID + 'compendio/'
	C.TOC_LOCATION = C.DATA_LOCATION + 'whxdata/';
	C.RELATIVE_DOCS_LOCATION = 'LECD/Text/';
	C.DOCS_LOCATION = C.DOCS_BASE + C.DOC_ID + 'compendio/LECD/Text/';



	// attributes
	C.SCORM_HIGHLIGHT_ATTRIBUTE = 'data-scorm-highlight';
	C.SCORM_ANNOTATION_ATTRIBUTE = 'data-scorm-annotation';



 	return C;
});