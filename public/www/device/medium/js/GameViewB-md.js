

/* global Main, Ns */


Ns.GameViewB = {

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
        return 'game-view-b-right-panel-close';
    },

    getRightPanelHeaderID: function () {
        return 'game-view-b-right-panel-header';
    },

    getRightPanelBodyID: function () {
        return 'game-view-b-right-panel-body';
    },

    getRightPanelHeaderTitleID: function () {
        return 'game-view-b-right-panel-header-title';
    },

    getRightContentID: function () {
        return 'game-view-b-right-content';
    },

    getMainID: function () {
        return 'game-view-b-main';
    },

    getMainBoardID: function () {
        return 'game-view-b-main-board';
    },

    getMainUpperID: function () {
        return 'game-view-b-main-upper';
    },

    getMainLowerID: function () {
        return 'game-view-b-main-lower';
    },

    getBackButtonID: function () {
        return 'game-view-b-back-btn';
    },

    onClickBackButton: function () {
        Ns.GameHome.home();
    },

    onViewReady: function (data) {
        Ns.ui.GamePanel.ownGameViewB(data);
        
        if (Ns.GameHome.isLandscape()) {//landscape
            $('.game9ja-portrait-only').hide();
        } else {
            $('.game9ja-portrait-only').show();
        }

    },

};
