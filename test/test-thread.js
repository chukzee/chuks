


(function(){
    var n =0;
    
    function run1(thread){
        n++;
        console.log("thread=",1, ", n=",n);
    }
    
    function run2(thread){
        n++;
        console.log("thread=",2, ", n=",n);
    }
    
    setInterval(run1, 5000);
    setInterval(run2, 5000);
    
}());


