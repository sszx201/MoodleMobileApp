Ext.define('MoodleMobApp.view.Scorm', {
    extend: 'Ext.Container',
    xtype: 'scorm',
    requires: [
//        'Ext.NestedList',
        'Ext.Container',
        'Ext.List',
        'Ext.Toolbar',
        'Ext.Button',
        'Supsi.MetaPanel',
        'Supsi.SettingsPanel',
        'Supsi.ScormPanel',
        'MoodleMobApp.store.ScormMetadataStore'
    ],
    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },
//        tabBarPosition: 'bottom',
//        layout: 'hbox',
        items: [
			{
				xtype: 'container',
				items: [
					{
						xtype: 'container',
						docked: 'left',
						id: 'resourceListContainer',
						items:[
							{
								xtype: 'toolbar',
								id: 'scormToolbar',
								items: [
									{
										xtype: 'button',
										ui: 'back',
										id: 'navBack',
										hidden: true,
										text: 'prev'
									},
									{
										xtype: 'spacer'
									},
									{
										xtype: 'label',
										id: 'readPercent',
										html: '0&#37;'
									}
								],
								docked: 'top'
							},
							{
								title: 'home',
								id: 'resourceList',
								xtype: 'list',
								itemTpl: '{title}',
								width: 300,
								docked: 'left',
								displayField: 'title'

							}
						]
					},
					{
						title: 'SCORM Player',
//                iconCls: 'action',
//                flex: 2,

						items: [
							{
								xtype: 'settingspanel',
								id: 'settingsPanel',
								modal: true,
								hideOnMaskTap: true,
								hidden: true
							},
							{
								xtype: 'panel',
								modal: true,
								hideOnMaskTap: true,
								id: 'highlightRemovalPanel',
								hidden: true,
								items: [
									{
										xtype: 'button',
										text: 'remove highlight'
									}
								]
							},
							{
//								docked: 'top',
								xtype: 'toolbar',
								ui: 'dark',
								layout:{
									pack: 'right'
								},
								items: [
									{
										xtype: 'button',
										id:'hidePanelBtn',
										iconCls: 'leftarrow'
									},
									{
										xtype: 'button',
										id:'showPanelBtn',
										hidden: true,
										iconCls: 'rightarrow'
									},
									{
										xtype: 'spacer'
									},
									{
										xtype: 'button',
										iconCls: 'list',
										id:'metaBtn'
									},
									{
										xtype: 'button',
										iconCls: 'settings',
										id:'settingsBtn'
									},
									{
										xtype: 'button',
										iconCls: 'search',
										disabled: true,
										id:'findBtn'
									},
									{
										xtype: 'button',
										iconCls: 'bookmark on',
										disabled: true,
										id:'bookmarkBtn'
									},
									{
										xtype: 'button',
										iconCls: 'marker',
										disabled: true,
										id:'markerBtn'
									},
									{
										xtype: 'button',
										iconCls: 'compose',
										disabled: true,
										id:'annotateBtn'
									}
								]
							},
							{
								xtype: 'scormpanel'
							}
						]
					}
				]
			},
			{
				xtype: 'metapanel',
				fullscreen: true,
//				modal: true,
				hideOnMaskTap: true,
				id: 'metaPanel',
				hidden: true,
				items: [
					{
						xtype: 'toolbar',
						docked: 'top',
						ui: 'none',
						layout:{
							pack: 'left'
						},
						items: [
							{
								xtype: 'button',
								ui: 'back',
								id: 'exitMetaBtn',
								text: 'back'
							},
							{
								xtype: 'textfield',
				                flex: 2,
								id: 'notesFilterField',
								autoCorrect: false,
								autoComplete: false,
								name: 'notesFilterField'
							},
							{
								xtype: 'button',
								id: 'notesFilterBtn',
								text: 'Search notes'
							},
							{
								xtype: 'button',
								id: 'clearNotesFilterBtn',
								text: 'Clear'
							}
						]
					},
					{
						xtype: 'list',
						grouped: true,
						id: 'metadataList',
						selectedCls: '',
						itemTpl: '<div>{fragment}</div><div class=\'metaType\'>{type}</div>',
						width:'100%',
						height:'100%',
						store: { xclass: 'MoodleMobApp.store.ScormMetadataStore' }
						// store: 'scormmetadata'
					}
				]
			}
        ]
    }
});

