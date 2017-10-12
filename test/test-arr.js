

var a = [2, 3, 4, 5, 6, 7, 8, 9];

for (var i = 0; i < a.length; i++) {
    if (a[i] < 5) {
        a.splice(i, 1);
        i--;
    }
}

console.log(a);

var group = {
    members: [{user_id: "chuks1"}, {user_id: "chuks2"}, {user_id: "chuks3"}]
};

var group_members = group.members;
group.members[2].user_id = "changed too";

console.log(group.members);
console.log('----------------------------');
console.log(group_members);
console.log('------------4334----------------');
var n = 'chuks';
n = [n];
console.log(n);
console.log(n.length);
console.log('------------uuuuu----------------');

var h = "345";
var b = Buffer.from([1, 2]);
var c = b.toString() + h;
console.log(c);
console.log(c === h);
console.log(c.length);
var p = Buffer.from(c);
var sp = p.toString();

console.log(c === sp);

console.log('------------oooooooo----------------');

var g = [2, 3, 5, 6];
var g2 = [7, 8, 9, 3];
var s = [g, g2];
var v = [];
for (var i = 0; i < s.length; i++)
    v = v.concat(s[i]);
console.log(v);

console.log('------------bbbbbbb----------------');

var m = [1, 2, 3, 4, 5];

var q = [];

for (var i = 0; i < 500000; i++) {
    q.push(m);
}

//var h = Array.prototype.concat.apply([], q);
/*var h = [];
 for(var i=0; i< q.length; i++){
 h = h.concat(q[i]);
 }*/

/*var h = q.reduce(function(a,b){
 return a.concat(b);
 });*/
var h = [];

var h = []; //ver very fast
for (var i = 0; i < q.length; i++) {
    for (var k = 0; k < q[i].length; k++) {
        h.push(q[i][k]);
    }
}

console.log('h.length = ', h.length);
//console.log(h);
var Null = null;
var Empty = '';
var ogg;
console.log(Number.isInteger(Null));
console.log(Number.isInteger(ogg));
console.log(Number.isInteger(Empty));
console.log(Empty == 0);

console.log("------------------------");

function fn1(){
    
};

function fn2(){
    
};

var lis = [];

lis.push(fn1);
lis.push(fn1);
lis.push(fn2);
console.log(lis.indexOf(fn2));

console.log('-----test join-----');
var jn = [];
jn.push('chuks1');
jn.push('chuks2');
jn.push('chuks3');

var j = jn.join(';');
console.log(j);

//mama work
var countries = [
'Algeria',
'Angola',
'BotswanaBenin',
'Burkina Faso',
'Burundi',
'Cameroon',
'Cape Verde',
'Central African Republic',
'Chad',
'Comoros',
'Congo',
'Cote Divoire',
'Democratic Congo',
'Djibouti',
'Egypt',
'Equatorial Guinea',
'Eritrea',
'Ethiopia',
'Gabon',
'Ghana',
'Guinea Bissau',
'Guinea',
'Kenya',
'Lesotho',
'Liberia',
'Libya',
'Madagascar',
'Malawi',
'Mali',
'Mauritania',
'Mauritius',
'Morocco',
'Mozambique',
'Namibia',
'Niger',
'Nigeria',
'Rwanda',
'Sao Tome and Principe',
'Senegal',
'Seychelles',
'Sierra Leone',
'Somalia',
'South Africa',
'Sudan',
'Swaziland',
'Tanzania',
'The Gambia',
'Togo',
'Tunisia',
'Uganda',
'Zambia',
'Zimbabwe'
];






