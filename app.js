//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'MoodleMobApp': 'app',
    'Supsi':   'extensions/supsi'
});
//</debug>

Ext.application({
    name: 'MoodleMobApp',

    requires: [
        'Ext.MessageBox',
		'Ext.TitleBar',
		'Ext.Img',
		'Ext.data.identifier.Uuid',
		'MoodleMobApp.FileSystem',
		'MoodleMobApp.Config',
		'MoodleMobApp.Session',
		'MoodleMobApp.WebService',
		'MoodleMobApp.store.HomeOrgs'
    ],

	models: [
		"MoodleMobApp.model.Settings",
		"MoodleMobApp.model.AaiAccount",
		"MoodleMobApp.model.ManualAccount"
	],

	views: [
		'MoodleMobApp.view.About',
		'MoodleMobApp.view.UsageAgreement',
		'MoodleMobApp.view.Settings',
		'MoodleMobApp.view.CourseNavigator',
		'MoodleMobApp.view.CourseList',
		'MoodleMobApp.view.Course',
		'MoodleMobApp.view.Scorm',
		'MoodleMobApp.view.FileSlot'
	],

	controllers: [
		'MoodleMobApp.controller.Init',
		'MoodleMobApp.controller.Updater',
		'MoodleMobApp.controller.UsageAgreement',
		'MoodleMobApp.controller.Settings',
		'MoodleMobApp.controller.AaiAccount',
		'MoodleMobApp.controller.ManualAccount',
		'MoodleMobApp.controller.CourseNavigator',
		'MoodleMobApp.controller.Assignment', // legacy assignment
		'MoodleMobApp.controller.Assign',
		'MoodleMobApp.controller.Forum',
		'MoodleMobApp.controller.Folder',
		'MoodleMobApp.controller.Resource',
		'MoodleMobApp.controller.Choice',
		'MoodleMobApp.controller.Url',
		'MoodleMobApp.controller.Page',
		'MoodleMobApp.controller.Book',
		'MoodleMobApp.controller.Scorm',
		'MoodleMobApp.controller.ScormMetadataPanel',
		'MoodleMobApp.controller.ScormSettings',
		'MoodleMobApp.controller.ScormPlayer',
		'MoodleMobApp.controller.Quiz',
		'MoodleMobApp.controller.Workshop',
		'MoodleMobApp.controller.Database',
		'MoodleMobApp.controller.Glossary',
		'MoodleMobApp.controller.Wiki',
		'MoodleMobApp.controller.Feedback',
		'MoodleMobApp.controller.FileBrowser'
	],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
		// app log
		/*
		console._log = console.log;
		console.log = function(msg){
			if(MoodleMobApp.Config.getVerbose()) {
				console._log(msg);
			}
		};

		console._error = console.error;
		console.error = function(msg, obj){
			if(MoodleMobApp.Config.getVerbose()) {
				console._error(msg, obj);
			}
		};
		*/

		// add the architecture related extensions
		// this code is located under js/[arch]/extensions.js
		addExtensions();

        // Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingHeader').destroy();
		Ext.fly('appLoadingIndicator').destroy();

		// check if the usage agreement has been accepted or the account has been set
		if( MoodleMobApp.Session.getSettingsStore().first().getData().usageagreement == false ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.UsageAgreement'));
		} else if( MoodleMobApp.Session.getSettingsStore().first().getData().accounttype == '' ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.Settings'));
		} else {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.CourseNavigator'));
		}

		// Catch anchor clicks. Force opening in new windows.
		Ext.Viewport.element.dom.addEventListener('click', function (e) {
			if (e.target.tagName !== 'A') {
				return;
			} else {
				e.preventDefault();
				var href = e.target.getAttribute('href');
				window.open(href, '_blank');
			}
		}, false);

		// The previous click listener is not enough to cover all the cases
		// where the app content is replaced do to the window.location.href navigation.
		// So this piece of code warns the user when the navigation breaks the app.
		// This happens with the youtube videos where the window.location.href is used
		// to navigate to the youtube page.
		window.onbeforeunload = function (e) {
			var message = "This content is going to be loaded in place of the app content. After the page has been loaded navigating back to the app is not going to be possible anymore.",
			e = e || window.event;
			// For IE and Firefox
			if (e) {
			  e.returnValue = message;
			}

			// For Safari
			return message;
		};

		// periodic network checker
		setInterval(MoodleMobApp.app.isConnectionAvailable, 1000);
		MoodleMobApp.app.isContentUpdatedInterval = setInterval(MoodleMobApp.app.isContentUpdated, 1000);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

	// file is an object such as:
	// {"name": "filename", "fileid": "file id number", "mime":"mime/type", size: 32122}
	// the fileDownloadedCallback is called after the file has been fetched
	downloadFile: function(file, fileDownloadedCallback) {
		// prepare the filePath
		file.name = file.name.split(' ').join('_');
		file.name = file.name.latinise();
		var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + file.fileid;
		var filePath = dirPath + '/' + file.name;

		// this function is called after the user has confirmed the download
		var startDownload = function() {
			var fetchFunction = function(successCallback) {
				if(MoodleMobApp.app.isConnectionAvailable()) {
					MoodleMobApp.WebService.getFile(
							file,
							dirPath,
							function(fileEntry) {
								successCallback(fileEntry);
								fileDownloadedCallback();
							},
							MoodleMobApp.Session.getCourse().get('token')
						);
				} else {
					Ext.Msg.alert(
						'File not available',
						'The file' + file.name + ' is not available in the cache. No connection available so it is not possibile to download it at this time.'
					);
				}
			};

			if(file.mime == 'application/zip') {
				var archiveExtractedFlag = dirPath + '/_archive_extracted_'
				// check if the archive as already been extracted.
				// if the archive has been extracted open the filebrowser
				// else download the archive, extract it and open it.
				MoodleMobApp.FileSystem.getFile(
					archiveExtractedFlag,
					function(fileEntry) {
						// open the archive
						MoodleMobApp.app.getController('FileBrowser').openDirectory(filePath.substring(0, filePath.lastIndexOf('.zip')));
					},
					function(error) {
						// download the archive, extract it and open it
						fetchFunction(function(fileEntry) {
							Ext.fe = fileEntry;
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
										MoodleMobApp.app.getController('FileBrowser').openDirectory(filePath.substring(0, filePath.lastIndexOf('.zip')));
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
					});
			} else {
				// try to open the file
				// if the file cannot be opened try to download it and then open it
				MoodleMobApp.FileSystem.getFile(
					filePath,
					function(fileEntry) {
						MoodleMobApp.app.openFile(fileEntry.toNativeURL(), file.mime);
					},
					function(error) {
						fetchFunction(function(fileEntry) {
							MoodleMobApp.app.openFile(fileEntry.toNativeURL(), file.mime);
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
		MoodleMobApp.FileSystem.getFile(
			filePath,
			function(fileEntry) {
				MoodleMobApp.app.openFile(fileEntry.toNativeURL(), file.mime);
			},
			function(error) {
				confirmDowload();
			});
	},

	isLoadMaskVisible: function() {
		return Ext.Viewport.getActiveItem().getMasked() == null || Ext.Viewport.getActiveItem().getMasked().isHidden();
	},

	showLoadMask: function(msg) {
		Ext.Viewport.getActiveItem().setMasked({
			xtype: 'loadmask',
			message: msg
		});
	},

	updateLoadMaskMessage: function(msg) {
		Ext.Viewport.getActiveItem().getMasked().setMessage(msg);
	},

	hideLoadMask: function() {
		if(Ext.Viewport.getActiveItem().setMasked != undefined) {
			Ext.Viewport.getActiveItem().setMasked(false);
		}
	},

	readFile: function(path, successFunc, params) {
		var gotFile = function(file) {
			var reader = new FileReader();
			// success
			reader.onload = function(evt) {
				successFunc(evt.target.result+'', params);
			};

			// failure
			reader.onerror = function(error) {
				Ext.Msg.alert(
					'Read File',
					'Reading the file failed! Code: ' + error.code
				);
			};

			// read file data base64 encoded
			reader.readAsDataURL(file);
		};

		// check the file entry
		var gotFileEntry = function(fileEntry) {
			fileEntry.file(
				gotFile,
				function(){
					Ext.Msg.alert(
						'Read File',
						'Getting the File Entry failed'
					);
				}
			);
		};

		var gotFS = function(fileSystem) {
			// get the file entry
			return fileSystem.root.getFile(
				path,
				null,
				gotFileEntry,
				function(){
					Ext.Msg.alert(
						'Read File',
						'Getting the file failed! Path: ' + path
					);
				});
		}

		return window.requestFileSystem(
			LocalFileSystem.PERSISTENT,
			0,
			gotFS,
			function(evt){
				Ext.Msg.alert(
					'Read File',
					'File System request failed! Code: ' + evt.target.error.code
				);
			}
		);
	},

	formatDate: function(timestamp) {
		var date = new Date(timestamp*1000);
		//return date.toLocaleString();
		var curr_day = date.getDate();
		var sup = "";
		if (curr_day == 1 || curr_day == 21 || curr_day ==31) {
		   sup = "st";
		} else if (curr_day == 2 || curr_day == 22) {
		   sup = "nd";
		} else if (curr_day == 3 || curr_day == 23) {
		   sup = "rd";
		} else {
		   sup = "th";
		}
		var curr_month = date.getMonth();
		var curr_year = date.getFullYear();
		var curr_hour = date.getHours();
		if(curr_hour < 10) {
			curr_hour = '0' + curr_hour;
		}
		var curr_min = date.getMinutes();
		if(curr_min < 10) {
			curr_min = '0' + curr_min;
		}
		var formated_date = curr_day + "<sup>" + sup + "</sup> ";
			formated_date+= Ext.Date.monthNames[curr_month] + " " + curr_year + " ";
			formated_date+= curr_hour + ":" + curr_min;
		return formated_date;
	},

	sendEmail: function(to) { },
	sendSms: function(to) { },
	phone: function(num) { },
	startSkype: function(list) { },

	openURL: function(urladdr) {
		console.log('===> Opening URL: '+urladdr);
		return window.open(urladdr, '_blank', 'location=yes,enableViewportScale=yes');
	},

	openFile: function(path, mimetype) { },

	calculateDownloadPercentage: function(progressEvent) { },

	isConnectionAvailable: function() {
		if (
			navigator.userAgent.match(/(iPhone|iPod|iPad)/) ||
			navigator.userAgent.match(/Android/)
		) { // check connection
			//console.log(':::::::: CONNECTION CHECK :: Connection type: ' + navigator.connection.type);
			if(navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN ) {
				if(!MoodleMobApp.Session.getConnectionAvailabilityWarningIssued()) {
					Ext.Msg.alert(
						'Connection',
						'No connection available. Cannot contact the server.'
					);
					// hide the loading screen if available
					// in order to avoid the loading screen blocking the app
					MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(true);
				}
				MoodleMobApp.app.hideLoadMask();
				return false;
			} else {
				MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(false);
				return true;
			}
		} else { // assume the app runs on the pc browser
			return true;
		}
	},

	isContentUpdated: function() {
		if(MoodleMobApp.Session.getContentUpdateStatus() == false && MoodleMobApp.app.isConnectionAvailable()) {
			// register that the content has been updated in the session
			MoodleMobApp.Session.setContentUpdateStatus(true);
			clearInterval(MoodleMobApp.app.isContentUpdatedInterval);
			MoodleMobApp.app.getController('ManualAccount').attemptAuthentication();
			MoodleMobApp.app.getController('AaiAccount').attemptAuthentication();
		}
	}
});
