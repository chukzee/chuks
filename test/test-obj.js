
function endsWith(str, search) {
    var s_len = search.length;
    if (s_len > str.length  || s_len === 0) {
        return false;
    }
    var start = str.length - s_len;

    for (var i = start, n = 0; i < str.length; i++, n++) {
        if (str.charAt(i) !== search.charAt(n)) {
            return false;
        }
    }
    return true;
}

function startsWith(str, search) {
    if (search.length === 0) {
        return false;
    }
    return str.indexOf(search) === 0;
}

console.log(endsWith('123456', '56'));
console.log(startsWith('123456', '1'));