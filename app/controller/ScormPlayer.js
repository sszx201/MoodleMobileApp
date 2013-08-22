//require(['js/supsi/Constants', 'js/supsi/utils'], function(Constants, utils){
	Ext.define('MoodleMobApp.controller.ScormPlayer', {
		extend: 'Ext.app.Controller',

		config: {
			requires: [
				'Supsi.Constants',
				'Supsi.Utils'
			],
			refs: {
				highlightRemovalPanel: '#highlightRemovalPanel',
				highlightRemovalButton: '#highlightRemovalPanel > button',
				bookmarkBtn: '#bookmarkBtn',
				annotateBtn: '#annotateBtn',
				markerBtn: '#markerBtn',
				findBtn: '#findBtn',
				scormPanel: 'scormpanel'
			},
			control: {
				highlightRemovalButton: {
					tap: 'removeHighlight'
				},
				highlightRemovalPanel: {
					hide: 'onHightlightRemovalPanelHide'
				},
				markerBtn: {
					tap: 'onMarkText'
				},
				bookmarkBtn: {
					tap: 'toggleBookmark'
				},
				findBtn: {
					tap: 'showSearchDialog'
				},
				annotateBtn: {
					tap: 'annotationStart'
				},
				scormPanel: {
					highlightselected: 'showHighlightRemovalPanel',
					docloaded: 'onDocLoaded',
					onselectionchecked: 'checkDocSelection',
					annotationend: 'onAnnotationEnd',
					annotationdelete: 'onAnnotationDelete',
					annotationchange: 'onAnnotationChange',
					searchtext: 'onSearchText',
					setlocation: 'onSetLocation'
				}
			}
		},
		_currentHighlightNode: null,
		onHightlightRemovalPanelHide: function(){
			this._currentHighlightNode = null;
		},
		showHighlightRemovalPanel: function(target){
			this._currentHighlightNode = target;
			this.getHighlightRemovalPanel().showBy(this.getMarkerBtn());
		},

		onDocLoaded: function(){
			this.getBookmarkBtn().setDisabled(false);
			this.getFindBtn().setDisabled(false);
		},
		/**
		 * handle the text highlight removal
		 * */
		removeHighlight: function(){
			var that = this, scormPanel = this.getScormPanel(),
			index = scormPanel.getMetadataIndex(this._currentHighlightNode),
			scormId = scormPanel.SCORMId,
			resId = scormPanel.resourceId;
			Supsi.Database.removeMetadata({
				scormId: scormId,
				resId: resId,
				type: 1, // highlight
				index: index,
				cback: function(){
					scormPanel.flushDomToFile();
					console.log('doc and metadata removed');
					Supsi.Utils.unwrap(that._currentHighlightNode);
					that.getHighlightRemovalPanel().hide();
				},
				errback: function(tx, err){
					console.error('db error: ', err);
				}

			});
		},
		/**
		 * handle the text highlight
		 * */
		onMarkText: function(){
			var range = this.getScormPanel().getSelectionRange(),
				highlightNode = this._createHighlightNode(),
				rangeOp = false, scormId, resId, scormPanel = this.getScormPanel(), index = -1
			;

			try{
				range.surroundContents(highlightNode);
				rangeOp = true;
			}catch(exception){
				// thrown when the range contains at least a non-text node
			}finally{
				if(rangeOp){
					index = scormPanel.getMetadataIndex(highlightNode);
					scormId = scormPanel.SCORMId;
					resId = scormPanel.resourceId;
					Supsi.Database.saveMetadata({
						scormId: scormId,
						resId: resId,
						type: 1, // highlight
						index: index,
						fragment: range.toString(),
						data: '',
						cback: function(){
							scormPanel.flushDomToFile();
							console.log('doc and metadata saved');
						},
						errback: function(tx, err){
							console.error('db error: ', err);
						}

					});

				}
			}
		},
		checkDocHighlights: function(){
			// le marcature possono essere meno restrittive
			// per adesso lascio che si comportino esattamente come le annotazioni

		},
		checkDocSelection: function(isValid){
			this.getMarkerBtn().setDisabled(!isValid);
			this.getAnnotateBtn().setDisabled(!isValid);
		},
		onSetLocation: function(location){
			this.getScormPanel().setURI(Supsi.Constants.get('RELATIVE_DOCS_LOCATION') + location);
		},
		onSearchText: function(text){
			this.getScormPanel().searchText(text);
		},
		showSearchDialog: function(){
			this.getScormPanel().showSearchDialog();
		},
		toggleBookmark: function(){
			// todo: save the bookmark metadata (or remove it)
		},
		onAnnotationChange: function(node, val){
			node.setAttribute(Supsi.Constants.get('SCORM_ANNOTATION_ATTRIBUTE'), val);
		},
		/**
		 * @description handle the annotation removal
		 * @arguments {Node} annotationNode the node containing the annotation itself
		 * */
		onAnnotationDelete: function(annotationNode){
			var scormPanel = this.getScormPanel(),
				index = scormPanel.getMetadataIndex(annotationNode),
				scormId = scormPanel.SCORMId,
				resId = scormPanel.resourceId
			;
			console.log('index to remove = %d', index);
			Supsi.Database.removeMetadata({
				scormId: scormId,
				resId: resId,
				type: 2,
				index: index,
				cback: function(){
					scormPanel.flushDomToFile();
					Supsi.Utils.unwrap(annotationNode);
					scormPanel.noteView.hide();
				},
				errback: function(tx, err){
					console.error('db error: ', err);
				}

			});


		},
		onAnnotationEnd: function(text){
			var range = this.getScormPanel().getSelectionRange(),
				highlightNode = this._createNoteNode(text),
				rangeOp = false, scormId, resId, scormPanel = this.getScormPanel(), index = -1
				;
			try{
				range.surroundContents(highlightNode);
				rangeOp = true;
			}catch(exception){
				// thrown when the range contains at least a non-text node
			}finally{
				if(rangeOp){
					index = scormPanel.getMetadataIndex(highlightNode);
					scormId = scormPanel.SCORMId;
					resId = scormPanel.resourceId;
					Supsi.Database.saveMetadata({
						scormId: scormId,
						resId: resId,
						type: 2, // annotation
						index: index,
						data: text,
						fragment: range.toString(),
						cback: function(){
							scormPanel.flushDomToFile();
							console.log('doc and metadata saved');
						},
						errback: function(tx, err){
							console.error('db error: ', err);
						}

					});
				}
			}
		},
		/**
		 * @private
		 * create a highlight node wrapper
		 * @returns {Node} n
		 * */
		_createHighlightNode: function(){
			var n = document.createElement('span');
			n.setAttribute(Supsi.Constants.get('SCORM_HIGHLIGHT_ATTRIBUTE'), '');
			n.className = 'scorm_highlight';
			Supsi.Utils.log('highlight node created');
			return n;
		},

		/**
		 * @private
		 * create an annotation node wrapper
		 * @argument {String} text
		 * @returns {Node} n
		 * */
		_createNoteNode: function(text){
			var n = document.createElement('span');
			n.className = 'scorm_note';
			n.setAttribute(Supsi.Constants.get('SCORM_ANNOTATION_ATTRIBUTE'), text);
			return n;
		},

		/**
		 * highlight the selected text
		 * */
		highlight: function(){
			// todo: save the selection metadata
			var range = this.getScormPanel().getSelectionRange(), highlightNode = this._createHighlightNode(),
				clonedContents = range.cloneContents()
			;
			try{
				range.surroundContents(highlightNode);
			}catch(exception){
				// thrown when the range contains at least a non-text node
			}
		},

		/**
		 * start the annotation process
		 * exit if there is no selected range or if it's collapsed in one point (= no selected text)
		 * */
		annotationStart: function(){
			var sp = this.getScormPanel(), selectionRange = sp.getSelectionRange();
			if(!selectionRange || (selectionRange && selectionRange.collapsed)){
				return;
			}
			sp.showAnnotationDialog();
		},
		//called when the Application is launched, remove if not needed
		launch: function(app) {
			// var sp = this.getScormPanel();
			// Ext.Viewport.on('orientationchange', function(){ sp.setupGeometry.apply(sp, arguments); });
			//			window.addEventListener('orientationchange', function(){ sp.setupGeometry() }, false);

		}
	});
//});
