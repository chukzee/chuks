

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

var cap =caps[0];

draft.moveTo(22,caps[0]);


draft.test();

