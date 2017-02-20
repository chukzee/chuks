
Ext.define('GameApp.view.draft.DraftHome', {
    extend: 'Ext.TabPanel',
    xtype: 'draft-home',
    fullscreen: true,

    requires: [
        'GameApp.view.draft.DraftView'
    ],
    
    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Draft tab 1',
            html: 'Draft tab content 1'
        },
        {
            title: 'Draft tab 2',
            html: 'Draft tab content 2'
        }
    ]
});

