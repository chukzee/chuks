
class MyTest{
  
    printMe(){
        console.log('this is me');
    }
};

module.exports = MyTest;

class M{
    
    n(){
        this.s();
    }
    
    s(){
        console.log("printed here");
    }
}

new M().n();

var p = {
    n:undefined
};

if(p.n === undefined){
   console.log('yes');
}

if(p.set === undefined){
   console.log('yes');
}

var arr = [2,5,6,3,7];

console.log(Array.isArray(arr));

var nar = arr.filter(function(r){
    return r <5;
});

console.log(nar);