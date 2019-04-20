

/* global Main, Ns */


Ns.GameWatch = {

    extend: 'Ns.ui.AbstractGameSection',
    
    Content: function(data){
      this.initContent(data);  
    },

    canSaveState: function(){
        return false; 
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

    getRightPanelWidth: function(){
        return '80%';        
    },

    getRightPanelOffRight: function () {
        return '-' + this.getRightPanelWidth();
    },
    
    getRightPanelPinnedID: function () {
        //return nothing
    },

    getRightPanelCloseID: function(){        
        return 'game-watch-right-panel-close';
    },
    
    getRightPanelHeaderID: function(){        
        return 'game-watch-right-panel-header';
    },
    
    getRightPanelBodyID: function(){  
        return 'game-watch-right-panel-body';      
    },
    
    getRightPanelHeaderTitleID: function(){  
        return 'game-watch-right-panel-header-title';      
    },
    
    getRightContentID: function(){      
        return 'game-watch-right-content';  
    },
    
    getMainID: function(){   
        return 'game-watch-main';     
    },
    
    getMainBoardID: function(){        
        return 'game-watch-main-board';
    },
    
    getMainUpperID: function(){       
        return 'game-watch-main-upper'; 
    },
    
    getMainLowerID: function(){        
        return 'game-watch-main-lower';
    },
    
    getBackButtonID: function(){
        return 'game-watch-back-btn';
    },
    
    onClickBackButton: function(){
        Main.page.back();
    },
    
    onViewReady: function(data){
        Ns.ui.GamePanel.watchGame(data);
    },
    
};
