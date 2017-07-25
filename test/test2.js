

var u ={
    n : 3,
    get: function(){
        console.log(this.n);
    },
    pick: function(){
        this.get();
    }
}

u.pick();

var cobj= {}; 

for(var i=5; i > -1; i--){
    var obj = {
        a:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+i,
        b:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        c:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        d:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        e:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        f:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        g:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        h:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 
        i:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        j:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        k:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        l:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        m:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        n:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        o:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        p:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        q:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    };
    
    
    cobj[i+"aab"] = obj;
    
}

console.log(cobj);
//console.log('cobj');