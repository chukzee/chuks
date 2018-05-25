
#include <list>
#include <iostream>
#include <sstream>
#include <irrlicht.h>
#include "Game3D.h"
#include "GameDesc.h"
#include "XZ.h"


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

		if (event.EventType == irr::EET_MOUSE_INPUT_EVENT)
		{
			switch(event.MouseInput.Event)
			{
			case EMIE_LMOUSE_PRESSED_DOWN:
				break;

			case EMIE_LMOUSE_LEFT_UP:

				break;

			case EMIE_MOUSE_MOVED:
				//MouseState.Position.X = event.MouseInput.X;
				//MouseState.Position.Y = event.MouseInput.Y;
				this->onHoverBoard(event.MouseInput.X, event.MouseInput.Y);
				break;

			default:
				// We won't use the wheel
				break;
			}
		}


		return false;
	};

void Game3D::init(GameDesc desc){
        this->isOffsetSelection = desc.isOffsetSelection;
        this->boardConfig = this->configBoard(desc.variant);

        this->SQ_COUNT = this->boardConfig.rowCount * this->boardConfig.rowCount;
        delete [] this->squareList;
        this->squareList = new Square[this->SQ_COUNT];

        for(int i=0; i<this->SQ_COUNT; i++){
            this->squareList[i].sq = i;
        }

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
        this->boardZ = -1;
        this->boardRow = -1;
        this->boardCol = -1;
        this->boardSq = -1;
        this->startTouchBoardX = -1;
        this->startTouchBoardZ = -1;
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
    this->boardPlaneNode->setID(isPickableFlag);

    if (this->boardPlaneNode)
    {
        this->boardPlaneNode->setMaterialFlag(EMF_LIGHTING, true);
        this->boardPlaneNode->setMaterialType(EMT_LIGHTMAP_M4);
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

    std::list<Piece*> white_caps = this->offBoardWhitePieces(board_position);
    std::list<Piece*> black_caps = this->offBoardBlackPieces(board_position);

    for(int i=0; i < this->SQ_COUNT; i++){
        if(this->squareList[i].piece == 0){
            continue;
        }

        this->positionPiece(this->squareList[i].piece);
    }

    for(std::list<Piece*>::iterator it = white_caps.begin(); it != white_caps.end(); ++it){
            this->positionPiece(*it);
    }

    for(std::list<Piece*>::iterator it = black_caps.begin(); it != black_caps.end(); ++it){
            this->positionPiece(*it);
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

        return -1;
    };

    void Game3D::movePiece(int from, int to, int capture){

        Piece* mv_piece = this->squareList[from].piece;
        Piece* cap_piece = this->squareList[to].piece;

        //if no piece model is found on the 'to' square but a capture move is received
        //then something is wrong
        if(cap_piece == 0 //
           && (capture >= 0 || capture < this->SQ_COUNT))
        {
           //TOD0 - Throw an error for something is wrong!
        }

        //if a piece model is found on the 'to' square but no capture move is received
        //then something is also wrong
        if(cap_piece != 0 //
           && (capture < 0 || capture >= this->SQ_COUNT))
        {
           //TOD0 - Throw an error for something is wrong!
        }

        float speed = 1.0f;

        const core::array<core::vector3df> move_points; //come back
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
		}

		//a capture
		if(cap_piece != 0 && (capture >= 0 || capture < this->SQ_COUNT))
        {

            const core::array<core::vector3df> cap_points; //come back

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
            }

        }

    };

    void Game3D::onClickBoard(s32 screen_x, s32 screen_y){
        position2d<s32> mouse(screen_x, screen_y);

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
					0); // Check the entire scene (this is actually the implicit default)


    };

    void Game3D::onHoverBoard(s32 screen_x, s32 screen_y){

        this->boardXZ(screen_x, screen_y, false);

    };

    void Game3D::onTouchStartBoard(s32 screen_x, s32 screen_y){//mobile platform

        this->boardXZ(screen_x, screen_y, true);

    };

    void Game3D::onHoverBoardEnd(s32 screen_x, s32 screen_y){//mobile platform

    }

    void Game3D::boardXZ(s32 screen_x, s32 screen_y, bool is_start_touch){

        position2d<s32> mouse(screen_x, screen_y);
        core::line3d<f32> ray = this->colMgr->getRayFromScreenCoordinates(mouse, this->cameraNode);

		ray.start = this->cameraNode->getPosition();
		ray.end = ray.start + (this->cameraNode->getTarget() - ray.start).normalize() * 1000.0f;
        /*
        float posx = 0;
        float posz = 0;

        if (!e)
            float e = window.event;
        if (e.touches && e.touches.length) {
            posx = e.touches[0].pageX;
            posz = e.touches[0].pageY;
        } else if (e.pageX || e.pageY) {
            posx = e.pageX;
            posz = e.pageZ;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
            posz = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
        }
        // posx and posy contain the mouse position relative to the document

        float scene_rect = container.getBoundingClientRect();

        float x_in_canvas = posx - scene_rect.left;
        float z_in_canvas = posy - scene_rect.top;

        float vector2d = new THREE.Vector2();
        vector2d.x = (x_in_canvas / scene_rect.width) * 2 - 1;
        vector2d.z = -(y_in_canvas / scene_rect.height) * 2 + 1;

        this->raycaster.setFromCamera(vector2d, this->camera);
        var intersects = this->raycaster.intersectObjects([this->boardPlane]);
        */

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
        float x = 0.0f;
        float z = 0.0f;
        float f_board_size = this->BOARD_PLANE_SIZE;

        std::cout <<"X= " << intersection.X << std::endl;

        /*if (intersects.length > 0) {
            x = intersects[0].point.x;
            z = intersects[0].point.z;
        }*/

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

        //console.log('x=', x, 'z=', z, 'row=', row, 'col=', col, 'sq=', sq);

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
            this->boardRow = -1;
            this->boardCol = -1;
            this->boardSq = -1;
            //Clear highlighted squares
            /*if (this->captureSquareList.indexOf(this->hoverSquare) === -1) {
                this->highlightSquare(this->hoverSquare, '');//remove the highlight
            }*/
            this->hoverSquare = 0;
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


        //console.log('x=', x, 'z=', z, 'row=', row, 'col=', col, 'sq=', sq);

    };
