;(function(){
	var _navHistory = [],
		_transport,
		domParser = new DOMParser()
	;
//	_transport.type = 'text/javascript'

	Ext.define('MoodleMobApp.controller.Scorm', {
		extend: 'Ext.app.Controller',
		requires: [
			'MoodleMobApp.model.ScormResource',
			'MoodleMobApp.view.Scorm',
			'Ext.data.Store',
			'Supsi.Utils',
			'Supsi.Filesystem',
			'Supsi.Database'
		],
		config: {
			refs: {
				readPercent: '#readPercent',
				navigator: 'coursenavigator',
				module: 'modulelist',
				bookmarkBtn: '#bookmarkBtn',
				navBackBtn: '#navBack',
				hidePanelBtn: '#hidePanelBtn',
				showPanelBtn: '#showPanelBtn',
				metaBtn: '#metaBtn',
				settingsBtn: '#settingsBtn',
				settingsPanel: '#settingsPanel',
				metaPanel: '#metaPanel',
				resourceTocList: '#resourceTocList',
				resourceList: '#resourceList',
				resourceContainer: '#resourceListContainer',
				scorm: 'scorm',
				scormToolbar: '#scormToolbar',
				metadataList: '#metadataList',
				scormPanel: 'scormpanel',
				recentActivity: 'recentactivitylist'

			},
			control: {
				scormPanel: {
					docloaded: 'onDocLoaded'
				},
				module: {
					itemtap: 'selectModule'
				},
				resourceTocList: {
					itemtap: 'onResourceTocTap'
				},
				resourceList: {
					itemtap: 'onResourceTap'
				},
				navBackBtn: {
					tap: 'navigationBack'
				},
				settingsBtn: {
					tap: 'showSettingsPanel'
				},
				hidePanelBtn: {
					tap: 'hidePanel'
				},
				showPanelBtn: {
					tap: 'showPanel'
				},
				metaBtn: {
					tap: 'showMetaPanel'
				},
				recentActivity: {
					checkActivity: function(record) {
						if(record.get('modname') == 'scorm') {
							var scorm_record = MoodleMobApp.Session.getModulesStore().findRecord('id', record.get('moduleid'));
							if(scorm_record != undefined) {
								this.processScorm(scorm_record);
							}
						}
					}
				}
			}
		},

	path: '',

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'scorm'){
			this.processScorm(record);
		}
	},

	processScorm: function(record) {
		if(typeof this.getScorm() != 'object') {
			var scorm = Ext.create('MoodleMobApp.view.Scorm');
		}
		var scormExtractedFileFlag = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/scorm/' + record.get('id') + '/_scorm_extracted_';
		var self = this;
		var successCallback = function(sPath, fileSystem) {
			fileSystem.root.getFile(
				scormExtractedFileFlag,
				{
					create: false,
					exclusive: false
				},
				function(fileEntry){
					// archive available, open the scorm
					//var path = fileEntry.toURL().replace(/_scorm_extracted_$/, '').replace(/cdvfile:\/\//, '');
					var path = fileEntry.toURL().replace(/_scorm_extracted_$/, '');
					self.parseScorm(path);
				},
				// archive not available, download it first
				function() {
					self.downloadArchive(record);
				}
			);
		}
		var failCallback = function(error) {
			MoodleMobApp.app.dump(error);
		}
		MoodleMobApp.FileSystem.access(successCallback, failCallback);
	},

	downloadArchive: function(module){
		var that = this,
		file = {
			'scormid': module.get('instanceid'),
			'name': module.get('id') + '.zip',
			'mime': 'application/zip'
		};

		// The archive is going to be named id.zip and is going to be stored in a directory named id
		// Example: 508/508.zip
		// Once extracted all the content is going to be contained in one directory.
		var dir = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/scorm/' + module.get('id');
		Supsi.Utils.log('files unzipped in ',  dir);
		// this file notifies the sucessful extraction
		// if not present the archive is going to be downloaded again
		var scormExtractedFileFlag = dir + '/_scorm_extracted_';
		// success function
		var downloadSuccessFunc = function(file) {
			MoodleMobApp.app.showLoadMask('Extracting');
			console.log('download success function start');
			var extractionSuccessFunc = function(targetPath) {
					MoodleMobApp.app.hideLoadMask('');
					var successCallback = function(sPath, fileSystem) {
						// get the filesystem
						console.log('requestFileSystem callback ' + targetPath);
						fileSystem.root.getFile(
							scormExtractedFileFlag,
							{
								create: true,
								exclusive: false
							},
							function() {
								that.parseScorm(targetPath+'/');
								//that.processScorm(module);
							},
							function() {
								Ext.Msg.alert(
									'Scorm registering',
									'Failed to register the downloaded score. Please check the storage available space.'
								);
							}
						);
					}

					var failCallback = function(error) {
						MoodleMobApp.app.dump(error);
					}

					MoodleMobApp.FileSystem.access(successCallback, failCallback);
			};
			var extractionFailFunc = function(error) {
					MoodleMobApp.app.hideLoadMask('');
					Ext.Msg.alert(
						'Archive extracting',
						'Extracting the archive has failed. Please check the storage available space.'
					);
			};

			// start the extraction
			var outputDirectory = file.toURL().substring(0, file.toURL().lastIndexOf('/'));
			zip.unzip(
				file.toURL(),
				outputDirectory,
				function(arg){
					console.log(' >>>>>>>>>>> callback called with arg: ' + arg);
					console.log(' >>>>>>>>>>> extracting filepath: ' + file.fullPath);
					console.log(' >>>>>>>>>>> extracting directory output: ' + outputDirectory);
					if(arg == 0) { // success
						extractionSuccessFunc(outputDirectory);
					} else {
						extractionFailFunc();
					}
				}
			);
		};

		MoodleMobApp.WebService.getScorm(
			file,
			dir,
			downloadSuccessFunc,
			MoodleMobApp.Session.getCourse().get('token')
		);
	},

		/**
		 * navigation back handler
		 * */
		navigationBack: function(){
			if(_navHistory.length < 2){
				return;
			}
			_navHistory.pop();
			this.loadToc(this.getScormPanel().SCORMId +Supsi.Constants.get('TOC_LOCATION') + _navHistory[_navHistory.length - 1]);
			if(_navHistory.length === 1){
				this.getNavBackBtn().hide();
			}
		},


		/**
		 * show the metadata panel
		 * */
		showMetaPanel: function(){
			var that = this;
			Supsi.Database.selectResourcesByScormId({
				scormId: this.getScormPanel().SCORMId,
				cback: function(results){
					var list = that.getMetadataList(), store = list.getStore(), rows = results.rows, data = [], 

					// todo: localize me, i18n!
					types = ['Bookmark', 'Highlight', 'Annotation']
					;
					for(var i = 0, l = rows.length, item; i < l; i++){
						item = rows.item(i);
						data.push({
							data: item['METADATA.data'],
							type: types[+item['METADATA.type']],
							fragment: item['METADATA.fragment'],
							index: item['METADATA.idx'],
							timestamp: item['METADATA.timestamp'],
							href: item['agg.url']
						});
					}
					data.length ? store.setData(data) : store.removeAll();
					store.sync();
				},
				errback: function(){

				}
			});
			this.getScormToolbar().hide();
			this.loadMetadata();
			this.getMetaPanel().show();
		},
		/**
		 * load the metadata into the list
		 */
		loadMetadata: function(){
			// list.removeAll();
			
		},

		/**
		 * show the settings panel
		 * */
		showSettingsPanel: function(){
			this.getSettingsPanel().showBy(this.getSettingsBtn());
			this.getSettingsPanel().hide();
			this.getSettingsPanel().showBy(this.getSettingsBtn());
		},
		/**
		 * hide the navigation panel
		 * */
		hidePanel: function(){
			var sp = this.getScormPanel();
			this.getResourceContainer().hide();
			this.getHidePanelBtn().hide();
			this.getShowPanelBtn().show();

			setTimeout(function(){
				// sporchissimo trucco per forzare il reflow in ios. Android stava bene anche senza
				sp.docContainer.dom.contentDocument.querySelector('.contenttopic').style.width = sp.docContainer.dom.contentDocument.querySelector('.content').offsetWidth + 'px';
			}, 0);
		},

		/**
		 * show the navigation panel
		 * */
		showPanel: function(){
			this.getResourceContainer().show();
			this.getHidePanelBtn().show();
			this.getShowPanelBtn().hide();
		},

		/**
		 * resource list tap handler
		 * */
		onResourceTocTap: function(dataview, index, target, record, el, options){
			// warning: attenzione, la firma riportata sulla documentazione ufficiale di sencha per questo evento
			// è SBAGLIATA
			Supsi.Utils.log('record = ', record);

			if(record.get('href')){
				this.getScormPanel().setURI(record.get('href'));
			}

			if(record.get('src')){
				_navHistory.push(record.get('src'));
				this.getNavBackBtn().show();
				this.loadToc(this.getScormPanel().SCORMId + Supsi.Constants.get('TOC_LOCATION') + record.get('src'));
			}
		},
		onResourceTap: function(dataview, list, index, target, record, e, eOpts ){
			// ovviamente la firma dell'handler su una nested list è diversa, attenzione

			if(record.get('href')){
				Supsi.Utils.log('onResourceTap, uri = ', record.get('href'));
				this.getScormPanel().setURI(record.get('href'));
			}

			if(record.get('src')){
				_navHistory.push(record.get('src'));
				this.getNavBackBtn().show();
				this.loadToc(this.getScormPanel().SCORMId + Supsi.Constants.get('TOC_LOCATION') + record.get('src'));
			}
		},
		mainView: null,
		resourceTocList: null,
		resourceList: null,

		loadManifest: function(manifest) {
//			this.getScormPanel().setSCORMId(manifest);
			// bloccata per ora, visto che di fatto è inutile leggere il manifest
			console.log('LOADING MANIFEST: %s', manifest);
			Ext.Ajax.request({
				url: manifest,
				method: 'GET',
				scope: this,
				success: this.manifestLoaded,
				failure: function(err){
					Supsi.Utils.log('load error ', err);
				}
			});
		},
		manifestLoaded: function(data){
			var root = data.responseXML.documentElement;
			console.log('Manifest root: ');
			console.log(root);

			this.parseManifest(root);
		},
		parseItems: function(itemNode, root){
			var _itemsNodes = itemNode.childNodes || [], itemsNodes, newItem, idRef, resource, ret = [], currentChildren;
			// todo: spostare dal main controller
//			var titleNode = itemNode.querySelector('title');
	//        if(titleNode){
	//            data.title = titleNode.textContent;
	//        }
			var titleNode;
			itemsNodes = Array.prototype.filter.call(_itemsNodes, function(it){
				return it.tagName ? it.tagName.toLowerCase() === 'item' : false
			});

			for(var i = 0, l = itemsNodes.length; i < l; i++){
				newItem = {};
				if(idRef = itemsNodes[i].getAttribute('identifierref')){
					resource = root.querySelector('[identifier="' + idRef + '"]');
					newItem.href = resource.getAttribute('href');
				}
				titleNode = itemsNodes[i].querySelector('title');
				if(titleNode){
					newItem.title = titleNode.textContent;
				}
				currentChildren = this.parseItems(itemsNodes[i], root);

				newItem.leaf = !currentChildren.length;
				if(currentChildren.length){
					newItem.items = currentChildren;
				}
				ret.push(newItem)
			}

			return ret;
		},
		parseManifest: function(root){
			var organizations = root.querySelectorAll('organizations>organization'), i = 0, l = organizations.length,
				data = {}, ret = []
			;
			data.items = [];
			this.updateItemsLength(root);
			for(; i < l; i++){
				ret = ret.concat(this.parseItems(organizations[i], root));
			}
			ret.length && (data.items = ret);
			data.title = 'manifest';
			data.leaf = false;
//        this.fireEvent('itemsUpdated', itemsNodes);
			console.log('Manifest parsed; data is here');
			console.log(data);
			this.setListData(data);
		},

		/**
		 * set the data in the nested list
		 * */
		setTocListData: function(data){
//			var store = Ext.create('Ext.data.TreeStore', {
			var store = Ext.create('Ext.data.Store', {
				model: 'MoodleMobApp.model.ScormResource',
				data: data
//				defaultRootProperty: 'items',
//				root: data
			});
			this.resourceTocList.setStore(store);
		},
		/**
		 * set the data in the nested list
		 * */
		setListData: function(data){
			var store = Ext.create('Ext.data.TreeStore', {
//			var store = Ext.create('Ext.data.Store', {
				model: 'MoodleMobApp.model.ScormResource',
				data: data,
				defaultRootProperty: 'items',
				root: data
			});
			this.resourceList.setStore(store);
		},

		/**
		 * load a table of contents - non standard SCORM
		 * */
		loadToc: function(toc){
			console.log('loadToc with parameter: ' + toc);
			if(_transport){
				_transport.onload = null;
				_transport = null;
			}
			console.log('creating _transport');
			_transport = document.createElement('script');
			_transport.type = 'text/javascript';
			var that = this;
			console.log('adding a callback');
			_transport.onload = function(){
				console.log('table of contents loaded');
				that.parseToc();
			};

			_transport.onerror = function(error){
				console.log('transport error: ', error);
			};
			_transport.src = toc; // toc toc! chi è?
			console.log('before appendChild');
			document.body.appendChild(_transport);

		},

		parseToc: function(){
			console.log('parse toc executed, contents = ', window.gXMLBuffer);
			var parsedDoc = domParser.parseFromString(window.gXMLBuffer, "text/xml"),
				data = [],
				itemsAndBooks = parsedDoc.querySelector('data').childNodes
			;
			console.log('parsedDocs = ', parsedDoc);
			for(var i = 0, l = itemsAndBooks.length; i < l; i++){
				data[i] = {
					href: itemsAndBooks[i].getAttribute('url'),
					src: itemsAndBooks[i].getAttribute('src') || '',
					title: itemsAndBooks[i].getAttribute('name')
				};
			}
			console.log('parse toc data');
			console.log(data);
			this.setTocListData(data);

		},

		parseScorm: function(path){
			this.getNavigator().push(this.getScorm());
			this.resourceTocList = this.getResourceTocList();
			this.resourceList = this.getResourceList();
			this.path = path;
			// pulisco la situazione eventualmente lasciata da un altro documento
			this.getNavBackBtn().hide();
			var scormPanel = this.getScormPanel(), that = this,
				// callback for special TATA scorms
				tatacback = function(){
					Supsi.Utils.log('++++++++++ TATA CBACK, setting SCORMID = ', path + Supsi.Constants.get('TOC_LOCATION'));
					_navHistory.push('toc.js');
					that.resourceTocList.setHidden(false);
					that.resourceList.setHidden(true);
					scormPanel.standard = false;
//					scormPanel.setSCORMId(path + Supsi.Constants.get('TOC_LOCATION'));
					scormPanel.setSCORMId(path);
					scormPanel.setupNonStdEvents();
					scormPanel.loadTemplate();
					that.loadToc(path + Supsi.Constants.get('TOC_LOCATION') + 'toc.js');
				},
				// call back for the standard scorm packages
				scormcback = function(){
					Supsi.Utils.log('++++++++++ STANDARD CBACK');
					scormPanel.standard = true;
					that.resourceList.setHidden(false);
					that.resourceTocList.setHidden(true);

					scormPanel.setSCORMId(path);
					var manifestPath = path.replace('cdvfile://localhost/persistent/', '') + '/imsmanifest.xml';
					console.log('Manifest path:');
					console.log(manifestPath);
					Supsi.Filesystem.fileSystem.root.getFile(
						manifestPath,
						{ create: false, exclusive: false },
						function(fileEntry) {
							console.log('got the file entry, calling loadManifest function');
							console.log(that);
							that.loadManifest(fileEntry.nativeURL);
						},
						function() {
							console.log('cannot load the manifest file');
						}
					);
				};

			/*
			var scorm = Ext.create('MoodleMobApp.view.Scorm');
			console.log('output of the scorm');
			console.log(scorm);
			this.getMain().push(scorm);
			*/
			//this.getMain().push({ xtype: 'scorm' });

			this.getBookmarkBtn().setStyle('color:white');

			// fork: real or fake SCORM?
			// In entrambi i casi devo svuotare la lista eventualmente presente in precedenza.

			// la ricerca di spine.js ovviamente va sempre fatta all'interno delle directory usate per l'approccio non
			// scorm standard, cioè in TOC_DATA_LOCATION
			this.loadSpine(path + Supsi.Constants.get('TOC_DATA_LOCATION') + 'template/JavaScript/book.spine.js', tatacback, scormcback);
			//nr 18-07-2013e
		},
		loadSpine: function(spineSrc, success, fallback){
			var that = this;
			// empty the previous compendio
			window.compendio = {};
			// load the next compendio
			var spinePath = spineSrc.replace('cdvfile://localhost/persistent/', '');
			console.log('trying to load spine: ' + spinePath);
			Supsi.Filesystem.fileSystem.root.getFile(
				spinePath,
				{ create: false, exclusive: false },
				function(fileEntry) {
					console.log('adding script element: ' + fileEntry.nativeURL);
					var _spineTransport = document.createElement('script');
					_spineTransport.name = 'compendio';
					_spineTransport.type = 'text/javascript';
					_spineTransport.src = fileEntry.nativeURL;
					_spineTransport.onload = function(){
						success();
						that.updateSpineLength()
					};
					_spineTransport.onerror = fallback;
					document.body.appendChild(_spineTransport);
				},
				function() {
					console.log('cannot load the book.spine.js file; falling back');
					fallback();
				}
			);
		},
		updateReadLength: function(val){
			this.getReadPercent().setHtml(((val*100)|0) + '&#37;');
		},
		updateItemsLength: function(root){
			// avanzassero tempo e denaro, refactor di questa funzione e della successiva, che sono formalmente identiche
			var slen = localStorage[this.path + Supsi.Constants.get('SPINE_LENGTH_SUFFIX')], rpages = localStorage[this.path + Supsi.Constants.get('READ_PAGES_SUFFIX')], len;
			if(!rpages){
				this.updateReadLength(0)
			}
			if(slen){
				if(rpages){
					this.updateReadLength(JSON.parse(rpages).length/slen)
				}
				return;
			}
			var len = root.querySelectorAll('resources>resource').length;
			localStorage[this.path + Supsi.Constants.get('SPINE_LENGTH_SUFFIX')] = len;
		},
		updateSpineLength: function(){
			var slen = localStorage[this.path + Supsi.Constants.get('SPINE_LENGTH_SUFFIX')], rpages = localStorage[this.path + Supsi.Constants.get('READ_PAGES_SUFFIX')];
			if(!rpages){
				this.updateReadLength(0)
			}
			if(slen){
				if(rpages){
					this.updateReadLength(JSON.parse(rpages).length/slen)
				}
				return;
			}
			localStorage[this.path + Supsi.Constants.get('SPINE_LENGTH_SUFFIX')] = compendio.spineIndex().length - 3; // fidiamoci
		},
		onDocLoaded: function(){
			Supsi.Utils.log('subscription: docloaded');
			var
				scormPanel = this.getScormPanel(),
				slen = localStorage[this.path + Supsi.Constants.get('SPINE_LENGTH_SUFFIX')],
				rpages = localStorage[this.path + Supsi.Constants.get('READ_PAGES_SUFFIX')]
			;
			rpages = rpages ? JSON.parse(rpages) : [];
			if(!~rpages.indexOf(scormPanel.resourceId)){
				rpages.push(scormPanel.resourceId);
				this.updateReadLength(rpages.length/slen);
				localStorage[this.path + Supsi.Constants.get('READ_PAGES_SUFFIX')] = JSON.stringify(rpages);
			}

		},
		//called when the Application is launched, remove if not needed
		launch: function(app) {
			Ext.sm = this;
			// return;
			if(typeof device !== 'undefined'){
				document.addEventListener('deviceready', function(){
					Supsi.Filesystem.initialize();
					Supsi.Database.initialize();
					Supsi.Filesystem.ready(function(){
					});
				}, false);
			}else{
			}
		}
	});
})();
