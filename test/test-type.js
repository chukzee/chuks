
class A{
    
}

class B extends A{
    
}

var a = new A();
var b = new B();

async function fn(){
    var n = await 10;
    return n;
}
fn().then(function(v){
    console.log(v);

});

var p1 = "aaaa";
var p2 = 4;
var p3 = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve({name:"chuks"});
    }, 5000);
});

Promise.all([p1,p2,p3]).then(function(values){
    console.log(values);
}).catch(function(err){
    console.log(err);
})


