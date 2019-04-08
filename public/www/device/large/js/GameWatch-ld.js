

/* global Main, Ns */


Ns.GameWatch = {

    
    extend: 'Ns.ui.AbstractGameSection',
    
    rightPanelTitleComp: null,
    
    Content: function(data){
      this.initContent(data);  
    },
    
    getMainUpperHeight: function () {
        return 60;
    },

    getMainLowerHeight: function () {
        return 50;
    },

    getRightPanelWidth: function(){
        return '40%';        
    },

    getRightPanelOffRight: function () {
        return '-' + this.getRightPanelWidth();
    },

    getRightPanelPinnedID: function () {
        return 'game-watch-right-panel-pinned';
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
    },
    
    onClickBackButton: function(){
    },

    onViewReady: function(data){
        Ns.ui.GamePanel.watchGame(data);
    },
    

};
