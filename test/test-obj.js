var initial_unique;
var unique_count = 0;

class Sen{
    
    constructor(){
       initial_unique = "this is unique number"; //TODO - JUST ASSUMING;

    }
    
        get UniqueNumber() {        
        return initial_unique +"_"+ ++unique_count;
    }

}

var sen = new Sen();

console.log(sen.UniqueNumber);
console.log(sen.UniqueNumber);
console.log(sen.UniqueNumber);
console.log(sen.UniqueNumber);
console.log(sen.UniqueNumber);
console.log(sen.UniqueNumber);

