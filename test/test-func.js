

function Func() {
    this.n = 5;
    function b(){
        this.n = 4;
        Func();
        console.log(n);
    }
    this.do = function(){
        b.call(this);
    };
    return this;
}

var f = Func();
f.do();