
/* global Ns, Main */

Ns.Options = {
    
    
    
    constructor: function(){
        
    },
    
    content: function(match, id_obj){
        
        Main.tpl.template({
            tplUrl: 'game-view-options.html',
            data: match.wdl,
            onReplace: function (tpl_var, wdl) {


            },
            afterReplace: function (el, data) {
                document.getElementById(id_obj.view_body_id).innerHTML = el.outerHTML;
                
                
                
            }
        });
    },
    
    get2DPieceTheme: function(){
        
    },
    
    get3DPieceTheme: function(){
        
    },
    
    getBoardTheme: function(){
        
    },
    
    getBoardFrameTheme: function(){
        
    },
    
    getFloorTheme: function(){
        
    },
    
    allowSound: function(allow){
        
    },
    
    isSoundAllow: function(){
        
    },
    
    setLightIntensity: function(){
        
    },
    
};


