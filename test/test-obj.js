

var a = {
    a:null,
    fn:function(){
        this.a = {n: 'a5'};
    }
};

var b={};

var c = {};



b.a = a.a;
b.fn = a.fn;

c.a = a.a;
c.fn = a.fn;

a.fn();
c.a = {n: 1};


console.log(a.a);
console.log(b.a);
console.log(c.a);