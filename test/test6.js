
var tourn ={
    officials : [1,2,3,4],
    registered_players : [5,6,7,8]

};

var members = [];

if(Array.isArray(tourn.officials)){
    members = members.concat(tourn.officials);
}

if(Array.isArray(tourn.registered_players)){
    members = members.concat(tourn.registered_players);
}

console.log(members);

var a = [0,4];
console.log(a[0]);
console.log(a[1]);