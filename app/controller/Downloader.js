Ext.define('MoodleMobApp.controller.Downloader', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			navigator: 'coursenavigator',
			moduleList: 'modulelist',
			folder: 'folder',
			multiDownloadsButton: 'button#multiDownloadsAppBtn',
			queueForDownloadCheckBox: 'checkboxfield#queuefordownload',
			clearSelectionButton: 'coursenavigator toolbar#downloadsToolbar button[action=clearselection]',
			selectAllFilesButton: 'coursenavigator toolbar#downloadsToolbar button[action=selectall]',
			downloadFilesButton: 'coursenavigator toolbar#downloadsToolbar button[action=downloadfiles]'
        },

        control: {
			navigator: {
				activeitemchange: 'toggleDownloadModeBar',
				downloadfile: 'downloadFile'
			},
			multiDownloadsButton: {
				tap: 'activateMultiDownloadMode'
			},
			queueForDownloadCheckBox: {
				check: 'queueResource',
				uncheck: 'unqueueResource'
			},
			clearSelectionButton: {
				tap: 'clearSelection'
			},
			selectAllFilesButton: {
				tap: 'selectAll'
			},
			downloadFilesButton: {
				tap: 'processQueue'
			}
        }
    },

	init: function() {
		Ext.dlc = this;
		MoodleMobApp.Session.setDownloader(this);
		this.downloadQueue = {};
	},

	activateMultiDownloadMode: function() {
		if(MoodleMobApp.Session.getMultiDownloadMode()) {
			MoodleMobApp.Session.setMultiDownloadMode(false);
			this.getNavigator().down('toolbar#downloadsToolbar').hide();
		} else {
			MoodleMobApp.Session.setMultiDownloadMode(true);
			this.getNavigator().down('toolbar#downloadsToolbar').show();
		}
		switch(this.getNavigator().getActiveItem().xtype) {
			case 'modulelist':
				this.getModuleList().refresh();
			break;
			case 'folder':
				this.getFolder().refresh();
			break;
		}
	},

	toggleDownloadModeBar: function(navigator, view, oldView, opts) {
		if(view.xtype != 'modulelist' && view.xtype != 'folder') {
			this.getNavigator().down('toolbar#downloadsToolbar').hide();
		} else if(MoodleMobApp.Session.getMultiDownloadMode()) {
			this.getNavigator().down('toolbar#downloadsToolbar').show();
		}
	},
    
	queueResource: function(cbox, e, opts) {
		if(e != undefined) {
			e.stopPropagation(); // avoid starting the download right away
		}
		var target = cbox.getParent();
		var record = cbox.getParent().getRecord();
		console.log('ADDING RESOURCE: ');
		console.log(record.getData());
		var index = null;
		var file = null;

		// check if this resource is a folder
		if(record.get('modname') == 'folder') {
			return this.queueFolder(record, target);
		} else if(record.get('modname') == 'scorm') {
			index = record.internalId;
			file = {
				'moduleid': record.get('id'),
				'scormid': record.get('instanceid'),
				'name': record.get('id') + '.zip',
				'mime': 'application/zip'
			};
		// check if this resource is a folder entry
		} else if(record.get('rootid') != undefined) {
			if(record.get('mime') == 'inode/directory') {
				return this.queueFolder(record, target);
			} else {
				index = record.internalId;
				file = {
					name: record.get('name'),
					fileid: record.get('fileid'),
					mime: record.get('mime'),
					size: record.get('size')
				};
			}
		} else { // process a standard resource
			// find the resource in the store
			var instanceId = record.get('instanceid');
			var courseId = record.get('courseid');
			var resource_position = MoodleMobApp.Session.getResourcesStore().findBy(
				function(record) {
					return record.get('courseid') == courseId && record.get('id') == instanceId;
				}
			);
			var resource = MoodleMobApp.Session.getResourcesStore().getAt(resource_position);
			index = resource.internalId;
			file = {
				name: resource.get('filename'),
				fileid: resource.get('fileid'),
				mime: resource.get('filemime'),
				size: resource.get('filesize')
			};
		}
		// build the callback function
		var callBackFunction = function() { target.setCached(true); };
		// add to queue
		this.downloadQueue[index] = { entry: file, callback: callBackFunction };
	},

	queueFolder: function(record, target) {
		var rootid = 0;
		if(record.get('rootid') != undefined) {
			rootid = record.get('rootid');
		} else {
			rootid = record.get('instanceid');
		}
		// filter modules
		MoodleMobApp.Session.getFoldersStore().each(
			function(file_entry) {
				if( 
					file_entry.get('rootid') === rootid &&
					file_entry.get('courseid') == MoodleMobApp.Session.getCourse().get('id') &&
					file_entry.get('mime') != 'inode/directory'
				) {
					var file = {
						name: file_entry.get('name'),
						fileid: file_entry.get('fileid'),
						mime: file_entry.get('mime'),
						size: file_entry.get('size')
					};
					var callBackFunction = function() { target.setCached(true); };
					this.findCachedFile(
						file,
						function() {}, // if the file exists than do nothing
						function() { // if the file does not exist than add it to the queue
							// add to queue
							MoodleMobApp.Session.getDownloader().downloadQueue[file_entry.internalId] = { entry: file, callback: callBackFunction };
						}
					);
				}
			}, this
		);
	},

	unqueueResource: function(cbox, e, opts) {
		var record = cbox.getParent().getRecord();
		if(record.get('modname') == 'folder') {
			var rootid = record.get('instanceid');
			MoodleMobApp.Session.getFoldersStore().each(
				function(file_entry) {
					if( 
						file_entry.get('rootid') === rootid &&
						file_entry.get('courseid') == MoodleMobApp.Session.getCourse().get('id') &&
						file_entry.get('mime') != 'inode/directory'
					) {
						delete this.downloadQueue[file_entry.internalId];
					}
				}, this
			);
		} else if(record.get('rootid') != undefined) { // check if folder entry
			var index = record.internalId;
			delete this.downloadQueue[index];
		} else if(record.get('modname') == 'scorm') { // check if scorm
			var index = cbox.getParent().getRecord().internalId;
			delete this.downloadQueue[index];
		} else {
			var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', cbox.getParent().getRecord().get('instanceid'), 0, false, true, true);
			var index = resource.internalId;
			delete this.downloadQueue[index];
		}
	},

	clearSelection: function() {
		this.downloadQueue = {};
		this.getModuleList().getAt(1).getItems().each(function(entry){
			entry.down('#queuefordownload').uncheck();
		}, this);
	},

	selectAll: function() {
		this.downloadQueue = {};
		this.getModuleList().getAt(1).getItems().each(function(entry){
			if(entry.getCachable() && !entry.getCached()) {
				entry.down('#queuefordownload').check();
			}
		}, this);

	},

	processQueue: function() {
		if(Object.keys(MoodleMobApp.Session.getDownloader().downloadQueue).length == 0) {
			console.log('Queue processed :: all selected files have been downloaded!!');
		} else {
			var key = Object.keys(MoodleMobApp.Session.getDownloader().downloadQueue)[0];
			var file = MoodleMobApp.Session.getDownloader().downloadQueue[key].entry;
			var processNextEntry = function() {
				if(Object.keys(MoodleMobApp.Session.getDownloader().downloadQueue).length > 0) {
					MoodleMobApp.Session.getDownloader().downloadQueue[key].callback();
					// remove the current entry and start the next one
					delete MoodleMobApp.Session.getDownloader().downloadQueue[key];
					MoodleMobApp.Session.getDownloader().processQueue();
				}
			};

			// prepare the filePath
			file.name = this.standardizeFileName(file.name);
			var dirPath = this.buildDirPath(file);
			var filePath = dirPath + '/' + file.name;

			var fetchFunction = function(successCallback) {
				if(MoodleMobApp.app.isConnectionAvailable()) {
					if(file.scormid == undefined) {
						MoodleMobApp.WebService.getFile(
							file,
							dirPath,
							function(fileEntry) {
								successCallback(fileEntry);
								//processNextEntry();
							},
							MoodleMobApp.Session.getCourse().get('token')
						);
					} else {
						MoodleMobApp.WebService.getScorm(
							file,
							dirPath,
							function(fileEntry) {
								successCallback(fileEntry);
								//processNextEntry();
							},
							MoodleMobApp.Session.getCourse().get('token')
						);
					}
				} else {
					Ext.Msg.alert(
						'Download failed',
						'Cannot complete the downloads because there is no connection available.'
					);
				}
			};
			var fetchFunctionSuccessCallback = null;

			if(file.mime == 'application/zip') {
				// define the callback function for the zipped archives
				fetchFunctionSuccessCallback = function(fileEntry) {
					var outputDirectory = fileEntry.toURL().substring(0, fileEntry.toURL().lastIndexOf('.zip'));
					zip.unzip(
						fileEntry.toURL(),
						outputDirectory,
						function(arg){
							console.log(' >>>>>>>>>>> callback called with arg: ' + arg);
							console.log(' >>>>>>>>>>> extracting filepath: ' + filePath);
							console.log(' >>>>>>>>>>> extracting directory output: ' + outputDirectory);
							if(arg == 0) { // success
								// deal with the next entry
								processNextEntry();

								console.log('archive extracted yaaay');
								MoodleMobApp.FileSystem.removeFile(
									filePath,
										function(arg) {
											console.log('archive removed'); console.log(arg);
										},
										function(error){
											Ext.Msg.alert(
												'Removing File',
												'Removing the file: '+ filePath +' failed! Code: ' + error.code
											);
											console.log('removing the archive failed'); console.log(error);
										}
								);
								MoodleMobApp.FileSystem.createFile(
									dirPath+'/_archive_extracted_',
									function(arg) {
										console.log('flag created'); console.log(arg);
									},
									function(error){
										Ext.Msg.alert(
											'Extracting Zip File',
											'Registering the extraction of the zip file: '+ filePath +' failed! Code: ' + error.code
										);
										console.log('creating the flag failed'); console.log(error);
									});
							} else {
								Ext.Msg.alert(
									'File extraction failed',
									'The file ' + file.name + ' could not be extracted. Please check your storage space.'
								);
							}
						}
					);
				};
			} else {
				fetchFunctionSuccessCallback = function(fileEntry) {
					processNextEntry();
				};
			}

			// check if the file is available. If it is available process the next one otherwise
			// execute the previously defined fetchFunction.
			this.findCachedFile(
				file,
				processNextEntry,
				function(error) {
					fetchFunction(fetchFunctionSuccessCallback);
				}
			);
		}
	},

	// file is an object such as:
	// {"name": "filename", "fileid": "file id number", "mime":"mime/type", size: 32122}
	// the fileDownloadedCallback is called after the file has been fetched
	downloadFile: function(file, fileDownloadedCallback) {
		// prepare the filePath
		file.name = this.standardizeFileName(file.name);
		var dirPath = this.buildDirPath(file);
		var filePath = dirPath + '/' + file.name;

		// this function is called after the user has confirmed the download
		var startDownload = function() {
			var fetchFunction = function(successCallback) {
				if(MoodleMobApp.app.isConnectionAvailable()) {
					if(file.scormid == undefined) { // redefine the dirPath if the file is a scorm package
						MoodleMobApp.WebService.getFile(
							file,
							dirPath,
							function(fileEntry) {
								successCallback(fileEntry);
							},
							MoodleMobApp.Session.getCourse().get('token')
						);
					} else {
						MoodleMobApp.WebService.getScorm(
							file,
							dirPath,
							function(fileEntry) {
								successCallback(fileEntry);
							},
							MoodleMobApp.Session.getCourse().get('token')
						);
					}
				} else {
					Ext.Msg.alert(
						'File not available',
						'The file' + file.name + ' is not available in the cache. No connection available so it is not possibile to download it at this time.'
					);
				}
			};

			if(file.mime == 'application/zip') {
				// download the archive, extract it and open it
				fetchFunction(function(fileEntry) {
					var outputDirectory = fileEntry.toURL().substring(0, fileEntry.toURL().lastIndexOf('.zip'));
					zip.unzip(
						fileEntry.toURL(),
						outputDirectory,
						function(arg){
							console.log(' >>>>>>>>>>> callback called with arg: ' + arg);
							console.log(' >>>>>>>>>>> extracting filepath: ' + filePath);
							console.log(' >>>>>>>>>>> extracting directory output: ' + outputDirectory);
							if(arg == 0) { // success
								console.log('archive extracted yaaay');
								fileDownloadedCallback(fileEntry);
								MoodleMobApp.FileSystem.removeFile(
									filePath,
										function(arg) {
											console.log('archive removed'); console.log(arg);
										},
										function(error){
											Ext.Msg.alert(
												'Removing File',
												'Removing the file: '+ filePath +' failed! Code: ' + error.code
											);
											console.log('removing the archive failed'); console.log(error);
										}
								);
								MoodleMobApp.FileSystem.createFile(
									dirPath+'/_archive_extracted_',
									function(arg) {
										console.log('flag created'); console.log(arg);
									},
									function(error){
										Ext.Msg.alert(
											'Extracting Zip File',
											'Registering the extraction of the zip file: '+ filePath +' failed! Code: ' + error.code
										);
										console.log('creating the flag failed'); console.log(error);
									});
							} else {
								Ext.Msg.alert(
									'File extraction failed',
									'The file ' + file.name + ' could not be extracted. Please check your storage space.'
								);
							}
						}
					);
				});
			} else {
				// try to open the file
				// if the file cannot be opened try to download it and then open it
				MoodleMobApp.FileSystem.getFile(
					filePath,
					fileDownloadedCallback,
					function(error) {
						fetchFunction(function(fileEntry) {
							fileDownloadedCallback(fileEntry);
						});
					});
			}
		}; // download() end

		var confirmDowload = function() {
			// Ask the user to confirm the download if the user has not set yet the 
			// justdownload preference.
			if(MoodleMobApp.Session.getSettingsStore().first().get('justdownload') != true) {
				var msgBox = Ext.create('Ext.MessageBox', {
					maxWidth: '95%',
					items: [
						{
							xtype: 'checkboxfield',
							style: 'background-color: black',
							labelCls: 'messagebox-checkbox',
							labelWidth: '80%',
							labelWrap: true,
							label: "Download without asking again.",
							docked: 'bottom',
							listeners: {
								check: function() {
									MoodleMobApp.Session.getSettingsStore().first().set('justdownload', true);
									MoodleMobApp.Session.getSettingsStore().sync();
								},
								uncheck: function() {
									MoodleMobApp.Session.getSettingsStore().first().set('justdownload', false);
									MoodleMobApp.Session.getSettingsStore().sync();
								}
							}
						}
					]
				});

				var message = 'Do you want to download this file. <br /> ';
					message+= file.name + ' ' + Math.ceil(file.size/1000) + 'KB';
				msgBox.confirm('Please confirm', message, function(answer) {
					if(answer == 'yes') {
						startDownload();
					}
				});
			} else { // the user has set the preference to just downlad files without being asked: justdownload is set to true
				startDownload();
			}
		}; // confirmDowload() end

		// try to open the file
		// if the file is not in the cache ask the user to confirm the download
		this.findCachedFile(
			file,
			function(fileEntry) {
				fileDownloadedCallback(fileEntry);
			},
			function(error) {
				confirmDowload();
			}
		);
	},

	findCachedFile: function(file, successCallback, failureCallback) {
		file.name = this.standardizeFileName(file.name);
		var dirPath = this.buildDirPath(file);
		var filePath = '';

		if(file.mime == 'inode/directory') { // check if the folder is cached
			this.folder_is_cached = true;
			var files = [];
			MoodleMobApp.Session.getFoldersStore().each(
				function(file_entry) {
					if( 
						file_entry.get('rootid') === file.rootid &&
						file_entry.get('courseid') == MoodleMobApp.Session.getCourse().get('id') &&
						file_entry.get('mime') != 'inode/directory'
					) {
						files.push({
							name: file_entry.get('name'),
							fileid: file_entry.get('fileid'),
							mime: file_entry.get('mime'),
							size: file_entry.get('size')
						});
					}
				}, this
			);
			if(files.length > 0) { // there are files in the folder; check them
				var nextFileCheckFunction = function() {
					if(files.length > 0) { // check the next file
						var subfile = files.pop();
						MoodleMobApp.Session.getDownloader().findCachedFile(subfile, nextFileCheckFunction, failureCallback);
					} else { // there are no more files to check; all the files are already cached
						successCallback();
					}
				}
				// start che check
				return this.findCachedFile(
					files.pop(), // first subfile
					nextFileCheckFunction,
					failureCallback // there is at least one file that is not cached yet; stop searching further
				);
			} else { // there are no files in this folder so just ignore it as it was already cached
				successCallback();
			}
		} else if(file.mime == 'application/zip') {
			// check if the archive as already been extracted.
			// if the archive has been extracted open the filebrowser
			// else download the archive, extract it and open it.
			filePath = dirPath + '/_archive_extracted_'
		} else {
			filePath = dirPath + '/' + file.name;
		}
		console.log('search cached file: ' + filePath);
		// search for the file
		MoodleMobApp.FileSystem.getFile(
			filePath,
			successCallback,
			failureCallback
		);
	},

	standardizeFileName: function(name) {
		//return name.split(' ').join('_').latinise().replace(/[^a-zA-Z0-9\.]/g, '_');
		return name.latinise().replace(/[^a-zA-Z0-9\.]/g, '_');
	},

	buildDirPath: function(file) {
		var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id');
		if(file.scormid != undefined) { // redefine the dirPath if the file is a scorm package
			dirPath += '/scorm/' + file.moduleid;
		} else {
			dirPath += '/file/' + file.fileid;
		}
		return dirPath;
	}
});
