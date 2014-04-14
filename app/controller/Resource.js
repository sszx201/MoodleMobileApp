Ext.define('MoodleMobApp.controller.Resource', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			recentActivity: 'recentactivitylist'
        },
        control: {
			// generic controls
			module: { itemtap: 'selectModule' },
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'resource') {
						var resource_record = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'));
						console.log(resource_record.getData());
						if(resource_record != undefined) {
							this.getFile(resource_record);
						}
					}
				}
			}
        }
    },
    
	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'resource'){
			var resource = MoodleMobApp.Session.getResourcesStore().findRecord('id', record.get('instanceid'), 0, false, true, true);
			if(resource.get('filemime').indexOf('html') !== -1) {
				//winref = MoodleMobApp.app.openMoodlePage(MoodleMobApp.Config.getResourceViewUrl()+'?id='+record.get('id'), record.get('display'));
				winref = this.openHtmlResource(MoodleMobApp.Config.getResourceViewUrl()+'?id='+record.get('id'), record.get('display'));
			} else {
				this.getFile(resource);
			}
		}
	},

	getFile: function(resource){
		var file = {
			name: resource.get('filename'),
			fileid: resource.get('fileid'),
			mime: resource.get('filemime')
		};
		MoodleMobApp.app.downloadFile(file);
	},

	// processes the page and extracts the content the best way possible
	openHtmlResource: function(urladdr, displayMode) {
		console.log('===> PROCESSING URL: '+urladdr);
		MoodleMobApp.app.showLoadMask('Loading Resource');
		var winref = window.open(urladdr, '_blank', 'location=yes,hidden=yes,enableViewportScale=yes');
		Ext.winref = winref;
		winref.addEventListener('loaderror', function(error) {
			console.log(error);
			MoodleMobApp.app.hideLoadMask();
			Ext.Msg.alert(
				'ERROR: opening platform page',
				'Opening the platform page was not possible due to an error.'
			);
		});
		winref.addEventListener('loadstop', function() {
			var iframe_check = "document.getElementsByTagName('iframe').length == 0 ? null : document.getElementsByTagName('iframe').item(0).src";
			winref.executeScript({code: iframe_check}, function(result) {
				var url = result.pop();
				if(url == null || url == '') {
					console.log('NO IFRAME FILTERING THE PAGE !!');
					var filter = "#page-header, #region-pre, #region-pre-logo, #region-post, #page-footer, .navbar { display: none}";
						filter+= "#wrapper, #page-content #region-main-wrap { margin: 0 !important; max-width: 100%; }";
					winref.insertCSS({code: filter}, function(result) {
						var anchor_check = 'var anchor, workaround = document.getElementsByClassName("resourceworkaround");';
							anchor_check+= 'if(workaround.length == 0) {';
							anchor_check+= '	null;';
							anchor_check+= '} else {';
							anchor_check+= '	anchor = workaround.item(0).getElementsByTagName("a");';
							anchor_check+= '	if(anchor == null || anchor.length == 0) {';
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
