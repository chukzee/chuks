

/* global Main, Ns */

Ns.GameView = {

    extend: 'Ns.ui.AbstractGameSection',

    rightPanelTitleComp: null,
    
    Content: function(data){
      this.initContent(data);  
    },

    getRightPanelWidth: function () {
        return '40%';
    },

    getRightPanelOffRight: function () {
        return '-' + this.getRightPanelWidth();
    },

    getRightPanelPinnedID: function () {
        return 'game-view-right-panel-pinned';
    },

    getRightPanelCloseID: function () {
        return 'game-view-right-panel-close';
    },

    getRightPanelHeaderID: function () {
        return 'game-view-right-panel-header';
    },

    getRightPanelBodyID: function () {
        return 'game-view-right-panel-body';
    },

    getRightPanelHeaderTitleID: function () {
        return 'game-view-right-panel-header-title';
    },

    getRightContentID: function () {
        return 'game-view-right-content';
    },

    getMainID: function () {
        return 'game-view-main';
    },

    getMainBoardID: function () {
        return 'game-view-main-board';
    },

    getMainUpperID: function () {
        return 'game-view-main-upper';
    },

    getMainLowerID: function () {
        return 'game-view-main-lower';
    },

    getBackButtonID: function () {
    },

    onClickBackButton: function () {
    },

    onViewReady: function (data) {
        Ns.ui.GamePanel.ownGameView(data);
    },

};
