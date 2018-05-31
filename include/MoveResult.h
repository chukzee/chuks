#ifndef MOVERESULT_H_INCLUDED
#define MOVERESULT_H_INCLUDED

class MoveResult{

public:

    bool done = false;
    bool hasMore = false;//e.g draughts game
    std::string error = "";
    std::string capture = "";//e.g square notation
    std::string mark_capture =""; //square notation - e.g draughts game - the captured squares are highlighted  before the piece is removed from the board




};

#endif // MOVERESULT_H_INCLUDED
