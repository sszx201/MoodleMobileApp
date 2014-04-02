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
		"MoodleMobApp.model.Profile",
		"MoodleMobApp.model.AaiAccount",
		"MoodleMobApp.model.ManualAccount"
	],

	views: [
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
		'MoodleMobApp.controller.Main',
		'MoodleMobApp.controller.UsageAgreement',
		'MoodleMobApp.controller.Settings',
		'MoodleMobApp.controller.Account',
		'MoodleMobApp.controller.AaiAccount',
		'MoodleMobApp.controller.ManualAccount',
		'MoodleMobApp.controller.CourseNavigator',
		'MoodleMobApp.controller.Assignment',
		'MoodleMobApp.controller.Assign', // moodle 2.4 assignment
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
		'MoodleMobApp.controller.ScormPlayer'
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
		// add the architecture related extensions
		// this code is located under js/[arch]/extensions.js
		addExtensions();
        // Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingHeader').destroy();
		Ext.fly('appLoadingIndicator').destroy();


		if( MoodleMobApp.Session.getSettingsStore().first().getData().usageagreement == false ) {
			Ext.Viewport.add( Ext.create('MoodleMobApp.view.UsageAgreement') );
		} else if( MoodleMobApp.Session.getSettingsStore().first().getData().accounttype == '' ) {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.Settings'));
		} else {
			Ext.Viewport.add(Ext.create('MoodleMobApp.view.CourseNavigator'));
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
		}
		// ios 7 bar fix
		if( window.device != undefined && parseInt(window.device.version) > 6 ) {
			document.body.style.backgroundColor = "white";
			document.getElementById('course_navigator').style.marginTop = "20px";
		}

		// periodic network checker
		setInterval(MoodleMobApp.app.isConnectionAvailable, 1000);
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
	// {"name": "filename", "id": "file id number", "mime":"mime/type"}
	downloadFile: function(file) {
		var dirPath = MoodleMobApp.Config.getFileCacheDir() + '/' + MoodleMobApp.Session.getCourse().get('id') + '/file/' + file.fileid;
		if(MoodleMobApp.app.isConnectionAvailable()) {
			// success function
			var successFunc = function(fileEntry) {
				//MoodleMobApp.app.hideLoadMask();
				MoodleMobApp.app.openFile(fileEntry.toNativeURL(), file.mime);
			};

			MoodleMobApp.WebService.getFile(
				file,
				dirPath,
				successFunc,
				MoodleMobApp.Session.getCourse().get('token')
			);
		} else {
			MoodleMobApp.app.openCacheFile(file, dirPath);
		}
	},

	openCacheFile: function(file, dir) {
		var self = this;
		window.requestFileSystem(
			LocalFileSystem.PERSISTENT, 0,
			function onFileSystemSuccess(fileSystem) {
				// get the filesystem
				fileSystem.root.getFile(
					dir + '/' + file.name,
					{
						create: false,
						exclusive: false
					},
					// success callback: remove the previous file
					function gotFileEntry(fileEntry) {
						MoodleMobApp.app.openFile(fileEntry.toNativeURL(), file.mime);
					},
					// error callback: notify the error
					function(){
						Ext.Msg.alert(
							'File not available',
							'The file' + file.name + ' is not available in the cache. No connection available so it is not possibile to download it at this time.'
						);
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

	sendEmail: function(to, subject, body) { },

	openURL: function(urladdr) {
		console.log('===> Opening URL: '+urladdr);
		return window.open(urladdr, '_blank', 'location=yes,enableViewportScale=yes');
		return ref;
	},

	unzip: function(filePath, successFunc, failFunc) { },

	openFile: function(path, mimetype) { },

	calculateDownloadPercentage: function(progressEvent) { },

	isConnectionAvailable: function() {
		if (
			navigator.userAgent.match(/(iPhone|iPod|iPad)/) ||
			navigator.userAgent.match(/Android/)
		) { // check connection
			if(navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN ) {
				if(!MoodleMobApp.Session.getConnectionAvailabilityWarningIssued()) {
					Ext.Msg.alert(
						'Connection',
						'No connection available. Cannot contact the server.'
					);
					// hide the loading screen if available
					// in order to avoid the loading screen blocking the app
					MoodleMobApp.app.hideLoadMask();
					MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(true);
				}
				return false;
			} else {
				MoodleMobApp.Session.setConnectionAvailabilityWarningIssued(false);
				return true;
			}
		} else { // assume the app runs on the pc browser
			return true;
		}
	},

	dump: function(obj) {
		console.log(JSON.stringify(obj));
	},

	// processes the page and extracts the content the best way possible
	openMoodlePage: function(urladdr, displayMode) {
		console.log('===> PROCESSING URL: '+urladdr);
		MoodleMobApp.app.showLoadMask('Loading Resource');
		var winref = window.open(urladdr, '_blank', 'location=yes,hidden=yes,enableViewportScale=yes');
		Ext.winref = winref;
		winref.addEventListener('loaderror', function(error) {
			console.log(error);
			MoodleMobApp.app.hideLoadMask();
			Ext.Msg.alert(
				'ERROR: ppening platform page',
				'Opening the platform page was not possible due to an error.'
			);
		});
		winref.addEventListener('loadstop', function() {
			var iframe_check = "document.getElementsByTagName('iframe').length == 0 ? null : document.getElementsByTagName('iframe').item(0).src";
			winref.executeScript({code: iframe_check}, function(result) {
				var url = result.pop();
				if(url == null) {
					console.log('NO IFRAME FILTERING THE PAGE !!');
					var filter = "#page-header, #region-pre, #region-pre-logo, #region-post, #page-footer, .navbar { display: none}";
					winref.insertCSS({code: filter}, function(result) {
						var anchor_check = 'var anchor, workaround = document.getElementsByClassName("resourceworkaround");';
							anchor_check+= 'if(workaround.length == 0) {';
							anchor_check+= '	null;';
							anchor_check+= '} else {';
							anchor_check+= '	anchor = workaround.item(0).getElementsByTagName("a");';
							anchor_check+= '	if(anchor == null) {';
							anchor_check+= '		null;';
							anchor_check+= '	} else {';
							anchor_check+= '		anchor.item(0).href;';
							anchor_check+= '	}';
							anchor_check+= '}';
						winref.executeScript({code: anchor_check}, function(result) {
							var href = result.pop();
							if(href == null) {
								console.log('NOTHING TO SEE HERE MOVE ON !!');
								MoodleMobApp.app.hideLoadMask();
								winref.show();
							} else {
								console.log('FOUND A REDIRECT ANCHOR !!');
								MoodleMobApp.app.hideLoadMask();
								MoodleMobApp.app.openURL(href);
							}
						});
					});
				} else {
					console.log('FOUND A IFRAME !!');
					MoodleMobApp.app.hideLoadMask();
					MoodleMobApp.app.openURL(url);
				}
			});
		});
	}
});
