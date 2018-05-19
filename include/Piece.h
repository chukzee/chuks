
#ifndef PIECE_H_INCLUDED
#define PIECE_H_INCLUDED


// included dependencies
#include <irrlicht.h>

using namespace irr;

using namespace scene;

class Piece{

public:
    std::string name = "";//name of piece
    std::string game = "";//name of game
    int id = -1;//id of the piece
    int sqLoc = -1;//-1 means OFF_BOALD
    bool white = false;
    float x = 0.0f;
    float y = 0.0f;
    float z = 0.0f;
    float bottom = 0.0f;
    IAnimatedMeshSceneNode* model = 0;
    Piece(){

    };

    ~Piece(){

    };
};


#endif
