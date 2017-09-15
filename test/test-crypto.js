var crypto = require('crypto');

//var c = crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

console.log(c = crypto.randomBytes(128).toString('base64'));
console.log(c.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, ''));


async function _protectedPassword(password) {
    var salt = crypto.randomBytes(48).toString('base64');
    var iterations = 1000;
    var hash = await new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, salt, iterations, 512, 'sha512', function (err, hash) {
            if(err){
               return reject(err);
            }
            resolve(hash);
        });
    });


    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

(async function (parameters) {

    var g = '110c';
    var v = g || 5;
    console.log('v',v);
    
    console.log('------------------');
    try {
        console.log(await _protectedPassword('chuks'));
    } catch (e) {
        console.log(e);
    }

}());


