

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


//draft.printBoard();

var caps = draft.searchCaputrePaths(22);

console.dir(caps);

console.dir("---------------------");

var filter_caps = draft.filterPaths(22, [4,26,8]);

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



var robot = new draft.Robot(draft.DefaultBoardPostion, 15);

var startTime = new Date().getTime();

robot.play(function(result){
    console.log(JSON.stringify(result));
});

draft.printBoard();

console.log('elapse ', (new Date().getTime() - startTime)/1000, 'secs');


//draft.test();

