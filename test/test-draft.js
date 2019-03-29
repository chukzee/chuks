

var draft = require('./draftgame')();



draft.printBoard();

//console.dir(draft);

//draft.replace();

draft.clearBoard();

//Man
 
 
/* draft.setPiece(22, true, false);

draft.setPiece(33, false, false);
draft.setPiece(55, false, false);
draft.setPiece(77, false, false);
draft.setPiece(75, false, false);
draft.setPiece(53, false, false);
draft.setPiece(13, false, false);
draft.setPiece(15, false, false);
draft.setPiece(37, false, false);
draft.setPiece(17, false, false);
*/

//------------------------------------

//King
 
 draft.setPiece(22, true, true);

draft.setPiece(33, false, false);
draft.setPiece(55, false, false);
draft.setPiece(77, false, false);
draft.setPiece(75, false, false);
draft.setPiece(73, false, false);
draft.setPiece(53, false, false);
draft.setPiece(13, false, false);
draft.setPiece(15, false, false);
draft.setPiece(37, false, false);
draft.setPiece(17, false, false);

console.log('----------------------------------------');


var caps = draft.searchCapturePaths(22);

console.dir(caps);

//var caps_san = draft.capturableSAN(22);

//console.dir(caps_san);

console.dir("---------------------");

var filter_caps = draft.filterPaths(22, [44,66,88]);

console.dir(filter_caps);

var cap =caps[4];

    //cap.splice(0,1);

console.log("----------------------------");

//draft.setPiece(40, false, false);

draft.moveTo(22,cap, function(obj){
    //console.log(obj);
    console.log(JSON.stringify(obj));//REMIND - Send move in compressed form - hint: use base64 or custom compression techique like using one or two letter to represent a word 
    console.log(JSON.stringify(obj).length);
});

console.log('-------------------------------------');

draft.printBoard();

var depth = 13;
var BoardPostion = '';//TODO
var robot = new draft.Robot(BoardPostion, depth);


robot.play(function(result){
    console.log('best move', JSON.stringify(result));
});


draft.printBoard();

var startTime = new Date().getTime();

console.log('elapse ', (new Date().getTime() - startTime)/1000, 'secs');


//var res = draft.move('i5-j6');
var res = draft.move('16-21');

console.log('move result', res);
if(!res){
    console.log('last error', draft.lastError);
}

draft.printBoard();

//draft.test();
//draft.test1();
//draft.test2();
//draft.test3();




