
#include <vector>
#include <iostream>
#include <ctype.h>
#include <string>
#include <irrlicht.h>
#include <Piece.h>
#include <games/Chess3D.h>

using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;


std::string Chess3D::abbrToName(char c){

    if(c == 'k' || c=='K'){
        return "king";
    }else if(c=='q' || c=='Q'){
        return "queen";
    }else if(c=='b' || c=='B'){
        return "bishop";
    }else if(c=='n' || c=='N'){
        return "knight";
    }else if(c=='r' || c=='R'){
        return "rook";
    }else if(c=='p' || c=='P'){
        return "pawn";
    }

    return "";
};

BoardConfig Chess3D::configBoard(std::string variant){
    BoardConfig config;
    config.rowCount = 8;
    config.pieceCount = 16;

    return config;
};

Square* Chess3D::createBoardContent(std::string board_position){

    //"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

    if(board_position == ""){//initial board position
        board_position = this->DEFAULT_BOARD_POSITION;
    }

    int col = -1;
    int row = 7;//starting from the last rank
    int sq = 0;
    for(unsigned i=0; i< board_position.length(); i++){
        int ch =  board_position.at(i);
        if(ch == ' '){//end
            break;
        }

        if(ch == '/'){
            col = -1;
            row--;
            continue;
        }
        int digit = ch - 48;//come back
        char pce_char = 0;
        if(digit >= 1 && digit <= 8){//digit from 1 to 8
            col += digit;
        }else{//piece type
            col++;
            pce_char = ch;
        }

        sq = (row * 8) + col;

        if(pce_char != 0){
            std::string piece_name = this->abbrToName(pce_char);
            this->squareList[sq].piece = new Piece();
            this->squareList[sq].piece->name = piece_name;
            this->squareList[sq].piece->sqLoc = sq;
            this->squareList[sq].piece->white = std::isupper(ch);
            this->createPieceModel(this->squareList[sq].piece);
        }

    }

    return this->squareList;
}

//white pieces captured
std::vector<Piece*> Chess3D::offBoardWhitePieces(std::string board_position){
    return this->_offBoardPieces(board_position, true);
};

//black pieces captured
std::vector<Piece*> Chess3D::offBoardBlackPieces(std::string board_position){
    return this->_offBoardPieces(board_position, false);
};

std::vector<Piece*> Chess3D::_offBoardPieces(std::string board_position, bool white){

        std::vector<Piece*> pce_list;

        int queen_count = 0,
                king_count = 0, //not necessary anyway before king is never captured
                rook_count = 0,
                bishop_count = 0,
                knight_count = 0,
                pawn_count = 0,
                promotion_count = 0;


        if(board_position == ""){//initial board position
            board_position = this->DEFAULT_BOARD_POSITION;
        }

        for(unsigned i=0; i< board_position.length(); i++){
            int ch =  board_position.at(i);
            if(ch == ' '){//end
                break;
            }


            bool is_white_pce = std::isupper(ch);//white is the  upper case letters
            if (is_white_pce != white) {
                continue;
            }

            if (ch == '/') {
                continue;
            }

            int lower_ch = std::tolower(ch);
            if (lower_ch == 'k') {//not necessary anyway before king is never captured
                king_count++;
            }
            if (lower_ch == 'q') {
                queen_count++;
            }
            if (lower_ch == 'r') {
                rook_count++;
            }
            if (lower_ch == 'b') {
                bishop_count++;
            }
            if (lower_ch == 'n') {
                knight_count++;
            }
            if (lower_ch == 'p') {
                pawn_count++;
            }
        }

        if (queen_count < 1) {
            this->pushPieces(pce_list, white, this->abbrToName('q'), 1 - queen_count);
        } else if (queen_count > 1) {//promotion detected
            promotion_count += queen_count - 1;
        }

        if (rook_count < 2) {
            this->pushPieces(pce_list, white, this->abbrToName('r'), 2 - rook_count);
        } else if (rook_count > 2) {//promotion detected
            promotion_count += rook_count - 2;
        }

        if (bishop_count < 2) {
            this->pushPieces(pce_list, white, this->abbrToName('b'), 2 - bishop_count);
        } else if (bishop_count > 2) {//promotion detected
            promotion_count += bishop_count - 2;
        }

        if (knight_count < 2) {
            this->pushPieces(pce_list, white, this->abbrToName('n'), 2 - knight_count);
        } else if (knight_count > 2) {//promotion detected
            promotion_count += knight_count - 2;
        }

        if (pawn_count < 8 - promotion_count) {
            this->pushPieces(pce_list, white, this->abbrToName('p'), 8 - promotion_count - pawn_count);
        }

        /*
        //TESTING BEGIN
        //REMOVE THE IF BLOCK BELOW LATER ABEG 0! TEST THE ONE ABOVE BY CHANGE 8 TO 32
        if (pawn_count < 32 - promotion_count) {
            pce_list = this->pushPieces(pce_list, white, this->abbrToName('p'), 32 - promotion_count - pawn_count);
        }
        //TESTING END
       */

        return pce_list;

};

std::vector<Piece*> Chess3D::pushPieces(std::vector<Piece*> pce_list, bool white, std::string name, int count) {
        for (int i = 0; i < count; i++) {
            Piece* pce = new Piece();
            pce->name = name;
            pce->sqLoc = this->OFF_BOARD;
            pce->white = white;
            this->createPieceModel(pce);
            pce_list.push_back(pce);
        }

        return pce_list;
}

void Chess3D::createPieceModel(Piece* p){

    std::string file_name = "resources/games/chess/3D/pieces/themes/normal/3ds/"+p->name+".3ds";

	IAnimatedMesh* m = this->smgr->getMesh(file_name.c_str());
	if (m)
	{
	     p->model = this->smgr->addAnimatedMeshSceneNode(m);
		//p->model->setAnimationSpeed(30);

         p->model->setMaterialFlag(video::EMF_LIGHTING, true);
         p->model->setMaterialFlag(video::EMF_NORMALIZE_NORMALS, true);
         p->model->setMaterialType(EMT_LIGHTMAP_M4);
         //p->model->setMaterialFlag(video::EMF_BACK_FACE_CULLING, false);
         p->model->setDebugDataVisible(scene::EDS_OFF);
         p->model->getMaterial(0).Shininess = 0.0f;
         if(p->white){
            p->model->getMaterial(0).AmbientColor.set(255, 153,101,21);
            p->model->getMaterial(0).EmissiveColor.set(255, 153,101,21);
            //p->model->getMaterial(0).DiffuseColor.set(255, 153,101,21);
            //p->model->getMaterial(0).SpecularColor.set(255, 153,101,21);
         }else{
            p->model->getMaterial(0).AmbientColor.set(255, 10, 10, 10);
            p->model->getMaterial(0).EmissiveColor.set(255, 10, 10, 10);
            //p->model->getMaterial(0).DiffuseColor.set(255, 10, 10, 10);
            //p->model->getMaterial(0).SpecularColor.set(255, 10, 10, 10);
         }
//EMT_LIGHTMAP_M4
         if(p->name == "king"){
            p->bottom = 0;
         }else if(p->name == "queen"){
            p->bottom = 0.1;
         }else if(p->name == "knight"){
            p->bottom = 1.8;
         }else if(p->name == "bishop"){
            p->bottom = 2.3;
         }else if(p->name == "rook"){
            p->bottom = 0;
         }else if(p->name == "pawn"){
            p->bottom = 1.15;
         }

         //rotate the knight to face normal direction
         if(p->name == "knight"){
            if(p->white){
               p->model->setRotation(vector3df(0, 90, 0));
            }else{
               p->model->setRotation(vector3df(0, -90, 0));
            }
         }

         //scale the pawns a bit bigger

         if(p->name == "pawn"){
            float w_scl = 1.1f;
            float h_scl = 1.2f;
            p->model->setScale(vector3df(w_scl, h_scl, w_scl));
            //modify the bottom position of the pawn
            p->bottom *= h_scl;
         }

	}

};

bool Chess3D::isWhitePieceModel(){
    return false; // NOT YET IMPLEMENTED
};

std::string Chess3D::getPieceName(){
    return "";
};

float Chess3D::getModelBottom(Piece* pce){
    return pce->bottom;
};

Piece* Chess3D::getInternalPiece(std::string sqn){
    //TODO - Call external method from here

    //TESING START

    if(sqn!=""){//SIMULATION TEST!!!!
        return this->squareList[this->toNumericSq(sqn)].piece;
    }

    //TESTING END

    return 0;
};

/**
Calls the external method - e.g node, android, iOS etc
*/
MoveResult Chess3D::makeMove(std::string from, std::string to){

    MoveResult move_result;

    //TESING START

    if(from!="" && to != ""){//SIMULATION TEST!!!!
        move_result.done = true;
        move_result.error = "";
        move_result.hasMore = false;
        move_result.capture = "";
        move_result.mark_capture = "";
    }

    //TESTING END

    return move_result;
};

float Chess3D::getFlyHeight(Piece* pce, float to){
    float max = 2.5f;

    if(pce->name != "knight" && to != this->OFF_BOARD){
        return 0.7f;
    }

    return max;
};
