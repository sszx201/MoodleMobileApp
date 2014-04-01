Ext.define("MoodleMobApp.view.Book", {
	extend: 'Ext.Panel',
	xtype: 'book',
	fullscreen: true,
	
	requires: [
		'Ext.TitleBar',
		'MoodleMobApp.model.BookChapter'
	],
	
	config: {
		cls: 'book',
		title: 'Book',
		layout: 'vbox',
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				items: [
					{
						xtype: 'button',
						iconCls: 'list',
						action: 'showindex'
					},
					{ xtype: 'spacer' },
					{
						xtype: 'button',
						iconCls: 'leftarrow',
						action: 'previouspage'
					},
					{
						xtype: 'button',
						iconCls: 'rightarrow',
						action: 'nextpage'
					}
				]
			},
			{
				xtype: 'list',	
				name: 'index',
				cls: 'index',
				scrollable: 'vertical',
				docked: 'left',
				height: '100%',
				width: 250,
				left: -250,
				itemTpl: '<div class="{indentCls}">{chapternumber} {title}</div>'
			},
			{
				xtype: 'panel',	
				name: 'content',
				cls: 'content',
				scrollable: 'vertical',
				top: 0,
				left: 0,
				height: '100%',
				width: window.innerWidth,
				styleHtmlContent: true,
				html: ''
			}
		],
		listeners: {
			initialize: function() {
				var chapters_store = Ext.create("Ext.data.Store", {
					model: "MoodleMobApp.model.BookChapter",
					data: this.getRecord().get('chapters')
				});
				// set the chapter numbers
				var numbering = this.getRecord().get('numbering');
				var chapter = 0;
				var page = 0;
				var index = 0;
				var add_description_as_chapter = false;
				if(this.getRecord().get('intro') != null && this.getRecord().get('intro') != "") {
					add_description_as_chapter = true;
					index = 1;
				}
				chapters_store.each(function(entry) {
					entry.set('index', index);
					++index;
					switch(numbering) {
						/*
						case 0: // no numbering; same indentation for chapters and subchapters
							continue;
						break;
						*/
						case 1: // numbers
							if(entry.get('subchapter') == 0) {
								++chapter; // new chapter
								page = 0; // reset the page number; new chapter
								entry.set('chapternumber', chapter);
								entry.set('indentCls', 'chapter');
							} else {
								++page; // next page or first page when page 0
								entry.set('chapternumber', chapter + '.' + page);
								entry.set('indentCls', 'subchapter');
							}
						break;

						case 2: // bullets
							if(entry.get('subchapter') == 0) {
								entry.set('indentCls', 'chapter');
							} else {
								entry.set('chapternumber', '&bull;');
								entry.set('indentCls', 'subchapter');
							}
						break;

						case 3: // indented
							if(entry.get('subchapter') == 0) {
								entry.set('indentCls', 'chapter');
							} else {
								entry.set('indentCls', 'subchapter');
							}
						break;
					}
				}, this);

				if(add_description_as_chapter) {
					// add description as chapter
					chapters_store.insert(0, [Ext.create('MoodleMobApp.model.BookChapter', {
						id: 0,
						index: 0,
						pagenum: 0,
						subchapter: 0,
						title: 'Description',
						content: this.getRecord().get('intro')
					})])
					this.child('panel[name=content]').setHtml(this.getRecord().get('intro'));
				} else {
					// add the content of the first page
					this.child('panel[name=content]').setHtml(this.getRecord().get('chapters')[0].content);
				}
				// set the index
				this.child('list[name=index]').setStore(chapters_store);
			}
		}
	}
});
