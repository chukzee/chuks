/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace the content of this view to suit the needs of your application.
 */

Ext.define('GameApp.view.main.Main', {
    extend: 'Ext.NavigationView',
    xtype: 'app-main',

    requires: [
        'Ext.MessageBox',

        'GameApp.view.main.MainController',
        'GameApp.view.main.MainModel',
        'GameApp.view.main.GameList'
    ],

    controller: 'main',
    viewModel: 'main',
    fullscreen: true,
    //store: store,
    items: [{
            xtype: 'game-list'
        }]
});