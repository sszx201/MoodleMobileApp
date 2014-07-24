Ext.define('MoodleMobApp.controller.Book', {
    extend: 'Ext.app.Controller',
    
    config: {
		views: [
			'MoodleMobApp.view.Book'
		],

        refs: {
			navigator: 'coursenavigator',
			module: 'modulelist',
			book: 'book',
			index: 'dataview[name="index"]',
			content: 'panel[name="content"]',
			indexButton: 'book button[action="showindex"]',
			nextPageButton: 'book button[action="nextpage"]',
			prevPageButton: 'book button[action="previouspage"]',
			recentActivity: 'recentactivitylist'
        },
        control: {
			module: { itemtap: 'selectModule' },
			indexButton: { tap: 'toggleIndex' },
			nextPageButton: { tap: 'nextPage' },
			prevPageButton: { tap: 'prevPage' },
			index: {
				itemtap: 'selectChapter',
				select: 'fixNavigationButtonVisiblity'
			},
			recentActivity: {
				checkActivity: function(record) {
					if(record.get('modname') == 'book') {
						console.log('Getting the book record');
						var book_record = MoodleMobApp.Session.getBooksStore().findRecord('id', record.get('instanceid'));
						console.log(book_record);
						if(book_record != undefined) {
							this.showBook(book_record);
						}
					}
				}
			}
        }
    },
    
	selectModule: function(view, index, target, record) {
		Ext.bc = this;
		if(record.get('modname') === 'book'){
			this.showBook(MoodleMobApp.Session.getBooksStore().findRecord('id', record.get('instanceid')));
		}
	},

	showBook: function(book) {
		if(typeof this.getBook() == 'object') {
			this.getBook().destroy(); // if the previous instance is still there remove it
		}
		this.getNavigator().push({
			xtype: 'book',
			title: book.get('name'),
			record: book
		});
		this.getIndex().select(0);
	},

	toggleIndex: function(button) {
		if(this.getIndex().getLeft() < 0) {
			this.getIndex().setLeft(0);
			//this.getContent().element.setWidth(this.getContent().element.width - 250);
			//this.getContent().setWidth(this.getContent().getWidth() - 250);
			this.getContent().setLeft(250);
		} else {
			this.getIndex().setLeft(-250);
			//this.getContent().element.setWidth(this.getContent().element.width + 250);
			//this.getContent().setWidth(this.getContent().getWidth() + 250);
			this.getContent().setLeft(0);
		}
	},

	selectChapter: function(view, index, target, record) {
		this.getContent().setHtml(record.get('content'));
	},

	nextPage: function() {
		var elements_number = this.getIndex().getStore().getCount();
		var active_item = this.getIndex().getSelection().pop();
		if(active_item.get('index') < elements_number - 1) {
			this.getIndex().deselect(active_item.get('index'));
			this.getIndex().select(active_item.get('index')+1);
			var next_item = this.getIndex().getSelection().pop();
			this.getContent().setHtml(next_item.get('content'));
		}
	},

	prevPage: function() {
		var elements_number = this.getIndex().getStore().getCount();
		var active_item = this.getIndex().getSelection().pop();
		if(active_item.get('index') > 0) {
			this.getIndex().deselect(active_item.get('index'));
			this.getIndex().select(active_item.get('index')-1);
			var next_item = this.getIndex().getSelection().pop();
			this.getContent().setHtml(next_item.get('content'));
		}
	},
	
	fixNavigationButtonVisiblity: function(view, record, opts) {
		var elements_number = view.getStore().getCount();
		var active_item = view.getSelection().pop().get('index');
		if(active_item == 0 && elements_number > 1) {
			this.getPrevPageButton().hide();
			this.getNextPageButton().show();
		} else if(active_item == 0 && elements_number == 1) {
			this.getPrevPageButton().hide();
			this.getNextPageButton().hide();
		} else if(active_item > 0 && active_item < elements_number - 1) {
			this.getPrevPageButton().show();
			this.getNextPageButton().show();
		} else if(active_item > 0 && active_item == elements_number - 1) {
			this.getPrevPageButton().show();
			this.getNextPageButton().hide();
		}
	}
});
