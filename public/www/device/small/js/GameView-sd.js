

/* global Main, Ns */


Ns.GameView = {
    
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
        return 'game-view-right-panel-close';
    },
    
    getRightPanelHeaderID: function(){        
        return 'game-view-right-panel-header';
    },
    
    getRightPanelBodyID: function(){  
        return 'game-view-right-panel-body';      
    },
    
    getRightPanelHeaderTitleID: function(){  
        return 'game-view-right-panel-header-title';      
    },
    
    getRightContentID: function(){      
        return 'game-view-right-content';  
    },
    
    getMainID: function(){   
        return 'game-view-main';     
    },
    
    getMainBoardID: function(){        
        return 'game-view-main-board';
    },
    
    getMainUpperID: function(){       
        return 'game-view-main-upper'; 
    },
    
    getMainLowerID: function(){        
        return 'game-view-main-lower';
    },
    
    getBackButtonID: function(){
        return 'game-view-back-btn';
    },
    
    onClickBackButton: function(){
        Main.page.back();
    },
    
    onViewReady: function(data){
        Ns.ui.GamePanel.ownGameView(data);
    },
    
};