

var arr = [3,3,3,3,1,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,5,3,3,3,3,3];

for(var i=0; i<arr.length; i++){
    if(arr[i]===3){
       arr.splice(i, 1);
        i--;
        continue;
    }
    console.log(arr[i]);
}

console.log(arr);