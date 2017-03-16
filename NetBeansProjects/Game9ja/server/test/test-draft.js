

var draft = require('./draftgame')();

//draft.printBoard();

//console.dir(draft);

//draft.replace();

draft.clearBoard();

//Man
 
 draft.setPiece(22, true, false);

draft.setPiece(33, false, false);
draft.setPiece(55, false, false);
draft.setPiece(77, false, false);
draft.setPiece(75, false, false);
draft.setPiece(53, false, false);
draft.setPiece(13, false, false);
draft.setPiece(15, false, false);
draft.setPiece(37, false, false);
draft.setPiece(17, false, false);


//------------------------------------

//King
 
 /*draft.setPiece(22, true, true);

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
*/

//draft.printBoard();

var caps = draft.searchCaputrePaths(22);

console.dir(caps);

console.dir("---------------------");

var filter_caps = draft.filterPaths(22, [4,26,8]);

console.dir(filter_caps);

var cap =caps[4];

    cap.splice(0,1);

console.log("----------------------------");

//draft.setPiece(40, false, false);

draft.moveTo(22,cap, function(obj){
    console.log(obj);
});




//draft.test();

