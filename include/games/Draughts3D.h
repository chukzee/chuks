
#ifndef DRAUGHTS3D_H_INCLUDED
#define DRAUGHTS3D_H_INCLUDED

// forward declared dependencies
class Piece;

// included dependencies
#include <irrlicht.h>
#include <Game3D.h>


using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;

class Draughts3D: public Game3D{


        public:

         Draughts3D(): Game3D(){
         };

         Draughts3D(IVideoDriver* _driver, ISceneManager* _smgr): Game3D(_driver, _smgr){
         };

         ~Draughts3D(){};

        Square* createBoardContent(std::string board_position);
        //white pieces captured
        Piece* offBoardWhitePieces(std::string board_position);
        //black pieces captured
        Piece* offBoardBlackPieces(std::string board_position);

        BoardConfig configBoard(std::string variant);

        void createPieceModel(Piece* p);

        std::string getPieceName();

        float getModelBottom(Piece* pce);

        bool isWhite();

        bool isWhitePieceModel();

};

#endif
