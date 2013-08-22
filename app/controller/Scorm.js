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
				navigator: '#course_navigator',
				module: '#module_list',
				navBackBtn: '#navBack',
//				mainView: 'scormreader',
				hidePanelBtn: '#hidePanelBtn',
				showPanelBtn: '#showPanelBtn',
				metaBtn: '#metaBtn',
				settingsBtn: '#settingsBtn',
				settingsPanel: '#settingsPanel',
				metaPanel: '#metaPanel',
				resourceList: '#resourceList',
				resourceContainer: '#resourceListContainer',
				scorm: 'scorm',
				scormToolbar: '#scormToolbar',
				metadataList: '#metadataList',
				scormPanel: 'scormpanel'//,

			},
			control: {
				module: {
					itemtap: 'selectModule'
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
				}
			}
		},

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'scorm'){
			
			if(typeof this.getScorm() != 'object') {
				var scorm = Ext.create('MoodleMobApp.view.Scorm');
			}
			// this.parseScorm('XGG003_DE/');
			// return;
			

			var scormExtractedFileFlag = MoodleMobApp.Config.getFileCacheDir() + '/' + record.get('id') + '/_scorm_extracted_';
			var self = this;
			window.requestFileSystem(
				LocalFileSystem.PERSISTENT, 0,
				function onFileSystemSuccess(fileSystem) {
						// get the filesystem
						fileSystem.root.getFile(
							scormExtractedFileFlag, 
							{
								create: false,
								exclusive: false
							},
							function(args){
								// poco bello, ma funziona
								self.parseScorm(args.fullPath.replace(/_scorm_extracted_$/, ''));
							},
							// error callback: notify the error
							function() {
								self.downloadArchive(record);
							}
						);
				},
				// error callback: notify the error
				function(){
					Ext.Msg.alert(
						'File system error',
						'Cannot access the local filesystem.'
					);
			});
		}
	},

	downloadArchive: function(module){
		var that = this,
		file = {
			'scormid': module.get('instanceid'),
			'name': module.get('id') + '.zip',
			'mime': 'application/zip',
		};

		// The archive is going to be named id.zip and is going to be stored in a directory named id
		// Example: 508/508.zip
		// Once extracted all the content is going to be contained in one directory.
		var dir = MoodleMobApp.Config.getFileCacheDir() + '/' + module.get('id');
		Supsi.Utils.log('files unzipped in ',  MoodleMobApp.Config.getFileCacheDir() + '/' + module.get('id'));
		var scormExtractedFileFlag = dir + '/_scorm_extracted_';
		//this.showLoadMask('');
		// success function
		var downloadSuccessFunc = function(result){
			console.log('download success function start');
			//MoodleMobApp.app.hideLoadMask();
			var filePath = dir + '/' + file.name;
			var extractionSuccessFunc = function(targetPath) {
				var astr = '';
					for(var k = 0, l = arguments.length; k < l; k++){
						astr += arguments[k] + ',';
					}
					console.log('extractionSuccessFunc arguments ' + astr);
					
					console.log('extractionSuccessFunc ' + targetPath);
					window.requestFileSystem(
						LocalFileSystem.PERSISTENT, 0,
						function onFileSystemSuccess(fileSystem) {
								// get the filesystem
								console.log('requestFileSystem callback ' + targetPath);
								fileSystem.root.getFile(
									scormExtractedFileFlag,
									{
										create: true,
										exclusive: false
									},
									function() {
										// console.log('finalized the scorm path = ', sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1) );
										console.log('before parseScorm ' + targetPath);

										that.parseScorm(targetPath + '/');
									},
									function() {
										console.log('cannot finalize the scorm');
									}
								);
						},
						// error callback: notify the error
						function(){
							Ext.Msg.alert(
								'File system error',
								'Cannot access the local filesystem.'
							);
						});
			};
			var extractionFailFunc = function(error) {
					Supsi.Utils.log('ERROR ', error);
			};
						// start the extraction

			MoodleMobApp.app.unzip(filePath, extractionSuccessFunc, extractionFailFunc);
		};

		// progress function
		var downloadProgressFunc = function(progressEvent){
			if (progressEvent.lengthComputable) {
				//MoodleMobApp.app.updateLoadMaskMessage(progressEvent.loaded+' bytes');
				// Supsi.Utils.log('downloaded in percentage: ' + (progressEvent.loaded/progressEvent.total * 100) + '%');
			} else {
				//this.hideLoadMask('');
				Supsi.Utils.log('download complete');
			}
		};

		MoodleMobApp.WebService.getScorm(
			file,
			dir,
			downloadProgressFunc,
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
		onResourceTap: function(dataview, index, target, record, el, options){
			// warning: attenzione, la firma riportata sulla documentazione ufficiale di sencha per questo evento
			// è SBAGLIATA

			// standard
			if(record.get('href')){
				this.getScormPanel().setURI(record.get('href'));
			}
			// TATA
			if(record.get('src')){
				_navHistory.push(record.get('src'));
				this.getNavBackBtn().show();
				Supsi.Utils.log('loading toc from ', this.getScormPanel().SCORMId + Supsi.Constants.get('TOC_LOCATION') + record.get('src'))
				this.loadToc(this.getScormPanel().SCORMId + Supsi.Constants.get('TOC_LOCATION') + record.get('src'));
			}
		},
		mainView: null,
		resourceList: null,

		loadManifest: function(manifest){
			this.getScormPanel().setSCORMId(manifest);
			return;
			// bloccata per ora, visto che di fatto è inutile leggere il manifest
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
			Supsi.Utils.log('***************** DOC LOADED 2 ********************');
			var root = data.responseXML.documentElement;

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
			for(; i < l; i++){
				ret = ret.concat(this.parseItems(organizations[i], root));
			}
			ret.length && (data.items = ret);
			data.title = 'manifest';
			data.leaf = false;
//        this.fireEvent('itemsUpdated', itemsNodes);
			this.setListData(data);
		},

		/**
		 * set the data in the nested list
		 * */
		setListData: function(data){
//			var store = Ext.create('Ext.data.TreeStore', {
			var store = Ext.create('Ext.data.Store', {
				model: 'MoodleMobApp.model.ScormResource',
				data: data
//				defaultRootProperty: 'items',
//				root: data
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
			_transport = document.createElement('script');
			_transport.type = 'text/javascript';
			var that = this;
			_transport.onload = function(){
				console.log('table of contents loaded');
				that.parseToc();
			};

			_transport.onerror = function(error){
				console.log('error: ', arguments);
			};
			_transport.src = toc; // toc toc! chi è?
			document.body.appendChild(_transport);

		},

		parseToc: function(){
			console.log('parse toc executed');
			var parsedDoc = domParser.parseFromString(gXMLBuffer, "text/xml"),
				data = [],
				itemsAndBooks = parsedDoc.querySelector('data').childNodes
			;
			for(var i = 0, l = itemsAndBooks.length; i < l; i++){
				data[i] = {
					href: itemsAndBooks[i].getAttribute('url'),
					src: itemsAndBooks[i].getAttribute('src') || '',
					title: itemsAndBooks[i].getAttribute('name')
				};
			}
			console.log('parse toc data');
			console.log(data);
			this.setListData(data);

		},

		parseScorm: function(path){
//			this.mainView = this.getMainView();
			
			// todo: qui intervenire con il parametro che mi darà il link al manifest
			// this.loadManifest(Supsi.Constants.get('DOC_ID'));
			console.log('nav ', this.getNavigator());
			console.log('scormview ', this.getScorm());
			this.getNavigator().push(this.getScorm());
			console.log('filePath is ', path);
			this.loadManifest(path);
			this.resourceList = this.getResourceList();
			// loading the test manifest file
			//        this.loadManifest(Supsi.Constants.get('TOC_LOCATION') + 'imsmanifest.xml');

			// toc sh*t
			_navHistory.push('toc.js');
			console.log('toc location = ' + path + Supsi.Constants.get('TOC_LOCATION'));
			/*
			var scorm = Ext.create('MoodleMobApp.view.Scorm');
			console.log('output of the scorm');
			console.log(scorm);
			this.getMain().push(scorm);
			*/
			console.log('pushing the scorm view');
			//this.getMain().push({ xtype: 'scorm' });
			this.loadToc(path + Supsi.Constants.get('TOC_LOCATION') + 'toc.js');
			//nr 18-07-2013e
		},
		//called when the Application is launched, remove if not needed
		launch: function(app) {
			Ext.sm = this;
			// return;
			var that = this;
			if(typeof device !== 'undefined'){
				document.addEventListener('deviceready', function(){
					Supsi.Filesystem.initialize();
					Supsi.Database.initialize();
					Supsi.Filesystem.ready(function(){
						// that._onDeviceReady();
					});
				}, false);
			}else{
				// that._onDeviceReady();
			}
		}
	});
})();
