


var objParam = {
    class: 'className',
    method: 'method',
    param: 'argu',
    bind: 'bind'
};

bndRcallCallback = rcallCallback.bind(objParam);
objParam.callback = bndRcallCallback;
bndRcallCallback();


function rcallCallback() {
    console.log(this);
}