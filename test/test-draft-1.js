



var draft = require('./draftgame-1')();

/*// WORKS!
draft.clearBoard();

 draft.setPiece(6, true, false);

draft.setPiece(15, false, false);
draft.setPiece(33, false, false);
draft.setPiece(35, false, false);
draft.setPiece(53, false, false);
draft.setPiece(55, false, false);

draft.printBoard();

var caps = draft.searchCapturePaths(6);

console.dir(caps);
*/


draft.clearBoard();

 draft.setPiece(24, true, false);

draft.setPiece(33, false, false);
draft.setPiece(35, false, false);
draft.setPiece(53, false, false);
draft.setPiece(55, false, false);

draft.printBoard();

var caps = draft.searchCapturePaths(24);

console.dir(caps);
