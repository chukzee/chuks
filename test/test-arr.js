

var a = [2, 3, 4, 5, 6, 7, 8, 9];

for (var i = 0; i < a.length; i++) {
    if (a[i] < 5) {
        a.splice(i, 1);
        i--;
    }
}

console.log(a);

var group ={
    members :[{user_id: "chuks1"},{user_id: "chuks2"},{user_id: "chuks3"}]
};

var group_members = group.members;
group.members[2].user_id = "changed too";

console.log(group.members);
console.log('----------------------------');
console.log(group_members);
