(function(){
	var
		db
	;
	Ext.define('Supsi.Database', {
		fromScratch: true,
		singleton: true,
		initMetadataDictionary: function(tx, results){
			console.log('returned %d rows', results.rows.length)
		},
		dropTables: function(tx){
			tx.executeSql('DROP TABLE IF EXISTS SCORM');
			tx.executeSql('DROP TABLE IF EXISTS RESOURCE');
			tx.executeSql('DROP TABLE IF EXISTS METADATA_DICTIONARY');
			tx.executeSql('DROP TABLE IF EXISTS METADATA');
		},
		createTables: function(tx){

			this.fromScratch && this.dropTables(tx);

			// SCORM
			tx.executeSql('CREATE TABLE IF NOT EXISTS SCORM (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT)');

			// RESOURCE
			tx.executeSql('CREATE TABLE IF NOT EXISTS RESOURCE (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, scormid INTEGER, url TEXT, FOREIGN KEY(scormid) REFERENCES SCORM(id))');

			// DICTIONARY
			tx.executeSql('CREATE TABLE IF NOT EXISTS METADATA_DICTIONARY (id INTEGER NOT NULL PRIMARY KEY, description TEXT)');

			// METADATA
			tx.executeSql('CREATE TABLE IF NOT EXISTS METADATA (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, resourceid INTEGER, idx INTEGER, data TEXT, type INTEGER, timestamp DATE, FOREIGN KEY(type) REFERENCES METADATA_DICTIONARY(id), FOREIGN KEY(resourceid) REFERENCES RESOURCE(id))');


//			tx.executeSql('INSERT INTO SCORM (url) VALUES ("about:blank")');

			tx.executeSql('SELECT COUNT(id) as count FROM METADATA_DICTIONARY', [], this.initMetadataDictionary, this.onDbError);

		},
		_selectResourcesByScormId: function(args){
			var that = this;
//			args.tx.executeSql('SELECT idx, data, type, timestamp, RESOURCE.url FROM METADATA where METADATA.resourceid in (SELECT id, url from RESOURCE WHERE RESOURCE.scormid = ?) ', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id JOIN (SELECT id from SCORM where SCORM.url = ?) y ON RESOURCE.scormid = y.id', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id and RESOURCE.scormid in (SELECT id from SCORM where SCORM.url = ?)', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id', [],
			args.tx.executeSql('SELECT METADATA.id metaId, METADATA.idx, METADATA.type, METADATA.timestamp, METADATA.data, agg.url FROM (SELECT id, url FROM RESOURCE WHERE RESOURCE.scormid IN (SELECT id FROM SCORM WHERE url = ?)) agg INNER JOIN METADATA ON METADATA.resourceid = agg.id', [args.scormId],
//			args.tx.executeSql('SELECT * from METADATA', [],
//			args.tx.executeSql('SELECT * FROM METADATA ', [],
				function(tx, results){
					console.log('metadata extraction ok, results = ', results.rows.length);
					for(var i = 0, l = results.rows.length; i < l; i++){
						console.log('results: ', results.rows.item(i))
					}
//					that._checkScormExistence(args, results)
				}, function(tx, err){
					args.errback.apply(null, arguments);
				}
			);
			args.tx.executeSql('SELECT * from RESOURCE', [],
//			args.tx.executeSql('SELECT * FROM METADATA ', [],
				function(tx, results){
					console.log('resource extraction ok, results = ', results.rows.length);
					for(var i = 0, l = results.rows.length; i < l; i++){
						console.log('results: ', results.rows.item(i))
					}
//					that._checkScormExistence(args, results)
				}, function(tx, err){
					console.error('----------- ', err.message)
					args.errback.apply(null, arguments)
				}
			);
			args.tx.executeSql('SELECT * from SCORM', [],
//			args.tx.executeSql('SELECT * FROM METADATA ', [],
				function(tx, results){
					console.log('scorm extraction ok, results = ', results.rows.length);
					for(var i = 0, l = results.rows.length; i < l; i++){
						console.log('results: ', results.rows.item(i))
					}
//					that._checkScormExistence(args, results)
				}, function(tx, err){
					console.error('----------- ', err.message)
					args.errback.apply(null, arguments)
				}
			);

		},
		/**
		 * select the resources list for the given scorm
		 * */
		selectResourcesByScormId: function(args){
			// todo: usare una prepareTransaction o qualcosa del genere per questo tipo di funzione
			var that = this;
			db.transaction(function(tx){ args.tx = tx; that._selectResourcesByScormId(args) },
				function(err){
					console.error('error initialising the selectResourcesByScormId transaction, error', err);
					args.errback.apply(null, arguments);
				},
				function(){
					// nothing to do
				}
			);

		},

		/**
		 * generic error callback
		 * */
		onDbError: function(tx, err){
			console.error('Error reading the db: ', err);
		},

		_checkScormExistence: function(args, results){
			var that = this;
			switch(results.rows.item(0).count){
				case 0:
					// insert here
					console.log('trying to insert data, SCORM.url = ', args.scormId)
					args.tx.executeSql('INSERT INTO SCORM (url) VALUES (?)', [args.scormId], function(){
						that._findResourceById(args);
					}, this.onDbError);
					break;
				default:
					// ok, find the related resource
					this._findResourceById(args);
					break;

			}

		},
		_findResourceById: function(args){
			var that = this;
			args.tx.executeSql('SELECT COUNT(id) as count FROM RESOURCE WHERE RESOURCE.url = ?', [args.resId],
				function(tx, results){
					that._checkResExistence(args, results)
				}, function(){
					args.errback.apply(null, arguments)
				}
			);
		},
		_resourceInserted: function(args){
			console.log('resource insertion [ ok ]');
		},
		_insertResource: function(args){
			var that = this;
			args.tx.executeSql('INSERT INTO METADATA (resourceid, data, type) SELECT id, ?, ? from RESOURCE where RESOURCE.url = ?', ['', args.type, args.resId], function(){
				that._resourceInserted(args);
				args.cback.apply(null, arguments);
			}, function(){
				that.onDbError.apply(that, arguments);
				args.errback.apply(null, arguments);

			});

		},
		_checkResExistence: function(args, results){
			var that = this;
			switch(results.rows.item(0).count){
				case 0:
					// insert the resource here here
					args.tx.executeSql('INSERT INTO RESOURCE (scormid, url)  SELECT id, ? from SCORM where SCORM.url = ?', [args.resId, args.scormId], function(){
						that._insertResource(args);
					}, this.onDbError);
					break;
				default:
					// insert here
					that._insertResource(args);
					break;

			}

		},

		/**
		 * save the metadata
		 * {Object} args
		 * */
		saveMetadata: function(args){
			var
				errback = args.errback || function(){}, that = this
			;

			// nonsense: now the errback is the first function passed in...
			db.transaction(function(tx){ args.tx = tx; that._saveMeta(args) },
				function(err){
					console.error('error initialising the _saveMeta transaction, error', err);
					errback.apply(null, arguments);
				},
					function(){
						// nothing to do
					}
				);
		},
		_saveMeta: function(args){
			var that = this;
			args.tx.executeSql('SELECT COUNT(id) as count FROM SCORM WHERE SCORM.url = ?', [args.scormId],
				function(tx, results){
					that._checkScormExistence(args, results)
				}, function(){
					args.errback.apply(null, arguments)
				}
			);
		},

		/**
		 * initialization
		 * */
		initMetadataDictionary: function(tx, res){
			var count = res.rows.item(0).count;
//			!count && tx.executeSql('INSERT INTO METADATA_DICTIONARY (id, description) VALUES (0, \'bookmark\'), (1, \'highlight\'), (2, \'annotation\')', [], this.initMetadataDictionary, this.onDbError);
			!count && tx.executeSql('INSERT INTO METADATA_DICTIONARY (id, description) VALUES (?, ?)', [0, 'bookmark'], null, this.onDbError);
			!count && tx.executeSql('INSERT INTO METADATA_DICTIONARY (id, description) VALUES (?, ?)', [1, 'highlight'], null, this.onDbError);
			!count && tx.executeSql('INSERT INTO METADATA_DICTIONARY (id, description) VALUES (?, ?)', [2, 'annotation'], null, this.onDbError);
		},
		onCreateError: function(err){
			console.error('db creation error: ', err);
		},
		onCreate: function(){
			console.log('db creation ok');
		},
		initialize: function(){
			// todo: acc, questa roba non va su ios7, nel browser.
			// su phonegap si spacca tutto
//			return;
			var that = this;
//			db = window.openDatabase("scormreader", "1.0", "Scorm Reader DB", 10000000);
			db = window.openDatabase("scormreader", "1.0", "Scorm Reader DB", 100000);
			db.transaction(function(){ that.createTables.apply(that, arguments); }, this.onCreateError, this.onCreate);

			console.log('database initialization ok');
			//
		}
	});
	// Supsi.Database.initialize();
})();
