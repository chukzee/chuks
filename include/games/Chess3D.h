

#ifndef CHESS3D_H_INCLUDED
#define CHESS3D_H_INCLUDED

// forward declared dependencies
class Piece;

// included dependencies
#include <vector>
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
        std::vector<Piece*> _offBoardPieces(std::string board_position, bool white);
        std::vector<Piece*> pushPieces(std::vector<Piece*> pce_list, bool white, std::string name, int count);

        public:

         Chess3D(): Game3D(){
         };

         Chess3D(IrrlichtDevice* _device, IVideoDriver* _driver, ISceneManager* _smgr): Game3D(_device, _driver, _smgr){
         };

         ~Chess3D(){};

        MoveResult makeMove(std::string from, std::string to);

        Square* createBoardContent(std::string board_position);
        //white pieces captured
        std::vector<Piece*> offBoardWhitePieces(std::string board_position);
        //black pieces captured
        std::vector<Piece*> offBoardBlackPieces(std::string board_position);

        BoardConfig configBoard(std::string variant);

        void createPieceModel(Piece* p);

        std::string getPieceName();

        float getModelBottom(Piece* pce);

        bool isWhitePieceModel();

        Piece* getInternalPiece(std::string sqn);

        float getFlyHeight(Piece* pce, float to);
};


#endif


