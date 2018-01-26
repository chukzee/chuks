

/*async function fn(a, b, c) {
    console.log(a, b, c);
}

setImmediate(fn,10, 20, "aaa");

fn("hhh", "nnn", "jjj");
fn("hhh", "nnn", "jjj");
fn("hhh", "nnn", "jjj");
fn("hhh", "nnn", "jjj");
*/

async function doit(){
    var n = await new Promise(function(resolve, reject){
        console.log('wait for some time please');
        setTimeout(function(){
            resolve(200);
        }, 10000);
    });
    return n;
}

async function callit(){
    var m = await doit();
    return m;
}

setImmediate(async function(){
    console.log(await callit());
});

setImmediate(async function(){
    console.log(await callit());
});


