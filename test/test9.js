

var str = `
{_1a0_-e}
{aaa}
{abf}
{bc}
`;

var regex = /{[a-zA-Z_][a-zA-Z0-9._-]*}/g;
var result = str.match(regex);
console.log(result);