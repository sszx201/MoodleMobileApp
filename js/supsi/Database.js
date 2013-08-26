(function(){
	var
		db
	;
	Ext.define('Supsi.Database', {
		fromScratch: 0,
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
			tx.executeSql('CREATE TABLE IF NOT EXISTS METADATA (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, resourceid INTEGER, idx INTEGER, data TEXT, fragment TEXT, type INTEGER, timestamp DATE, FOREIGN KEY(type) REFERENCES METADATA_DICTIONARY(id), FOREIGN KEY(resourceid) REFERENCES RESOURCE(id))');


			tx.executeSql('SELECT COUNT(id) as count FROM METADATA_DICTIONARY', [], this.initMetadataDictionary, this.onDbError);

		},
		_selectResourcesByScormId: function(args){
			var that = this;
//			args.tx.executeSql('SELECT idx, data, type, timestamp, RESOURCE.url FROM METADATA where METADATA.resourceid in (SELECT id, url from RESOURCE WHERE RESOURCE.scormid = ?) ', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id JOIN (SELECT id from SCORM where SCORM.url = ?) y ON RESOURCE.scormid = y.id', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id and RESOURCE.scormid in (SELECT id from SCORM where SCORM.url = ?)', [args.scormId],
//			args.tx.executeSql('SELECT METADATA.idx, METADATA.data, METADATA.type, METADATA.timestamp, RESOURCE.url FROM METADATA JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id', [],
			args.tx.executeSql('SELECT METADATA.id metaId, METADATA.idx, METADATA.type, METADATA.timestamp, METADATA.data, METADATA.fragment, agg.url FROM (SELECT id, url FROM RESOURCE WHERE ' +
				'RESOURCE.scormid IN (SELECT id FROM SCORM WHERE url = ?)) agg INNER JOIN METADATA ON METADATA.resourceid = agg.id ORDER BY METADATA.idx', [args.scormId],
//			args.tx.executeSql('SELECT * from METADATA', [],
//			args.tx.executeSql('SELECT * FROM METADATA ', [],
				function(tx, results){
					if(typeof args.cback === 'function'){
						args.cback(results);
					}
//					that._checkScormExistence(args, results)
				}, function(tx, err){
					args.errback.apply(null, arguments);
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
			switch(results.rows.length){
				case 0:
					// insert here
					console.log('trying to insert data, SCORM.url = ', args.scormId);
					args.tx.executeSql('INSERT INTO SCORM (url) VALUES (?)', [args.scormId], function(){
						that._findResourceByUrl(args);
					}, this.onDbError);
					break;
				default:
					// ok, find the related resource
					this._findResourceByUrl(args);
					break;

			}

		},
		_findResourceByUrl: function(args){
			var that = this;
			args.tx.executeSql('SELECT id FROM RESOURCE WHERE RESOURCE.url = ? and RESOURCE.scormid in (SELECT ID FROM SCORM where url = ?)', [args.resId, args.scormId],
				function(tx, results){
					that._checkResExistence(args, results);
				}, function(){
					args.errback.apply(null, arguments);
				}
			);
		},
		findMetaByScormAndResId: function(args){
			var
				errback = args.errback || function(){}, that = this
				;
			db.transaction(function(tx){ console.log('uh?'); args.tx = tx; that._findMetaByScormAndResId(args) },
				function(err){
					console.error('error initialising the _findMetaByScormAndResId transaction, error', err);
					errback.apply(null, arguments);
				},
				function(){
					// nothing to do
				}
			);
		},
		_findMetaByScormAndResId: function(args){
			// todo: continua da qui
			console.log('_findMeta... ', args)
//			args.tx.executeSql('SELECT id FROM RESOURCE WHERE RESOURCE.url = ? and RESOURCE.scormid in (SELECT ID FROM SCORM where url = ?)', [args.resId, args.scormId],
			args.tx.executeSql('SELECT * FROM METADATA INNER JOIN RESOURCE ON METADATA.resourceid = RESOURCE.id WHERE METADATA.url = ? and METADATA.scormid IN (SELECT id from SCORM where SCORM.url = ?)', [args.resId, args.scormId],
				function(tx, results){
					console.log('last query success');
					for(var i = 0, l = results.rows.length; i < l; i++){
						console.log('>>>>> metadata: ', results.rows.item(i));
					}
					typeof args.cback === 'function' && args.cback(results);
				},
			function(error, err){
				console.log('last query fail ', err);
			});

		},
		_resourceInserted: function(args){
			console.log('resource insertion [ ok ]');
		},
		_insertResource: function(args){
			var that = this;
			args.tx.executeSql('SELECT id FROM RESOURCE where RESOURCE.url = ? ', [args.resId], function(tx, results){
				var resId = results.rows.item(0).id;
				args.tx.executeSql('UPDATE METADATA set idx = idx + 1 WHERE resourceid = ? and (type = 1 or type = 2) and idx >= ? ', [resId, args.index], function(tx, results){
//					args.tx.executeSql('INSERT INTO METADATA (resourceid, data, type, idx) SELECT id, ?, ?, ? from RESOURCE where RESOURCE.url = ?', [args.data, args.type, args.index, args.resId], function(){
					args.tx.executeSql('INSERT INTO METADATA (resourceid, data, type, idx, fragment) VALUES(?, ?, ?, ?, ?)', [args._resourceId, args.data, args.type, args.index, args.fragment], function(){
						that._resourceInserted(args);
						args.cback.apply(null, arguments);
					}, function(){
						that.onDbError.apply(that, arguments);
						args.errback.apply(null, arguments);
					});
				},
				function(){

				});
			}, function(){});

		},
		__showRes: function(agrs){
			args.tx.executeSql('SELECT * FROM RESOURCE', [], function(tx, results){
				for(var i = 0, l = results.rows.length; i < l; i++){
					console.log('resource: ', results.rows.item(i))

				}
			}, this.onDbError);
		},
		__showMeta: function(args){
			args.tx.executeSql('SELECT * FROM METADATA', [], function(tx, results){
				for(var i = 0, l = results.rows.length; i < l; i++){
					console.log('META: ', results.rows.item(i))

				}
			}, this.onDbError);
		},
		_checkResExistence: function(args, results){
			var that = this;
			switch(results.rows.length){
				case 0:
					// insert the resource here here
					args.tx.executeSql('INSERT INTO RESOURCE (scormid, url) SELECT id, ? from SCORM where SCORM.url = ?', [args.resId, args.scormId], function(tx, results){
						args._resourceId = results.insertId;
						that._insertResource(args);
					}, this.onDbError);
					break;
				default:
					// insert here
					args._resourceId = results.rows.item(0).id;
					that._insertResource(args);
					break;

			}

		},
		/**
		 * remote the metadata identified by id
		 * @param  {Object} args contains the Metadata id
		 */
		removeMetadata: function(args){
			var
				errback = args.errback || function(){}, that = this
			;

			db.transaction(function(tx){ args.tx = tx; that._removeMeta(args) },
				function(err){
					console.error('error initialising the _removeMeta transaction, error', err);
					errback.apply(null, arguments);
				},
					function(){
						// nothing to do
					}
				);
		},
		_removeMeta: function(args){
			var that = this;
			args.tx.executeSql('SELECT id FROM RESOURCE where RESOURCE.url = ? and RESOURCE.scormid in (SELECT id from SCORM WHERE url = ?)', [args.resId, args.scormId], function(tx, results){
				var resId = results.rows.item(0).id;
				args.tx.executeSql('DELETE FROM METADATA where idx = ? and type = ? and resourceid = ?', [args.index, args.type, resId], function(tx, results){
					console.log("deletion, rows affected = %d", results.rowsAffected);

					args.tx.executeSql('UPDATE METADATA set idx = idx - 1 WHERE resourceid = ? and (type = 1 or type = 2) and idx > ? ', [resId, args.index], function(tx, results){
							args.cback.apply(null, arguments);
					},
					function(){});
				}, function(){
					that.onDbError.apply(that, arguments);
					args.errback.apply(null, arguments);
				});
			}, function(){});

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
			args.tx.executeSql('SELECT id FROM SCORM WHERE SCORM.url = ?', [args.scormId],
				function(tx, results){
					that._checkScormExistence(args, results);
				}, function(){
					args.errback.apply(null, arguments);
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
