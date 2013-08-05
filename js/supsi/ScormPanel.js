//require(['js/supsi/Constants', 'js/supsi/utils'], function(Constants, utils){
	Ext.define('Supsi.ScormPanel', {
		extend: 'Ext.Component',

		requires: [
			'Ext.MessageBox',
			'Supsi.Constants',
			'Supsi.Utils',
			'Supsi.Filesystem',
			'Ext.Toolbar'
		],

		xtype: 'scormpanel',
		mbox: null,
		noteView: null,
		searchView: null,
		_currentAnnotationNode: null,
		_annotationsNodes: [],
		_currentFileEntry: null,
		SCORMId: '',
		resourceId: '',
		template: [
			{
				tag: 'div',
				className: Ext.baseCSSPrefix + 'scorm-cover',
				reference: 'cover'
			},
			{
				tag:'div',
				reference: 'wrapperRef',
				className: Ext.baseCSSPrefix + 'scorm-wrapper',
				children: [
					{
						tag: 'iframe',
						src: '',
						className: Ext.baseCSSPrefix + 'scorm-panel',
						reference: 'docContainer'
					}
				]
			}
		],
		wrapperRef: null,
		docContainer: null,
		showAnnotationDialog: function(){
			this.mbox.show();
		},
		showNoteView: function(node){
			this._currentAnnotationNode = node;
			this.noteView.show();
		},
		/**
		 * get the selection range from the iframe
		 * */
		getSelectionRange: function(){
			return this.docContainer.dom.contentWindow.__selectionHandler.selectedRange;
	//        return this.docContainer.dom.contentWindow.getSelection().getRangeAt(0)
		},
		/**
		 * get the DOM index of this highlightNode
		 * */
		getHighlightIndex: function(highlightNode){
			var hNodes = this.docContainer.dom.contentDocument.querySelectorAll('[' + Supsi.Constants.get('SCORM_HIGHLIGHT_ATTRIBUTE') + ']');
			return Array.prototype.indexOf.call(hNodes, highlightNode)
		},
		getSelection: function(){
			// surroundContents will be useful
			// ah, appunto in ita: trovare un modo per farsi dare inizio e fine del range espressi come numero di caratteri
			// dall'inizio del documento (una volta trovato l'inizio, per la fine basta sommare il numero di caratteri nel
			// range). Infine fare una surroundContents e mostrare all'utente sempre il documento modificato.
			// le selezioni preesistenti non creano problemi, visto che non aggiungono testo, quindi gli indici saranno
			// invariati. Attenzione poi a gestire le intersezioni: cemome in iBooks, non possono esserci, quindi la nota
			// sottostante viene modificata in caso di re-annotazione
			// controllare il caso limite in cui viene spezzato un link: mi aspetto che surroundContents si occupi di tutto.
			// Il problema eventualmente nasce quando si deve rimuovere la annotazione, ma forse invece di fondere a mano
			// i nodi risultanti, potrei semplicemente recuperare il documento originario e sostituire in qualche modo
			// quella parte di documento (che pero' risulta davvero difficile, usando DOM). Forse conviene fare una replace
			// di stringhe e rimpiazzare l'intero innerHTML. Grezzo ma efficace.
			// alert(this.docContainer.dom.contentWindow.getSelection().getRangeAt(0).toString());
			return this.docContainer.dom.contentWindow.document.getSelection().toString()
		},
		onAnnotation: function(id, text){
			switch(id){
				case 'ok':
					this.fireEvent('annotationend', text);
					break;
				default:
					break;
			}
		},
		onSearch: function(id, text){
			if(id === 'ok'){
				this.fireEvent('searchtext', text);
			}
		},
		showSearchDialog: function(){
			this.searchView.show();
//			var that = this;
//			Ext.Msg.prompt('[i18n] Find', '', function(id, text){
//				that.onSearch(id, text);
//			});
		},
		searchText: function(text){
			var startContainer, nodeToSelect, doc = this.docContainer.dom.contentDocument, win = this.docContainer.dom.contentWindow,
				prevResults = doc.querySelectorAll('.scorm_search_result')
				;
			for(var i = 0, l = prevResults.length; i < l; i++){
				prevResults[i].classList.remove('scorm_search_result');
			}
			if(win.find(text, false, false, true, true, false, true)){
				if(win.getSelection().rangeCount){
					startContainer = win.getSelection().getRangeAt(0).startContainer;

					// 3 is a text node
					nodeToSelect = startContainer.nodeType === 3 ? startContainer.parentNode : startContainer;
					nodeToSelect.classList.add('scorm_search_result');
				}
			}
		},
		/**
		 * @private
		 * read as text callback
		 * */
		_loadEnd: function(evt){
			var targetNode = this.docContainer.dom.contentDocument.body.querySelector('.contenttopic');
			targetNode.innerHTML = evt.target.result;
		},
		flushDomToFile: function(){
			console.log('currentFile = ', this._currentFileEntry)
			if(!this._currentFileEntry){
				return
			}
			var that = this;
			this._currentFileEntry.createWriter(function(writer){
				console.log('write start');
				writer.write(that.docContainer.dom.contentDocument.body.querySelector('.contenttopic').innerHTML);
				console.log('file written');
			}, function(){
				console.error('error creating a file writer')
			});
		},
		_fileCback: function(file, uri, fileEntry){
			var that = this, reader;
			this._currentFileEntry = fileEntry;
			if(file.size){
				reader = new FileReader();
				reader.onloadend = function(){
					that._loadEnd.apply(that, arguments)
				};
				reader.readAsText(file);

			}else{
				console.log('trying to load ', this.SCORMId + Supsi.Constants.get('DATA_LOCATION') + uri);
				jQuery.ajax({
					url: this.SCORMId + Supsi.Constants.get('DATA_LOCATION') + uri,
					type: 'GET',
					success: function(response){
						that.resourceLoaded(response, file, fileEntry)
					}
				});

			}
		},
		_fileErrback: function(){

		},
		_getFileCback: function(uri, fileEntry){
			var that = this;
			fileEntry.file(function(file){
				that._fileCback(file, uri, fileEntry);
			}, this._fileErrback);

		},
		_getFileErr: function(err){
			Ext.Msg.alert('Error', '[i18n] Error opening the file, code = ' + err.code);
		},
		setURI: function(uri){
			var that = this,
			contentDocument = this.docContainer.dom.contentDocument, base;
			this.setResourceId(uri);
			// inserisco elemento <base .../> solo al primo caricamento del doc
			if(!contentDocument.querySelector('base')){
				base = contentDocument.createElement('base');

				base.setAttribute('href', this.SCORMId + Supsi.Constants.get('DOCS_LOCATION'));
				contentDocument.body.appendChild(base);
			}

			console.log('reading file from ', uri)
			Supsi.Filesystem.getFile(uri.substr(uri.lastIndexOf('/')+1), true,
				function(fileEntry){
					that._getFileCback.call(that, uri, fileEntry)
				},
				function(err){
					console.error('file errback');
					that._getFileErr.apply(that, arguments)
				}
			);
		},
		setupGeometry: function(t, newOrientation, w, h, opts){
			var partial = newOrientation === 'landscape' ? 'in' : 'ax', height = Math['m' + partial](h, w);
			this.wrapperRef.setHeight(height);
		},
		loadTemplate: function(){
			this.docContainer.dom.src = 'ScormPanelTemplate.html';
		},
		/**
		 * @private
		 * file writer successfully created
		 * */
		_fileWriterCreated: function(writer, html){
			writer.write(html);
		},
		/**
		 * @private
		 * file writer error callback
		 * */
		_fileWriterErr: function(){

		},
		/**
		 * the resource is successfully loaded via xhr
		 * {Object} response
		 * {Object} file
		 * {Object} fileEntry
		 * */
		resourceLoaded: function(response, file, fileEntry){
			// resource loaded, via xhr
			var contentsNode = jQuery(response).find('div.contenttopic'),
				that = this,
				targetNode = this.docContainer.dom.contentDocument.body.querySelector('.contenttopic'),
				html = contentsNode.html();


			targetNode.innerHTML = html;

			fileEntry.createWriter(
				function(writer){
					that._fileWriterCreated(writer, html)
				}, this._fileWriterErr);

			this.preventNavigation(targetNode);
			this.fireEvent('docloaded');

		},
		setLocation: function(loc){
			var elem;
			if(!loc.indexOf('#') && (elem = this.docContainer.dom.contentDocument.getElementById(loc.substring(1)))){
				this.docContainer.dom.contentDocument.querySelector('.content').scrollTop = elem.offsetTop;
				return;
			}
			this.fireEvent('setlocation', loc);
		},
		/**
		 * prevent navigation to other pages
		 * {Node} the dom container
		 * */
		preventNavigation: function(node){
			for(var links = node.querySelectorAll('a'), i = 0, l = links.length; i < l; i++){
				links[i].setAttribute('href', 'javascript:setLocation("' + links[i].getAttribute('href') + '")');
			}
		},
		/**
		 * check if the selection is valid
		 * */
		checkSelection: function(range){
			//				var notes = '', range = this.getSelectionRange(),
//					commonAncestor = range.commonAncestorContainer,
//					annotations = commonAncestor.querySelectorAll ? commonAncestor.querySelectorAll('[data-scorm-annotation]') : []
//				;
//				this._annotationsNodes.length = 0;
//				for(var i = 0, annotation; annotation = annotations[i++];){
//					if(
//						range.startContainer.compareDocumentPosition(annotation) & 4 /*DOCUMENT_POSITION_FOLLOWING*/
//					&&
//						range.endContainer.compareDocumentPosition(annotation) & 2 /*DOCUMENT_POSITION_FOLLOWING*/
//						){
//						this._annotationsNodes.push(annotation);
//					}
//				}

			var commonAncestor = range.commonAncestorContainer,
				annotations = commonAncestor.querySelectorAll ? commonAncestor.querySelectorAll('[' + Supsi.Constants.get('SCORM_ANNOTATION_ATTRIBUTE') + '],[' + Supsi.Constants.get('SCORM_HIGHLIGHT_ATTRIBUTE') + ' ]') : []
			;

			// controllo che non ci siano intersezioni con le vecchie selezioni

			if(range && !range.collapsed
				&&
				Array.prototype.every.call(annotations, function(item){ return (range.startContainer.compareDocumentPosition(item) & 1) })
				&&
				Array.prototype.every.call(annotations, function(item){ return (range.endContainer.compareDocumentPosition(item) & 1) })
				){
				this.fireEvent('onselectionchecked', true);
			}else{
				this.fireEvent('onselectionchecked', false);
			}
		},
		onSelectedHighlight: function(target){
			this.fireEvent('highlightselected', target)
		},
		setupEventHandlers: function(){
			var that = this;
			// method injection
			this.docContainer.dom.onload = function(){
				var
					contentDocument = that.docContainer.dom.contentDocument,
					contentWindow = that.docContainer.dom.contentWindow
				;
				if(contentDocument.location.href !== 'about:blank'){
					contentWindow.setLocation = function(location){
						that.setLocation(location);
					};
					contentWindow.showNoteView = function(){
						that.showNoteView.apply(that, arguments);
					};
					contentWindow.checkSelection = function(){
						that.checkSelection.apply(that, arguments);
					};
					contentWindow.onSelectedHighlight = function(){
						that.onSelectedHighlight.apply(that, arguments);
					};


					var style;

					// style = contentDocument.createElement('link');
					// style.rel = 'stylesheet';
					// style.href = '../../../../../resources/css/player_doc.css?' + +new Date;
					// contentDocument.body.appendChild(style);

					var styles = [
						"compendio/template/compendio/Layout.css",
						"compendio/template/Styles/compendio.css",
						"compendio/template/Styles/annotator.css",
						"compendio/template/Styles/annotator.touch.css",
						"compendio/template/Styles/annotator.compendio.css",
						"compendio/template/Styles/div_mode.css",
						"compendio/template/Styles/link_coords.css"
					];
					for (var i = 0, l = styles.length; i < l; i++) {
						style = contentDocument.createElement('link');
						style.rel = 'stylesheet';
						console.log('css location = ', that.SCORMId + styles[i]);
						style.href = that.SCORMId + styles[i] + '?' +  +new Date;
						contentDocument.body.appendChild(style);
					}
				}

			}



				return;
			// -------------------------------------------------------------------------------------------------------------
			// -------------------------------------------------------------------------------------------------------------
			// -------------------------------------------------------------------------------------------------------------
			// -------------------------------------------------------------------------------------------------------------
			var that = this;
			this.docContainer.dom.onload = function(){
				var
						contentDocument = that.docContainer.dom.contentDocument
						;
				if(contentDocument.location.href !== 'about:blank'){

					// orientation changes




					// inietto weinre per debuggare sul mio vecchio ipad
//					var weinre = that.docContainer.dom.contentDocument.createElement('script');
//					that.docContainer.dom.contentDocument.body.appendChild(weinre);
//					weinre.src = 'http://192.168.0.5:8080/target/target-script-min.js';


					// injecting the external css

					var style, s;

					style = contentDocument.createElement('link');
					style.rel = 'stylesheet';
					style.href = '../../../../../resources/css/player_doc.css?' + +new Date;
					contentDocument.body.appendChild(style);

					var styles = [
						"compendio/template/compendio/Layout.css",
					 	"compendio/template/Styles/compendio.css",
					 	"compendio/template/Styles/annotator.css",
						"compendio/template/Styles/annotator.touch.css",
						"compendio/template/Styles/annotator.compendio.css",
						"compendio/template/Styles/div_mode.css",
						"compendio/template/Styles/link_coords.css"
					];
					for (var i = 0, l = styles.length; i < l; i++) {
						style = contentDocument.createElement('link');
						style.rel = 'stylesheet';
						console.log('css location = ', this.SCORMId + styles[i])
						style.href = this.SCORMId + styles[i] + '?' +  +new Date;
						contentDocument.body.appendChild(style);
					}

					s = contentDocument.createElement('script');
					contentDocument.body.appendChild(s);

					s.onload = function(){
						var innerScript;
						innerScript = contentDocument.createElement('script');
						innerScript.src = '../../../../../js/iframe.js?ts=' + +new Date;
						contentDocument.body.appendChild(innerScript);
					};

					// require.js must be the first script loaded
					s.src = '../../../../../js/require.js'
				}
			};
		},
		buildComponents: function(){
			(this.mbox = Ext.create('Ext.MessageBox', {
					title: '[i18n note]',
					prompt: {
						id: 'notearea',
						xtype: 'textareafield'
					},
					buttons: [
						{text: 'OK',     itemId: 'ok',  ui : 'action'},
						{text: 'Cancel', itemId: 'cancel'}
					],
					scope: this//,
//					fn: this.onAnnotation
				}
			)).on('show', function(){
					this.mbox.down('#notearea').focus();

			}, this);
			this.mbox.onBefore('show', function(){
				// todo: aggiungere la somma delle note eventualmente presenti
				// NON RIMUOVERE QUESTO COMMENTO, potrebbe servire in futuroper una migliore gestione della selezione e
				// delle note
//				var notes = '', range = this.getSelectionRange(),
//					commonAncestor = range.commonAncestorContainer,
//					annotations = commonAncestor.querySelectorAll ? commonAncestor.querySelectorAll('[' + Supsi.Constants.SCORM_ANNOTATION_ATTRIBUTE + ' ]') : []
//				;
//				this._annotationsNodes.length = 0;
//				for(var i = 0, annotation; annotation = annotations[i++];){
//					if(
//						range.startContainer.compareDocumentPosition(annotation) & 4 /*DOCUMENT_POSITION_FOLLOWING*/
//					&&
//						range.endContainer.compareDocumentPosition(annotation) & 2 /*DOCUMENT_POSITION_FOLLOWING*/
//						){
//						this._annotationsNodes.push(annotation);
//					}
//				}
//				console.log('included nodes: ', this._annotationsNodes);
//				this.mbox.down('#notearea').setValue(notes);
				this.mbox.down('#notearea').setValue('');
			}, this);

			this.mbox.down('#ok').on('tap', this.onFirstNoteConfirm, this);
			this.mbox.down('#cancel').on('tap', this.onFirstNoteCancel, this);

			(this.noteView = Ext.create('Ext.MessageBox', {
				title: '[i18n] note',
				prompt: {
					id: 'writenotearea',
					xtype: 'textareafield'
				},
				buttons: [
					{text: 'OK',     itemId: 'ok',  ui : 'action'},
					{text: 'Cancel', itemId: 'cancel'},
					{text: 'Delete', itemId: 'delete'}
				],
				scope: this

			})).on('show', function(){
					this.noteView.down('#writenotearea').focus();
			}, this);

			this.noteView.onBefore('show', function(){
				this.noteView.down('#writenotearea').setValue(this._currentAnnotationNode.getAttribute(Supsi.Constants.get('SCORM_ANNOTATION_ATTRIBUTE')) || '');
			}, this);

			this.noteView.down('#ok').on('tap', this.onNoteConfirm, this);
			this.noteView.down('#cancel').on('tap', this.onNoteCancel, this);
			this.noteView.down('#delete').on('tap', this.onNoteDelete, this);



			// search view
			(this.searchView = Ext.create('Ext.MessageBox', {
				title: '[i18n] search',
				prompt: {
					id: 'searcharea',
					xtype: 'textareafield'
				},
				buttons: [
					{text: 'OK',     itemId: 'ok',  ui : 'action'},
					{text: 'Dismiss', itemId: 'dismiss'}
				]
			})).on('show', function(){
					this.searchView.down('#searcharea').focus();
			}, this);


			this.searchView.down('#ok').on('tap', function(){
				this.onSearch('ok', this.searchView.down('#searcharea').getValue())
			}, this);
			this.searchView.down('#dismiss').on('tap', this.onSearchDismiss, this);
		},
		onNoteConfirm: function(){
			this.noteView.hide();
			this.fireEvent('annotationchange', this._currentAnnotationNode, this.noteView.down('#writenotearea').getValue());
		},
		onSearchDismiss: function(){
			var doc = this.docContainer.dom.contentDocument, searchResults = doc.querySelectorAll('.scorm_search_result');
			Array.prototype.every.call(searchResults, function(item){
				item.classList.remove('scorm_search_result')
			});
			this.searchView.hide();
		},
		onFirstNoteConfirm: function(){
			this.mbox.hide();
			this.fireEvent('annotationend', this.mbox.down('#notearea').getValue());
		},
		onNoteDelete: function(){
			Supsi.Utils.unwrap(this._currentAnnotationNode);
			this.noteView.hide()
		},
		onNoteCancel: function(){
			this.noteView.hide();
		},
		onFirstNoteCancel: function(){
			this.mbox.hide();
		},
		setSCORMId: function(SCORMId){
			this.SCORMId = SCORMId;
			console.log('SCORMid set to %s', SCORMId);
		},
		setResourceId: function(resourceId){
			this.resourceId = resourceId;
			console.log('resourceId set to %s', resourceId);
		},
		initialize: function(){
			this.callParent(arguments);

			this.setupGeometry(this, Ext.Viewport.getOrientation(), Ext.Viewport.getWindowWidth(), Ext.Viewport.getWindowHeight());
			this.buildComponents();
			this.setupEventHandlers();
			this.loadTemplate();
		}
	});
//})

