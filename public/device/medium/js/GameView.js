

var gameObj = {
    chat: 'game/Chat',
    comment: 'game/Comment'
            //more may go below
};


Main.rcall.live(gameObj);


Main.controller.GameView = {

    onBeforeShow: function (data) {

        initMain();
    

        
        function doSizing(){
            var el = this.element;
            var size = el.clientWidth < el.clientHeight ? el.clientWidth: el.clientHeight;
            
            //since there is a possibility that the clientWidth or clientHeight 
            //might be zero we shall wait till the dimension of the element is
            //ready before trying again
            
            if(el.clientWidth === 0 || el.clientHeight === 0){
                if(this.elaspeTime >= 5000){
                    console.warn('Something is wrong with dom element - could not get size of element!');
                    return;
                }
                this.elaspeTime += this.interval;                
                window.setTimeout(this.sizingFn.bind(this), this.interval);//wait till the dimension is ready
                return;
            }
            
            //console.log('client height gotten after ', this.elaspeTime +' ms');
            
            var upper_height = 40;
            var lower_height = 40;
            var board_size;
            var board_el = document.getElementById('game-view-main-board');
            var upper_el = document.getElementById('game-view-main-upper');
            var lower_el = document.getElementById('game-view-main-lower');
            
            if(size + upper_height + lower_height > el.clientHeight){
                 board_size = size - upper_height - lower_height;
                 if(el.clientHeight > size){
                    board_size = el.clientHeight - upper_height - lower_height;
                 }
            }else{
                board_size = size;
            }
            
            
            //setting the sizes of the panels
            
            board_el.style.width = board_size+'px';
            board_el.style.height = board_size+'px';
            
            upper_el.style.width = board_el.style.width;
            upper_el.style.height = upper_height+'px';
            
            lower_el.style.width = board_el.style.width;
            lower_el.style.height = lower_height+'px';
            
        };

        function sizingMain(evt){
            
            if(evt && evt.type === "orientationchange"){
                this.canChangeOrientation = true;
            }else if(evt && this.canChangeOrientation){
                window.removeEventListener('resize', this.funcListener, false);
                return;
            }
                        
            var el = document.getElementById('game-view-main');
            var obj = {};
            obj.element = el;
            obj.elaspeTime = 0;
            obj.interval = 100;            
            obj.sizingFn = doSizing.bind(obj);
            
            obj.sizingFn();
        }

        function mainResizeListener(){
            if(!window.addEventListener || !window.removeEventListener){
                return;
            }
            
            var obj = {
               canChangeOrientation : false 
            };
            
            var sizingMainFn = sizingMain.bind(obj);
            
            obj.funcListener = sizingMainFn;
            
            window.removeEventListener('resize', sizingMainFn, false);
            window.addEventListener('resize', sizingMainFn, false);
            
            window.removeEventListener('orientationchange', sizingMainFn, false);
            window.addEventListener('orientationchange', sizingMainFn, false);
            
        }

        function initMain(){            
            mainResizeListener();
            sizingMain();            
        }


      
    },

};

Main.on("pageshow", function (arg) {



});