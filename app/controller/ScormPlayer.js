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
		_overlay: null,
		_currentHighlightNode: null,
		_bookmarked: false,

		onHightlightRemovalPanelHide: function(){
			this._currentHighlightNode = null;
		},

		showHighlightRemovalPanel: function(target){
			this._currentHighlightNode = target;
			this.getHighlightRemovalPanel().showBy(this.getMarkerBtn());
		},

		syncBookmarkBtn: function(){
			var that = this, scormPanel = this.getScormPanel();
			// todo: serve una select resources by resource id.

			// il metadato deve essere relativo al resource id, non allo scorm id.
			Supsi.Database.selectResourcesByScormId({
				scormId: scormPanel.SCORMId,
				resId: scormPanel.resourceId,
				type: 0,
				cback: function(results){
					var bookmarks = 0;
					for(var i = 0, l = results.rows.length; i < l; i++){
						if(results.rows.item(i)['METADATA.type'] === 0 && results.rows.item(i)['agg.url'] === scormPanel.resourceId){
							bookmarks++;
						}
					}
//					that._bookmarked = !!bookmarks;
					that['setBookmark' + (bookmarks ? '' : 'Not') + 'Present']();
				},
				errback: function(error){
					// console.error('error preparing a tx ', error)
					Ext.Msg.alert('Error', 'Selecting the resource by scorm id failed, code = ' + error.code);
				}
			});
		},

		onDocLoaded: function(){
			this.getBookmarkBtn().setDisabled(false);
			this.getFindBtn().setDisabled(false);
			this.syncBookmarkBtn();

		},

		setBookmarkPresent: function(){
			this.getBookmarkBtn().setStyle('color:red');
			this._bookmarked = true;
//			this.syncBookmarkBtn();
		},

		setBookmarkNotPresent: function(){
			this.getBookmarkBtn().setStyle('color:white');
			this._bookmarked = false;
		},

		/**
		 * handle the text highlight removal
		 * */
		removeHighlight: function(){


			this._overlay.show();
			// non rimuovere questa timeout: è necessaria per dare il tempo alla webview di mostrare l'overlay,
			// che è fondamentale per impedire la navigazione durante le operazioni sul filesystem
			var that = this;
			setTimeout(function(){
				var scormPanel = that.getScormPanel(),
					index = scormPanel.getMetadataIndex(that._currentHighlightNode),
					scormId = scormPanel.SCORMId,
					resId = scormPanel.resourceId;
				Supsi.Database.removeMetadata({
					scormId: scormId,
					resId: resId,
					type: 1, // highlight
					index: index,
					cback: function(){
						// console.log('doc and metadata removed');
						Supsi.Utils.unwrap(that._currentHighlightNode);
						scormPanel.flushDomToFile();
						that._overlay.hide();
						that.getHighlightRemovalPanel().hide();
					},
					errback: function(tx, err){
						that._overlay.hide();
						//console.error('db error: ', err);
						Ext.Msg.alert('Error', 'Metadata database error, code = ' + err.code);
					}

				});
			}, 100)
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
							// console.log('doc and metadata saved');
						},
						errback: function(tx, err){
							// console.error('db error: ', err);
							Ext.Msg.alert('Error', 'Metadata database error, code = ' + err.code);
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
			var that = this,
			scormPanel = this.getScormPanel(),
			scormId = scormPanel.SCORMId,
			resId = scormPanel.resourceId;
			Supsi.Database[(this._bookmarked ? 'remove' : 'save') + 'Metadata']({
				scormId: scormId,
				resId: resId,
				type: 0, // bookmark
				index: -1,
				data: '',
				fragment: 'Bookmark',
				cback: function(){
//					scormPanel.flushDomToFile();
					that.syncBookmarkBtn();

				},
				errback: function(tx, err){
					//console.error('db error: ', err);
					Ext.Msg.alert('Error', 'Metadata database error, code = ' + err.code);
				}

			});

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
					// console.error('db error: ', err);
					Ext.Msg.alert('Error', 'Metadata database error, code = ' + err.code);
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
							// console.log('doc and metadata saved');
						},
						errback: function(tx, err){
							// console.error('db error: ', err);
							Ext.Msg.alert('Error', 'Metadata database error, code = ' + err.code);
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
			// Supsi.Utils.log('highlight node created');
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
			this._overlay = Ext.Viewport.add({
				xtype: 'panel',
				centered: true,
				style:'background-color: black',
				modal: {
					style: 'opacity: .5'
				},
				hideOnMaskTap:false,
				width:'300px',
				height: '100px',
				styleHtmlContent:true,
				hidden: true,
				html:'removing metadata...',
				items:[{
					text:'removing...'
				}]
			});
		}
	});
//});
