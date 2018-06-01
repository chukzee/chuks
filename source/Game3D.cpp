
#include <vector>
#include <algorithm>
#include <iostream>
#include <sstream>
#include <irrlicht.h>
#include "Game3D.h"
#include "GameDesc.h"
#include <MoveResult.h>
#include "XZ.h"
#include <memory>

Game3D::Game3D(IrrlichtDevice* _device, IVideoDriver* _driver, ISceneManager* _smgr){
    _smgr->clear();//clear the whole scene
    this->device = _device;
    this->driver = _driver;
    this->smgr = _smgr;
    this->colMgr = _smgr->getSceneCollisionManager();

    this->device->setEventReceiver(this);

};

Game3D::~Game3D(){
    //delete this->guiEventReceiver;//NO! D0NT DELETE IT! IT IS BEING USED! THAT IS WHY I COMMENTED IT OUT FOR REMINDER
    delete [] this->squareList;
    std::cout << "~Game3D() called" << std::endl;
};

// This is the one method that we have to implement
bool Game3D::OnEvent(const SEvent& event)
	{
        this->OnEventDesktop(event);
        this->OnEventAndroid(event);
        //TODO - more platform goes below

		return false;
	};

bool Game3D::OnEventDesktop(const SEvent& event)
{

        if (event.EventType == irr::EET_MOUSE_INPUT_EVENT)
		{
			switch(event.MouseInput.Event)
			{
			case EMIE_LMOUSE_PRESSED_DOWN:
			    this->onClickBoard(event.MouseInput.X, event.MouseInput.Y, false);
				break;

			case EMIE_LMOUSE_LEFT_UP:
                  //std::cout << "mouse release"<<std::endl;
				break;

			case EMIE_MOUSE_MOVED:
				this->onHoverBoard(event.MouseInput.X, event.MouseInput.Y, false);
				break;


			default:
				// We won't use the wheel
				break;
			}
		}


}

bool Game3D::OnEventAndroid(const SEvent& event)
{
/*
   		if (event.EventType == EET_MULTI_TOUCH_EVENT)
		{
			switch ( event.MultiTouchInput.Event)
			{
				case EMTIE_PRESSED_DOWN:
				{
					// We only work with the first for now, but could be up to NUMBER_OF_MULTI_TOUCHES touches.
					position2d<s32> touchPoint(event.MultiTouchInput.X[0], event.MultiTouchInput.Y[0]);
					this->onTouchStartBoard(touchPoint.X, touchPoint.Y);
					break;
				}
				case EMTIE_LEFT_UP:
				    {

					// We only work with the first for now, but could be up to NUMBER_OF_MULTI_TOUCHES touches.
					position2d<s32> touchPoint(event.MultiTouchInput.X[0], event.MultiTouchInput.Y[0]);
					this->onHoverBoardEnd(touchPoint.X, touchPoint.Y);
					break;
				    }
				case EMTIE_MOVED:
				    {
					// We only work with the first for now, but could be up to NUMBER_OF_MULTI_TOUCHES touches.
					position2d<s32> touchPoint(event.MultiTouchInput.X[0], event.MultiTouchInput.Y[0]);
					this->onHoverBoard(touchPoint.X, touchPoint.Y, true);
					break;
                    }
				default:
					break;
			}
		}

*/

}

void Game3D::init(GameDesc desc){
        this->isOffsetSelection = desc.isOffsetSelection;
        this->boardConfig = this->configBoard(desc.variant);

        this->SQ_COUNT = this->boardConfig.rowCount * this->boardConfig.rowCount;
        delete [] this->squareList;
        this->squareList = new Square[this->SQ_COUNT];

        for(int i=0; i<this->SQ_COUNT; i++){
            this->squareList[i].sq = i;
        }

        this->captureSquareList.clear();
        this->pieceTheme = desc.pieceTheme;
        this->boardTheme = desc.boardTheme;
        this->blackThrowOutFwd = true;
        this->whiteThrowOutFwd = true;
        this->blackThrowOutX = this->OFF_SCENE;
        this->whiteThrowOutX = this->OFF_SCENE;
        this->blackThrowOutZ = this->OFF_SCENE;
        this->whiteThrowOutZ = this->OFF_SCENE;
        this->hoverSquare = this->OFF_BOARD;
        this->pickedSquare = this->OFF_BOARD;
        this->pickedPiece = 0;
        this->boardX = this->OFF_SCENE;
        this->boardZ = this->OFF_SCENE;
        this->boardRow = this->OFF_BOARD;
        this->boardCol = this->OFF_BOARD;
        this->boardSq = this->OFF_BOARD;
        this->startTouchBoardX = this->OFF_SCENE;
        this->startTouchBoardZ = this->OFF_SCENE;
        this->startTouchBoardRow = this->OFF_BOARD;
        this->startTouchBoardCol = this->OFF_BOARD;
        this->startTouchBoardSq = this->OFF_BOARD;
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
    this->boardPlaneNode->setID(this->isPickableFlag);

    if (this->boardPlaneNode)
    {
        this->boardPlaneNode->setMaterialFlag(EMF_LIGHTING, true);
        this->boardPlaneNode->setMaterialType(EMT_LIGHTMAP_M4);
        this->boardPlaneNode->setMaterialTexture( 0, this->driver->getTexture("resources/games/chess/board/themes/wooddark/60.png") );
       //this->boardPlaneNode->getMaterial(0).AmbientColor = SColor(255, 128, 0, 255);
       //or this->boardPlaneNode->getMaterial(0).AmbientColor.set(255, 128, 0, 255);

        scene::ITriangleSelector* selector =
                        this->smgr->createTriangleSelector(
                                                           this->boardPlaneNode->getMesh(),
                                                           this->boardPlaneNode);
		this->boardPlaneNode->setTriangleSelector(selector);
		selector->drop();
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
        this->boardBaseNode->setID(isNotPickableFlag);
        this->boardBaseNode->setMaterialFlag(EMF_LIGHTING, true);
        this->boardBaseNode->setMaterialFlag(EMF_TEXTURE_WRAP, false);
        this->boardBaseNode->setMaterialType(EMT_LIGHTMAP_M4);
        float repeat = 4;
        this->boardBaseNode->getMaterial(0).getTextureMatrix(0).setTextureScale(repeat,repeat);//repeat texture - technique!
        //resources/games/chess/board/themes/wooddark/60.png
        //resources/images/wood_base_2.jpg
        this->boardBaseNode->setMaterialTexture( 0, this->driver->getTexture("resources/images/base/brown_wood_1.jpg") );
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
        this->floorNode->setID(isPickableFlag);
        this->floorNode->setMaterialFlag(EMF_LIGHTING, true);
        this->floorNode->setMaterialFlag(EMF_TEXTURE_WRAP, false);
        this->floorNode->setMaterialType(EMT_LIGHTMAP_M4);
        this->floorNode->setMaterialTexture( 0, this->driver->getTexture("resources/images/floor/wood_base_2.jpg") );
        this->floorNode->setPosition (vector3df(0.f, this->floorPlaneY, 0.f));

       scene::ITriangleSelector* selector =
                    this->smgr->createTriangleSelector(
                                                       this->floorNode->getMesh(),
                                                       this->floorNode);
		this->floorNode->setTriangleSelector(selector);
		selector->drop();
    }

}

void Game3D::addCamera(float flip){

    //Camera
    s32 cam_id=-1;
    float cam_x = 0;
    float cam_y = 18;
    float cam_z = -14;

    if(flip){
        cam_z *=-1;
    }


    this->cameraNode = this->smgr->addCameraSceneNode (NULL,
                              vector3df(cam_x, cam_y, cam_z),
                              vector3df(0, 0, 0),
                              cam_id,
                              true);


    //this->smgr->addCameraSceneNodeFPS(0, 100, 500, -1, 0, 8);
}

void Game3D::addLight(){

    //Light

    this->smgr->setAmbientLight(video::SColorf(0.3f,0.3f,0.3f));
    //this->smgr->setAmbientLight(video::SColorf(1.0f,1.0f,1.0f));
    f32 const lightRadius = 10.f;
    this->lightNode = this->smgr->addLightSceneNode(NULL,
                                                    vector3df(0.f, 40.f, 0.f),//position
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
        this->addCamera(desc.flip);
        this->addLight();
        this->arrangePieces(desc.boardPosition);

};

void Game3D::arrangePieces(std::string board_position){

    this->squareList = this->createBoardContent(board_position);

    std::vector<Piece*> white_caps = this->offBoardWhitePieces(board_position);
    std::vector<Piece*> black_caps = this->offBoardBlackPieces(board_position);

    for(int i=0; i < this->SQ_COUNT; i++){
        if(this->squareList[i].piece == 0){
            continue;
        }

        this->positionPiece(this->squareList[i].piece);
    }

    for(std::vector<Piece*>::iterator it = white_caps.begin(); it != white_caps.end(); ++it){
            this->positionPiece(*it);
    }

    for(std::vector<Piece*>::iterator it = black_caps.begin(); it != black_caps.end(); ++it){
            this->positionPiece(*it);
    }


};

int Game3D::toNumericSq(std::string notation){
        if(notation == ""){
            return this->OFF_BOARD;
        }
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

        int sq = b + a;

        return sq >=0 && sq < this->SQ_COUNT ? sq : this->OFF_BOARD;
    };

 std::string Game3D::toSquareNotation(int sq){
        if(sq == this->OFF_BOARD){
            return "";
        }
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
        float to_z = out.z;

        float to_y = this->floorPlaneY + this->getModelBottom(pce);  //sit on the floor

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
        float f_board_size = this->BOARD_PLANE_SIZE; // convert to float to avoid type conversion issue
        float f_row_count = this->boardConfig.rowCount; //important! to avoid loss of precision below since it is int
        float sq_size = f_board_size / f_row_count;

        float spacing = 1.5;

        if (pce->white) {

            if (this->whiteThrowOutX == -1) {
                this->whiteThrowOutX = -f_board_size / 2 - spacing * sq_size;
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

            if (this->whiteThrowOutZ >= f_board_size / 2
                    || this->whiteThrowOutZ <= -f_board_size / 2) {
                this->whiteThrowOutFwd = true;
                this->whiteThrowOutZ = 0;
                this->whiteThrowOutX -= sq_size;
            }

            xz.x = this->whiteThrowOutX;
            xz.z = this->whiteThrowOutZ;

        } else {

            if (this->blackThrowOutX == -1) {
                this->blackThrowOutX = f_board_size / 2 + spacing * sq_size;
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

            if (this->blackThrowOutZ >= f_board_size / 2
                    || this->blackThrowOutZ <= -f_board_size / 2) {
                this->blackThrowOutFwd = true;
                this->blackThrowOutZ = 0;
                this->blackThrowOutX += sq_size;
            }


            xz.x = this->blackThrowOutX;
            xz.z = this->blackThrowOutZ;
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
        //@Deprecated - we now use the camera to flip by negating the z position
        return -1;
    };

    void Game3D::movePiece(Piece* mv_piece, int to, int capture){
        int from = mv_piece->sqLoc;

        if(from == to){
            std::cout << "INFO: moving piece on same square! 'from' equals 'to'" << std::endl;
            return;
        }

        if(from == this->OFF_BOARD){
            std::cout << "ERROR: moving piece sq location cannot be OFF_BOARD" << std::endl;
            //Something must be wrong!
            return;
        }
        //Piece* mv_piece = this->squareList[from].piece;
        Piece* cap_piece = this->squareList[to].piece;

        //if no piece model is found on the 'to' square but a capture move is received
        //then something is wrong
        if(cap_piece == 0  && capture != this->OFF_BOARD)
        {
           std::cout << "ERROR: No piece model is found on the 'to' square '" << to <<"' but a capture move is received." << std::endl;
           //TOD0 - Throw an error for something is wrong!
        }

        //if a piece model is found on the 'to' square but no capture move is received
        //then something is also wrong
        if(cap_piece != 0 && capture == this->OFF_BOARD)
        {
            std::cout << "ERROR: A piece model is found on the 'to' square '" << to <<"' but no capture move is received." << std::endl;
          //TOD0 - Throw an error for something is wrong!
        }

        float speed = 3.0f;

        const core::array<core::vector3df> move_points = this->catmullRomControlPoints(mv_piece, to);

        s32 move_start_time = this->device->getTimer()->getTime();

        scene::ISceneNodeAnimator* move_anim =
			this->smgr->createFollowSplineAnimator	(move_start_time,
                                        move_points,//const core::array< core::vector3df > &
                                        speed,// speed,
                                        0.5f, //tightness = 0.5f for catmull rom spline.
                                        false,//loop
                                        false//pingpong
                                    );

		if (move_anim)
		{
            mv_piece->sqLoc = to;
            this->squareList[from].piece = 0; // nullify the piece
            this->squareList[to].piece = mv_piece;
			mv_piece->model->addAnimator(move_anim);
			move_anim->drop();
		}else{
		    //Something went wrong!
		    std::cout << "ERROR: Could not create move animator" << std::endl;

		}

		//a capture
		if(cap_piece != 0 && (capture >= 0 || capture < this->SQ_COUNT))
        {

            const core::array<core::vector3df> cap_points = this->catmullRomControlPoints(cap_piece, this->OFF_BOARD);

            s32 cap_start_time = move_start_time;

            scene::ISceneNodeAnimator* cap_anim =
			this->smgr->createFollowSplineAnimator	(cap_start_time,
                                        cap_points,//const core::array< core::vector3df > &
                                        speed,// speed,
                                        0.5f, //tightness = 0.5f for catmull rom spline.
                                        false,//loop
                                        false//pingpong
                                    );


            if (cap_anim)
            {
                cap_piece->sqLoc = this->OFF_BOARD;
                cap_piece->model->addAnimator(cap_anim);
                cap_anim->drop();
            }else{
                //Something went wrong!
                std::cout << "ERROR: Could not create capture animator" << std::endl;
            }

        }

    };

    core::array<core::vector3df> Game3D::catmullRomControlPoints(Piece* pce, float to){
        float fly_height = this->getFlyHeight(pce, to);

        XZ begin = this->squareCenter(pce->sqLoc);
        XZ end;
        if(to != this->OFF_BOARD){
            end = this->squareCenter(to);
        }else{
            end = this->nextThrowOutXZ(pce);
        }
        float dx = end.x - begin.x;
        float dz = end.z - begin.z;
        float distance = std::sqrt(std::pow(dx, 2) + std::pow(dz, 2));
        float slope_angle = std::atan(dz/dx);//in radian

        //start point
        float x1 = begin.x;
        float y1 = pce->bottom + fly_height / 2; // so as to create a smoother rising curve
        float z1 = begin.z;

        //2nd point
        float dx2 = 0.3*distance * std::cos(slope_angle);//change in x at 2nd point
        float dz2 = 0.3*distance * std::sin(slope_angle);//change in z at 2nd point
        float x2 = x1 + dx2;
        float y2 = pce->bottom + fly_height;
        float z2 = z1 + dz2;

        //3rd point
        float dx3 = 0.7*distance * std::cos(slope_angle);//change in x at 3rd point
        float dz3 = 0.7*distance * std::sin(slope_angle);//change in z at 3rd point
        float x3 = x1 + dx3;
        float y3 = pce->bottom + fly_height / 2; //divided so that it looks to be dropping at this point
        float z3 = z1 + dz3;

        //4th and end point
        float x4 = end.x;
        float y4 = pce->bottom;
        float z4 = end.z;


        core::array<core::vector3df> arr_vec;
        arr_vec.push_back(core::vector3df(x1, y1, z1));
        arr_vec.push_back(core::vector3df(x2, y2, z2));
        arr_vec.push_back(core::vector3df(x3, y3, z3));
        arr_vec.push_back(core::vector3df(x4, y4, z4));

        return arr_vec;
    }

    void Game3D::highlightSquare (int sq, std::string style){

        if(style == this->PICKED_SQUARE_STYLE){

        }else if(style== this->CAPTURED_SQUARE_STYLE){

        }else if(style== this->HOVER_SQUARE_STYLE){

        }else if(style==""){
            //remove highlight

        }
    };

    void Game3D::pickPieceOnSquare(int sq){

        if (this->pickedPiece != 0) {
            return;
        }

        this->pickedPiece = this->squareList[sq].piece;

        //this->pickedPiece.style.zIndex = 1000;
    };

    void Game3D::clearHighlights(std::vector<int> sq_list){
        int len = sq_list.size();
        for(int i=0; i<len; i++){
            this->highlightSquare(sq_list[i], "");//remove the highlight
        }
        sq_list.clear();

    };

    void Game3D::clearHighlightsLater(std::vector<int> sq_list, int millsec){
        Task t;
        t.interval = millsec;
        t.time = this->device->getTimer()->getTime() + t.interval;
        t.repeat = false;
        t.exec  = [&](){//lambda function
            this->clearHighlights(sq_list);
        };
        this->tasks.push_back(t);
    };

    void Game3D::onClickBoard(s32 screen_x, s32 screen_y, bool is_tap){

        if (is_tap) {
            this->boardX = this->startTouchBoardX;
            this->boardZ = this->startTouchBoardZ;
            this->boardRow = this->startTouchBoardRow;
            this->boardCol = this->startTouchBoardCol;
            this->boardSq = this->startTouchBoardSq;
        } else {
            this->boardXZ(screen_x, screen_y, is_tap);
        }


        if (this->pickedSquare != this->OFF_BOARD) {

            std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                        this->captureSquareList.end(),
                                                        this->pickedSquare);
            if (iter == this->captureSquareList.end()) {//not found
                this->highlightSquare(this->pickedSquare, "");//remove the highlight
            }

            if (this->pickedPiece != 0) {
                int pk_sq = this->pickedSquare;
                std::string from = this->toSquareNotation(pk_sq);
                std::string to = this->toSquareNotation(this->boardSq);

                // NOTE it is valid for 'from square' to be equal to 'to square'
                //especially in the game of draughts in a roundabout trip capture
                //move where the jumping piece eventaully return to its original
                //square. So it is upto the subsclass to check for where 'from square'
                //ie equal to 'to square' where necessary  an code accordingly

                MoveResult moveResult = this->makeMove(from, to);

                //validate the move result returned by the subclass.
                //the result must contain neccessary fields
                /*if (!('done' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "done"');
                } else if (!('hasMore' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "hasMore"');
                } else if (!('error' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "error"');
                } else if (!('capture' in moveResult)) {
                    throw Error('Move result returned by subcalss must contain the field, "capture"');
                }*/
                int cap_sq = this->toNumericSq(moveResult.mark_capture);
                if (cap_sq != this->OFF_BOARD) {
                        this->highlightSquare(cap_sq, this->CAPTURED_SQUARE_STYLE);
                        this->captureSquareList.push_back(cap_sq);
                }

                if (moveResult.error != "") {
                    //TODO display the error message
                    std::cout<< "TODO display the error message"<< std::endl;
                    std::cout<<"move error:', moveResult.error"<< std::endl;

                    //animate the piece to the  position
                    this->movePiece(this->pickedPiece, pk_sq);
                } else {//error
                    int capture_sq = this->toNumericSq(moveResult.capture);
                    this->movePiece(this->pickedPiece, this->boardSq, capture_sq);
                }

                //nullify the picked square if move is completed or a move error occur
                if (moveResult.done || moveResult.error != "") {
                    this->pickedSquare = this->OFF_BOARD;
                    this->pickedPiece = 0;
                    std::vector<int> capSqLst = this->captureSquareList; //ok
                    this->captureSquareList.clear();
                    this->clearHighlightsLater(capSqLst, 1000);
                }

            }

            return;
        }

        /*if (!Main.device.isMobileDeviceReady) {//desktop

            if (evt.target.dataset.type !== 'piece') {//must click the piece not the container
                return;
            }
        }*/

        int sq = this->boardSq;
        std::string sqn = this->toSquareNotation(sq);

        if(sqn ==""){
           return;
        }

        Piece* pce = this->getInternalPiece(sqn);

        if(sqn !="" && pce == 0){
            std::cout << "empty square at "<< sqn << std::endl;
            return;
        }

        bool side1 = pce->white;
        bool side2 = this->gameDesc.userSide == "w";
        if (pce != 0
                /*&& side1 === side2*/ //UNCOMMENT LATER
                ) {
            this->pickedSquare = sq;
            this->highlightSquare(this->pickedSquare, this->PICKED_SQUARE_STYLE);
            this->pickPieceOnSquare(sq);
        }


    };

    void Game3D::onHoverBoard(s32 screen_x, s32 screen_y, bool is_touch){


        if (is_touch) {
            this->boardXZ(screen_x, screen_y, true);
            this->isTouchingBoard = true;
        } else {
            //mouse move
            this->boardXZ(screen_x, screen_y);
        }

        if (this->boardSq == this->pickedSquare) {
            if (this->hoverSquare != this->pickedSquare) {

                std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                        this->captureSquareList.end(),
                                                        this->hoverSquare);
                if (iter == this->captureSquareList.end()) {//not found
                    this->highlightSquare(this->hoverSquare, "");//remove the highlight
                }
            }
            return;
        }


        if (this->hoverSquare != this->pickedSquare) {
            std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                        this->captureSquareList.end(),
                                                        this->hoverSquare);
            if (iter == this->captureSquareList.end()) {//not found
                this->highlightSquare(this->hoverSquare, "");//remove the highlight
            }
        }


        this->hoverSquare = this->boardSq;
        std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                        this->captureSquareList.end(),
                                                        this->hoverSquare);
        if (iter == this->captureSquareList.end()) {//not found
            this->highlightSquare(this->hoverSquare, this->HOVER_SQUARE_STYLE);
        }

    };

    void Game3D::onTouchStartBoard(s32 screen_x, s32 screen_y){//mobile platform
        this->boardXZ(screen_x, screen_y, true);
    };

    void Game3D::onHoverBoardEnd(s32 screen_x, s32 screen_y){//mobile platform
        if (!this->isTouchingBoard) {// tap detected
            this->onClickBoard(-1, -1, true);
            return;
        }
        this->boardX = this->OFF_BOARD;
        this->boardZ = this->OFF_BOARD;
        this->isTouchingBoard = false;
        if (this->hoverSquare != this->pickedSquare) {
            std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                            this->captureSquareList.end(),
                                                            this->hoverSquare);
            if (iter == this->captureSquareList.end()) {//not found
                this->highlightSquare(this->hoverSquare, "");//remove the highlight
            }
        }
    }

    void Game3D::boardXZ(s32 screen_x, s32 screen_y, bool is_start_touch){

        position2di mouse(screen_x, screen_y);
        core::line3d<f32> ray = this->colMgr->getRayFromScreenCoordinates(mouse, this->cameraNode);

        core::vector3df intersection;
        core::triangle3df hitTriangle;

        scene::ISceneNode * selectedSceneNode =
			this->colMgr->getSceneNodeAndCollisionPointFromRay(
					ray,
					intersection, // This will be the position of the collision
					hitTriangle, // This will be the triangle hit in the collision
					this->isPickableFlag, // This ensures that only nodes that we have
							// set up to be pickable are considered
					0, // Check the entire scene (this is actually the implicit default)
					true);

        float x = intersection.X;
        float z = intersection.Z;
        float f_board_size = this->BOARD_PLANE_SIZE;

        //row and col

        float sq_w = f_board_size / this->boardConfig.rowCount;
        float sq_h = f_board_size / this->boardConfig.rowCount;

        if (this->isOffsetSelection) {//for only smart phones and tablets of medium size
            //Now make the y offset allow easy pick of piece especailly on small device
            if (z < f_board_size - sq_h / 2) {//above middle of first row
                z -= sq_h; // offset y by square height
            }
        }

        float row = this->boardConfig.rowCount - floor((f_board_size / 2 - z) / sq_h) - 1;
        float col = this->boardConfig.rowCount - floor((f_board_size / 2 - x) / sq_w) - 1;


        if (x < -f_board_size / 2) {
            x = -f_board_size / 2;
        }
        if (z < -f_board_size / 2) {
            z = -f_board_size / 2;
        }

        if (x > f_board_size / 2) {
            x = f_board_size / 2;
        }
        if (z > f_board_size / 2) {
            z = f_board_size / 2;
        }


        if (row < 0
                || col < 0
                || row > this->boardConfig.rowCount - 1
                || col > this->boardConfig.rowCount - 1) {//OFF BOARD

            this->boardX = x;
            this->boardZ = z;
            this->boardRow = this->OFF_BOARD;
            this->boardCol = this->OFF_BOARD;
            this->boardSq = this->OFF_BOARD;
            //Clear highlighted squares
            std::vector<int>::iterator iter = std::find (this->captureSquareList.begin(),
                                                        this->captureSquareList.end(),
                                                        this->hoverSquare);
            if (iter == this->captureSquareList.end()) {//not found
                this->highlightSquare(this->hoverSquare, "");//remove the highlight
            }
            this->hoverSquare = this->OFF_BOARD;
            //console.log('leave');
            return;
        }

        float sq = row * this->boardConfig.rowCount + col;

        if (is_start_touch) {
            this->startTouchBoardX = x;
            this->startTouchBoardZ = z;
            this->startTouchBoardRow = row;
            this->startTouchBoardCol = col;
            this->startTouchBoardSq = sq;
        } else {
            this->boardX = x;
            this->boardZ = z;
            this->boardRow = row;
            this->boardCol = col;
            this->boardSq = sq;
        }


        std::cout <<"X= " << intersection.X <<", Y= " << intersection.Y << ", Z= " << intersection.Z <<", col= " << col << ", row= " << row << ", sq= " << sq <<std::endl;

    };
