

var objs =[
    {
        a:6
    },
    {
        a:5
    },
    {
        a:4
    },
    {
        a:3
    },
    {
        a:2
    },
    {
        a:1
    }
]

console.log(objs.sort(function(o1, o2){
    console.log(o1, o2);
    return o1.a > o2.a;
}));

var spf = function sp(){
    var s = 0;
    return function(){
        return ++s;
    };
}();

console.log('-------');
console.log(spf());
console.log(spf());
console.log(spf());
console.log(spf());

var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' , hour:'numeric', minute:'numeric'};
var date  = new Date();
var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

console.log(date.toLocaleString("en-US"));
