Ext.define('MoodleMobApp.controller.Quiz', {
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
					if(record.get('modname') == 'quiz') {
						return;
						this.openQuiz(record);
					}
				}
			}
        }
    },

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'quiz'){
			this.openQuiz(record);
		}
	},
    
	// processes the page and extracts the content the best way possible
	openQuiz: function(record) {
		console.log('===> PROCESSING Quiz: ');
		console.log(record.getData());
		if(MoodleMobApp.app.isConnectionAvailable()) {
			MoodleMobApp.app.showLoadMask('Loading Quiz');
			var winref = window.open(MoodleMobApp.Config.getQuizViewUrl()+'?id='+record.get('id'), '_blank', 'location=yes,hidden=yes,enableViewportScale=yes');
			Ext.winref = winref;

			//winref.addEventListener('loadstart', function(error) { MoodleMobApp.app.showLoadMask('Contacting the server'); });

			winref.addEventListener('exit', function(error) {
				MoodleMobApp.app.hideLoadMask();
			});

			winref.addEventListener('loaderror', function(error) {
				console.log(error);
				Ext.Msg.alert(
					'ERROR: opening platform page',
					'Message: ' + error.message
				);
			});
			winref.addEventListener('loadstop', function() {
				var iframe_check = "document.getElementsByTagName('iframe').length == 0 ? null : document.getElementsByTagName('iframe').item(0).src";
				winref.executeScript({code: iframe_check}, function(result) {
					var url = result.pop();
					if(url == null || url == '') {
						console.log('NO IFRAME FILTERING THE PAGE !!');
						var filter = "#page-header, #region-pre, #region-pre-logo, #region-post *, #page-footer, .navbar { display: none }";
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
									winref = MoodleMobApp.app.openURL(href);
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
	}
});
