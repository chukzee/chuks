

/*var JS_MAX_SET_TIME0UT_DELAY = Math.pow(2, 31) - 1; // which is (2^31 - 1) or 0x7FFFFFFF

console.log(JS_MAX_SET_TIME0UT_DELAY);

console.log(JS_MAX_SET_TIME0UT_DELAY == '0x7FFFFFFF');

setTimeout(function(){
    console.log('has ran');
}, JS_MAX_SET_TIME0UT_DELAY);
*/

var JS_MAX_SET_TIME0UT_DELAY = 10000;

function runAt(obj, fn){
    
    if(obj.delay > JS_MAX_SET_TIME0UT_DELAY){
        obj.delay -= JS_MAX_SET_TIME0UT_DELAY;

        setTimeout(runAt, JS_MAX_SET_TIME0UT_DELAY, obj, fn);
    }else{
        setTimeout(fn, obj.delay, obj);
    }    
}

setTimeout(function(){
    console.log('here u go my guy!');
}, 60000);

runAt({delay: 60000}, function(obj){
    console.log('here u go!', obj);
});