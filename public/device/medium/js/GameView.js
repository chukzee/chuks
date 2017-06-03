

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);


Main.controller.GameView = {

    onBeforeShow: function (data) {

        initMain();
    

        function initMain(){
            
        }

      
    },

};

Main.on("pageshow", function (arg) {



});