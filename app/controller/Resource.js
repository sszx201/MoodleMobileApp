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
				winref = this.openHtmlResource(MoodleMobApp.Config.getResourceViewUrl()+'?id='+record.get('id'), record.get('display'));
			} else {
				this.getFile(resource, target);
			}
		}
	},

	getFile: function(resource, target){
		var file = {
			name: resource.get('filename'),
			fileid: resource.get('fileid'),
			mime: resource.get('filemime')
		};
		MoodleMobApp.app.downloadFile(file, function() { target.setCached(true); });
	},
	// processes the page and extracts the content the best way possible
	openHtmlResource: function(urladdr, displayMode) {
		console.log('===> PROCESSING URL: '+urladdr);
		MoodleMobApp.app.showLoadMask('Loading Resource');
		var winref = window.open(urladdr, '_blank', 'location=yes,hidden=yes,enableViewportScale=yes');
		Ext.winref = winref;
		winref.addEventListener('loaderror', function(error) {
			console.error('Opening the platform page was not possible due to an error.', error);
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
					console.log('Html Resource: No iframe. filtering the page !!');
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
								console.log('Html Resource: Nothing to see here move on !!');
								MoodleMobApp.app.hideLoadMask();
								winref.show();
							} else {
								console.log('Html Resource: Found a redirect anchor !!');
								MoodleMobApp.app.hideLoadMask();
								MoodleMobApp.app.openURL(href);
							}
						});
					});
				} else {
					console.log('Html Resource: Found an iframe !!');
					MoodleMobApp.app.hideLoadMask();
					MoodleMobApp.app.openURL(url);
				}
			});
		});
	}
});
