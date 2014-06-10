Ext.define('MoodleMobApp.controller.Workshop', {
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
					if(record.get('modname') == 'workshop') {
						this.openWorkshop(record);
					}
				}
			}
        }
    },

	selectModule: function(view, index, target, record) {
		if(record.get('modname') === 'workshop'){
			this.openWorkshop(record);
		}
	},
    
	// processes the page and extracts the content the best way possible
	openWorkshop: function(record) {
		// console.log('===> PROCESSING Workshop: ');
		// console.log(record.getData());
		if(MoodleMobApp.app.isConnectionAvailable()) {
			MoodleMobApp.app.showLoadMask('Loading Workshop');
			var winref = window.open(MoodleMobApp.Config.getWorkshopViewUrl()+'?id='+record.get('id'), '_blank', 'location=yes,hidden=yes,enableViewportScale=yes');
			Ext.winref = winref;

			//winref.addEventListener('loadstart', function(error) { MoodleMobApp.app.showLoadMask('Contacting the server'); });

			winref.addEventListener('exit', function(error) {
				MoodleMobApp.app.hideLoadMask();
			});

			winref.addEventListener('loaderror', function(error) {
				// console.log(error);
				Ext.Msg.alert(
					'ERROR: opening platform page',
					'Message: ' + error.message
				);
			});
			winref.addEventListener('loadstop', function() {
				var filter = "#page-header, #region-pre, #region-pre-logo, #region-post *, #page-footer, .navbar { display: none }";
					filter+= "#wrapper, #page-content #region-main-wrap { margin: 0 !important; max-width: 100%; }";
				winref.insertCSS({code: filter}, function(result) {
					MoodleMobApp.app.hideLoadMask();
					winref.show();
				});
			});
		}
	}
});
