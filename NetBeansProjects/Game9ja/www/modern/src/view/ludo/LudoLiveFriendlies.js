
var store = Ext.create('GameApp.store.LudoLiveFriendliesStore');

Ext.define('GameApp.view.ludo.LudoLiveFriendlies', {
    extend: 'GameApp.view.game.GameLiveFriendlies',
    xtype: 'ludo-live-friendlies',

    store:store,


});