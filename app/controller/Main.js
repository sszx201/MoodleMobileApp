Ext.define('MoodleMobApp.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
   
		},
		control: {
			
		}
	},

	init: function(){
		var courses_store = Ext.data.StoreManager.lookup('courses');
		// set listener for updating the course module stats
		courses_store.on('write', this.updateCourseStats, this, {single:true});
	},

	updateCourseStats: function() {
		// 'this' points to the courses_store
		// collect course ids
		var courses_store = Ext.data.StoreManager.lookup('courses');
		var course_ids = new Array();
		courses_store.each(function(entry) {
			course_ids.push(entry.getData().id);
		});
		// set the token for this request
		// any token will do, in this case the token
		// of the first course entry is used
		MoodleMobApp.Session.setCourseToken(courses_store.first().getData().token);
		// request the course modules count
		console.log('loading');
		var course_modules_count_store = MoodleMobApp.WebService.getCourseModulesCount(course_ids);
		course_modules_count_store.on(
				'load', 
				function(){
					console.log('loaded');
					course_modules_count_store.each(function(entry){
						var courses_store_entry = courses_store.getById(entry.getData().id);
						console.log(entry.getData());
						console.log(courses_store_entry.getData());
						courses_store_entry.getData().modulestatus = entry.getData().modulescount + ' modules';
						courses_store_entry.getData().modules = entry.getData().modulescount;
						courses_store_entry.setDirty();
					});
					courses_store.sync();
				},
				this,
				{single: true}
		);

	},

});
