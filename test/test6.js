
var tourn = {
    officials: [1, 2, 3, 4],
    registered_players: [5, 6, 7, 8]

};

var members = [];

if (Array.isArray(tourn.officials)) {
    members = members.concat(tourn.officials);
}

if (Array.isArray(tourn.registered_players)) {
    members = members.concat(tourn.registered_players);
}

console.log(members);

var a = [0, 4];
console.log(a[0]);
console.log(a[1]);
console.log('-------------');
for (var j = 0; j < 64; j++) {
    var n = j % 2 === 0 ? j : (j - 1);
    var n_nxt = n / 2; //index of fixtures in next round
    console.log(j,' ---- ', n_nxt);
}

