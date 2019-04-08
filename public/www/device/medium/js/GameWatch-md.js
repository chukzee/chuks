

/* global Main, Ns */

Ns.GameWatch = {

    LANDSCAPE_RHS_PANEL_WIDTH: '65%',
    PORTRAIT_RHS_PANEL_WIDTH: '75%',

    extend: 'Ns.ui.AbstractGameSection',

    constructor: function () {
        Main.event.on(Ns.Const.EVT_LAYOUT_GAME_PANEL, this.layoutView.bind(this));
    },
   
    Content: function(data){
      this.initContent(data);  
    },
 
    getMainPadding: function () {
        return 0;
    },

    getMainUpperHeight: function () {
        return 60;
    },

    getMainLowerHeight: function () {
        return 50;
    },

    getRightPanelWidth: function () {
        return window.screen.height > window.screen.width ? this.PORTRAIT_RHS_PANEL_WIDTH : this.LANDSCAPE_RHS_PANEL_WIDTH;
    },


    getRightPanelOffRight: function () {
        return '-100%';
    },

    getRightPanelPinnedID: function () {
        //return nothing
    },

    getRightPanelCloseID: function () {
        return 'game-watch-right-panel-close';
    },

    getRightPanelHeaderID: function () {
        return 'game-watch-right-panel-header';
    },

    getRightPanelBodyID: function () {
        return 'game-watch-right-panel-body';
    },

    getRightPanelHeaderTitleID: function () {
        return 'game-watch-right-panel-header-title';
    },

    getRightContentID: function () {
        return 'game-watch-right-content';
    },

    getMainID: function () {
        return 'game-watch-main';
    },

    getMainBoardID: function () {
        return 'game-watch-main-board';
    },

    getMainUpperID: function () {
        return 'game-watch-main-upper';
    },

    getMainLowerID: function () {
        return 'game-watch-main-lower';
    },

    getBackButtonID: function () {
        return 'game-watch-back-btn';
    },

    onClickBackButton: function () {
        Ns.GameHome.home();
    },

    onViewReady: function (data) {
        Ns.ui.GamePanel.watchGame(data);
        
        if (Ns.GameHome.isLandscape()) {//landscape
            $('.game9ja-portrait-only').hide();
        } else {
            $('.game9ja-portrait-only').show();
        }

    },

};
