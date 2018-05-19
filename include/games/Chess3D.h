

#ifndef CHESS3D_H_INCLUDED
#define CHESS3D_H_INCLUDED

// forward declared dependencies
class Piece;

// included dependencies
#include <list>
#include <irrlicht.h>
#include <Game3D.h>


using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;

class Chess3D : public Game3D{

    private:
        const std::string DEFAULT_BOARD_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        IMeshSceneNode* chessPieceModels = 0;
        std::string abbrToName(char c);
        Piece* _offBoardPieces(std::string board_position, bool white);
        void pushPieces(std::list<Piece*> pce_list, bool white, std::string name, int count);

        public:

         Chess3D(): Game3D(){
         };

         Chess3D(IVideoDriver* _driver, ISceneManager* _smgr): Game3D(_driver, _smgr){
         };

         ~Chess3D(){};

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


