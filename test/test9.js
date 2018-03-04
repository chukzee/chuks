

var str = `
{_1a0_-e}
{aaa}
{abf}
{bc}
`;

var regex = /{[a-zA-Z_][a-zA-Z0-9._-]*}/g;
var result = str.match(regex);
console.log(result);

console.log('------------');

var s = '123.456.789'.split('.');
console.log(s);

var obj = {
    a:'aaaaa',
    b:'bbbbb'
};

console.log(obj['']);
