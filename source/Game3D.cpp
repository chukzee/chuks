
#include <iostream>
#include <sstream>
#include <irrlicht.h>
#include "Game3D.h"
#include "GameDesc.h"
#include "XZ.h"


Game3D::Game3D(IVideoDriver* _driver, ISceneManager* _smgr){
    this->smgr = _smgr;
    this->driver = _driver;
};

Game3D::~Game3D(){
    delete [] this->squareList;
    std::cout << "~Game3D() called" << std::endl;
};

void Game3D::init(GameDesc desc){

        this->boardConfig = this->configBoard(desc.variant);

        this->SQ_COUNT = this->boardConfig.rowCount * this->boardConfig.rowCount;
        delete [] this->squareList;
        this->squareList = new Square[this->SQ_COUNT];

        this->pieceTheme = desc.pieceTheme;
        this->boardTheme = desc.boardTheme;
        this->blackThrowOutFwd = true;
        this->whiteThrowOutFwd = true;
        this->blackThrowOutX = -1;
        this->whiteThrowOutX = -1;
        this->blackThrowOutZ = -1;
        this->whiteThrowOutZ = -1;
        this->hoverSquare = 0;
        this->pickedSquare = 0;
        this->pickedPiece = 0;
        this->boardX = -1;
        this->boardY = -1;
        this->boardRow = -1;
        this->boardCol = -1;
        this->boardSq = -1;
        this->startTouchBoardX = -1;
        this->startTouchBoardY = -1;
        this->startTouchBoardRow = -1;
        this->startTouchBoardCol = -1;
        this->startTouchBoardSq = -1;
        this->isTouchingBoard = false;
};

void Game3D::load(GameDesc desc){

    this->init(desc);
    if(this->isNewBoard){
        this->board(desc);
    }else{
        this->reOrderBoard(desc);
    }
    this->isNewBoard = false;
};


void Game3D::createBoardPlane(){

    //first remove the existing board
    if (this->boardPlaneNode)
    {
        this->boardPlaneNode->remove();
        this->boardPlaneNode = 0;
    }
    //Board plane
    video::SMaterial* material = 0;
    float tex_repeat = this->boardConfig.rowCount /2 ;// 4 for chess board and 5 for some variant of draft board
    const IGeometryCreator* igc = this->smgr->getGeometryCreator();

    IMesh*  mesh = igc->createPlaneMesh(dimension2d<f32>(1, 1),
                                        dimension2d<u32>(this->BOARD_PLANE_SIZE, this->BOARD_PLANE_SIZE),
                                        material,
                                        dimension2d<f32>(tex_repeat, tex_repeat));
    this->boardPlaneNode = this->smgr->addMeshSceneNode( mesh );

    if (this->boardPlaneNode)
    {
        this->boardPlaneNode->setMaterialFlag(EMF_LIGHTING, false);
        this->boardPlaneNode->setMaterialTexture( 0, this->driver->getTexture("resources/games/chess/board/themes/wooddark/60.png") );
       //this->boardPlaneNode->getMaterial(0).AmbientColor = SColor(255, 128, 0, 255);
       //or this->boardPlaneNode->getMaterial(0).AmbientColor.set(255, 128, 0, 255);
    }
}
void Game3D::createBoardBase(){

    //Board base

    //float b_tex_repeat = 20.f;
    float fac = 1.1f;
    float base_w = this->BOARD_PLANE_SIZE * fac;
    float base_l = this->BOARD_PLANE_SIZE * fac;
    float base_pos = -this->baseHeight / 2 - 0.05f;
    const IGeometryCreator* igc = this->smgr->getGeometryCreator();
    IMesh*  base_mesh = igc->createCubeMesh(vector3df(base_w, this->baseHeight, base_l));

    this->boardBaseNode = this->smgr->addMeshSceneNode( base_mesh );

    if (this->boardBaseNode)
    {
        this->boardBaseNode->setMaterialFlag(EMF_LIGHTING, false);
        this->boardBaseNode->setMaterialFlag(EMF_TEXTURE_WRAP, false);
        this->boardBaseNode->getMaterial(0).getTextureMatrix(0).setTextureScale(24.f,24.f);//repeat texture - technique!
        //resources/games/chess/board/themes/wooddark/60.png
        //resources/images/wood_base_2.jpg
        this->boardBaseNode->setMaterialTexture( 0, this->driver->getTexture("resources/images/wood_base_2.jpg") );
        this->boardBaseNode->setPosition (vector3df(0.f, base_pos, 0.f));

    }
}

void Game3D::createFloor(){

    //Floor
     video::SMaterial* floor_material = 0;
    float floor_tex_repeat = 14.f;
    u32 floor_size = this->BOARD_PLANE_SIZE * 5.5f;
    const IGeometryCreator* igc = this->smgr->getGeometryCreator();
    IMesh*  floor_mesh = igc->createPlaneMesh(dimension2d<f32>(1, 1),
                                        dimension2d<u32>(floor_size, floor_size),
                                        floor_material,
                                        dimension2d<f32>(floor_tex_repeat, floor_tex_repeat));
    this->floorNode = this->smgr->addMeshSceneNode( floor_mesh );
    this->floorPlaneY = -this->baseHeight;
    if (this->floorNode)
    {
        //this->floorNode->setMaterialFlag(EMF_LIGHTING, false);
        this->floorNode->setMaterialFlag(EMF_TEXTURE_WRAP, false);
        this->floorNode->setMaterialTexture( 0, this->driver->getTexture("resources/images/wood_base_2.jpg") );
        this->floorNode->setPosition (vector3df(0.f, this->floorPlaneY, 0.f));
    }

}

void Game3D::addCamera(){

    //Camera
    s32 cam_id=-1;

    this->cameraNode = this->smgr->addCameraSceneNode (NULL,
                              vector3df(0, 20, -12),
                              vector3df(0, 0, 0),
                              cam_id,
                              true);


    //this->smgr->addCameraSceneNodeFPS(0, 100, 500, -1, 0, 8);
}

void Game3D::addLight(){

    //Light

    //this->smgr->setAmbientLight(video::SColorf(0.3f,0.3f,0.3f));
    //this->smgr->setAmbientLight(video::SColorf(1.0f,1.0f,1.0f));
    f32 const lightRadius = 10.f;
    this->lightNode = this->smgr->addLightSceneNode(NULL,
                                                    vector3df(0.f, 20.f, 0.f),//position
                                                    SColorf(1.f, 1.f, 1.f),//white color
                                                    lightRadius);


    SLight & light_data = this->lightNode->getLightData();
            light_data.Type = ELT_POINT;

}

void Game3D::reOrderBoard(GameDesc desc){
    //first clear the board (remove all pieces) if the game name has change


};

void Game3D::board(GameDesc desc){

        this->createBoardPlane();
        this->createBoardBase();
        this->createFloor();
        this->addCamera();
        this->addLight();
        this->arrangePieces(desc.boardPosition);

};

void Game3D::arrangePieces(std::string board_position){

    this->squareList = this->createBoardContent(board_position);

    Piece* white_caps = this->offBoardWhitePieces(board_position);
    Piece* black_caps = this->offBoardBlackPieces(board_position);

    for(int i=0; i < this->SQ_COUNT; i++){
        if(this->squareList[i].piece == 0){
            continue;
        }

        this->positionPiece(this->squareList[i].piece);
    }

    int len = sizeof(white_caps)/sizeof(*white_caps);
    for(int i=0; i < len; i++){
        this->positionPiece(&white_caps[i]);
    }


    len = sizeof(black_caps)/sizeof(*black_caps);
    for(int i=0; i < len; i++){
        this->positionPiece(&black_caps[i]);
    }

};

int Game3D::toNumericSq(std::string notation){
        int a = notation.at(0);
        int b = notation.at(1);
        b = b - 48;//convert from ascii the actual number
        b = (b - 1) * this->boardConfig.rowCount - 1;

        switch (a) {
            case 'a':
                a = 1;
                break;
            case 'b':
                a = 2;
                break;
            case 'c':
                a = 3;
                break;
            case 'd':
                a = 4;
                break;
            case 'e':
                a = 5;
                break;
            case 'f':
                a = 6;
                break;
            case 'g':
                a = 7;
                break;
            case 'h':
                a = 8;
                break;
            case 'i':
                a = 9;
                break;
            case 'j':
                a = 10;
                break;
            case 'k':
                a = 11;
                break;
            case 'l':
                a = 12;
                break;
        }


        return b + a;
    };

 std::string Game3D::toSquareNotation(int sq){

        int row = std::floor(sq / this->boardConfig.rowCount);
        int col = sq % this->boardConfig.rowCount;
        std::string col_str = "";
        row += 1;
        switch (col) {
            case 0:
                col_str = "a";
                break;
            case 1:
                col_str = "b";
                break;
            case 2:
                col_str = "c";
                break;
            case 3:
                col_str = "d";
                break;
            case 4:
                col_str = "e";
                break;
            case 5:
                col_str = "f";
                break;
            case 6:
                col_str = "g";
                break;
            case 7:
                col_str = "h";
                break;
            case 8:
                col_str = "i";
                break;
            case 9:
                col_str = "j";
                break;
            case 10:
                col_str = "k";
                break;
            case 11:
                col_str = "l";
                break;
        }
        std::stringstream s;
        s << col_str << row;
        return s.str();

    };


void Game3D:: takeOffBoard(Piece* pce, bool is_animate) {
        XZ out = this->nextThrowOutXZ(pce);
        float to_x = out.x;
        float to_y = out.z;

        float to_z = this->floorPlaneY + this->getModelBottom(pce);  //sit on the floor

        pce->x = to_x;
        pce->y = to_y;
        pce->z = to_z;

        if (is_animate) {
            //TODO
        } else {
            //model.position.set(to_x, to_y, to_z);
            pce->model->setPosition (vector3df(pce->x, pce->y, pce->z));
        }

    };

    XZ Game3D::nextThrowOutXZ(Piece* pce) {
        XZ xz;
        float f_row_count = this->boardConfig.rowCount; //important! to avoid loss of precision below since it is int

        float sq_size = this->BOARD_PLANE_SIZE / f_row_count;

        if (pce->white) {

            if (this->whiteThrowOutX == -1) {
                this->whiteThrowOutX = -this->BOARD_PLANE_SIZE / 2 - sq_size;
            }

            if (this->whiteThrowOutZ == -1) {
                this->whiteThrowOutZ = 0;
            } else {
                if (this->whiteThrowOutFwd) {
                    this->whiteThrowOutZ = std::abs(this->whiteThrowOutZ);
                    this->whiteThrowOutZ += sq_size;
                } else {
                    this->whiteThrowOutZ = -this->whiteThrowOutZ;
                }

                this->whiteThrowOutFwd = !this->whiteThrowOutFwd;
            }

            if (this->whiteThrowOutZ >= this->BOARD_PLANE_SIZE / 2
                    || this->whiteThrowOutZ <= -this->BOARD_PLANE_SIZE / 2) {
                this->whiteThrowOutFwd = true;
                this->whiteThrowOutZ = 0;
                this->whiteThrowOutX -= sq_size;
            }

            xz.x = this->whiteThrowOutX;
            xz.z = this->whiteThrowOutZ;
            //return {x: this->whiteThrowOutX, y: this->whiteThrowOutZ};

        } else {

            if (this->blackThrowOutX == -1) {
                this->blackThrowOutX = this->BOARD_PLANE_SIZE / 2 + sq_size;
            }

            if (this->blackThrowOutZ == -1) {
                this->blackThrowOutZ = 0;
            } else {
                if (this->blackThrowOutFwd) {
                    this->blackThrowOutZ = std::abs(this->blackThrowOutZ);
                    this->blackThrowOutZ += sq_size;
                } else {
                    this->blackThrowOutZ = -this->blackThrowOutZ;
                }

                this->blackThrowOutFwd = !this->blackThrowOutFwd;
            }

            if (this->blackThrowOutZ >= this->BOARD_PLANE_SIZE / 2
                    || this->blackThrowOutZ <= -this->BOARD_PLANE_SIZE / 2) {
                this->blackThrowOutFwd = true;
                this->blackThrowOutZ = 0;
                this->blackThrowOutX += sq_size;
            }


            xz.x = this->blackThrowOutX;
            xz.z = this->blackThrowOutZ;
            //return {x: this->blackThrowOutX, z: this->blackThrowOutZ};
        }

        return xz;
    };

    void Game3D::positionPiece(Piece* pce){

        std::string pce_name = pce->name;
            if (pce_name == "") {
                //throw Error('invalid piece name -' + pce_name); //COME BACK
            }
            //model.userData.name = pce_name;
            if (pce->sqLoc != this->OFF_BOARD) {
                XZ center = this->squareCenter(pce->sqLoc);
                pce->x = center.x;
                pce->y = this->getModelBottom(pce);
                pce->z = center.z;

                pce->model->setPosition (vector3df(pce->x, pce->y, pce->z));

            } else {
                this->takeOffBoard(pce, false);
            }
    };

    XZ Game3D::squareCenter(int sq){
        XZ XZ;

        float center_x;
        float center_z;

        float f_row_count = this->boardConfig.rowCount; //important! to avoid loss of precision below since it is int
        float sq_size = this->BOARD_PLANE_SIZE / f_row_count;

        int row = floor(sq / this->boardConfig.rowCount);
        int col = this->boardConfig.rowCount - sq % this->boardConfig.rowCount - 1;

        center_x = (this->boardConfig.rowCount - col) * sq_size - sq_size / 2;
        center_z = (row + 1) * sq_size - sq_size / 2;

        //console.log('center_z', center_z, 'row', row, );
        XZ.x = center_x - this->BOARD_PLANE_SIZE / 2;
        XZ.z = center_z - this->BOARD_PLANE_SIZE / 2;

        return XZ;
    };

    int Game3D::flipSquare(int sq){

        return -1;
    };

    void Game3D::movePiece(int from, int to, int capture){

    };

    void Game3D::boardXZ(){

    };
