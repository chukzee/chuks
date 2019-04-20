

/* global Main, Ns */


Ns.GameViewB = {

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
        return 'game-view-b-right-panel-close';
    },
    
    getRightPanelHeaderID: function(){        
        return 'game-view-b-right-panel-header';
    },
    
    getRightPanelBodyID: function(){  
        return 'game-view-b-right-panel-body';      
    },
    
    getRightPanelHeaderTitleID: function(){  
        return 'game-view-b-right-panel-header-title';      
    },
    
    getRightContentID: function(){      
        return 'game-view-b-right-content';  
    },
    
    getMainID: function(){   
        return 'game-view-b-main';     
    },
    
    getMainBoardID: function(){        
        return 'game-view-b-main-board';
    },
    
    getMainUpperID: function(){       
        return 'game-view-b-main-upper'; 
    },
    
    getMainLowerID: function(){        
        return 'game-view-b-main-lower';
    },
    
    getBackButtonID: function(){
        return 'game-view-b-back-btn';
    },
    
    onClickBackButton: function(){
        Main.page.back();
    },
    
    onViewReady: function(data){
        Ns.ui.GamePanel.ownGameViewB(data);
    },
    
};