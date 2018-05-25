
#ifndef GAME3D_H_INCLUDED
#define GAME3D_H_INCLUDED

// forward declared dependencies
class XZ;

// included dependencies
#include <list>
#include <string>
#include <irrlicht.h>
#include <Piece.h>
#include <Square.h>
#include <GameDesc.h>
#include <BoardConfig.h>



using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;


class Game3D : public IEventReceiver{

    private:
        int isNotPickableFlag = 0;
        int isPickableFlag = 1 << 0;
        bool isOffsetSelection = false;
        BoardConfig boardConfig;
        bool isNewBoard = true;
        void board(GameDesc desc);
        void reOrderBoard(GameDesc desc);
        int toNumericSq();
        std::string toSquareNotation(int i);
        int toNumericSq(std::string notation);
        void takeOffBoard(Piece* pce, bool is_animate);
        XZ nextThrowOutXZ(Piece* pce);
        int flipSquare(int sq);
        void positionPiece(Piece* pce);
        XZ squareCenter(int sq);
        void boardXZ(s32 screen_x, s32 screen_y, bool is_start_touch);
        void movePiece(int from, int to, int capture);

    public:
        IrrlichtDevice* device;
        IVideoDriver* driver;
        ISceneManager* smgr;
        ISceneCollisionManager* colMgr;
        Game3D();
        Game3D(IrrlichtDevice* _device, IVideoDriver* _driver, ISceneManager* _smgr);
        ~Game3D();
        const int OFF_BOARD = -1;
        int SQ_COUNT = -1;
        void init(GameDesc desc);
        void load(GameDesc desc);
        void onClickBoard(s32 screen_x, s32 screen_y);
        void onHoverBoard(s32 screen_x, s32 screen_y);
        void onTouchStartBoard(s32 screen_x, s32 screen_y);//mobile platform
        void onHoverBoardEnd(s32 screen_x, s32 screen_y);//mobile platform

    protected:

        const u32 BOARD_PLANE_SIZE = 20;
        GameDesc gameDesc;
        IMeshSceneNode* boardPlaneNode = 0;
        IMeshSceneNode* boardBaseNode = 0;
        IMeshSceneNode* floorNode = 0;
        ICameraSceneNode* cameraNode = 0;
        ILightSceneNode* lightNode = 0;
        float baseHeight =  2.5f;
        std::string pieceTheme;
        std::string boardTheme;
        float floorPlaneY = -1;
        bool blackThrowOutFwd = true;
        bool whiteThrowOutFwd = true;
        float blackThrowOutX = -1;
        float whiteThrowOutX = -1;
        float blackThrowOutZ = -1;
        float whiteThrowOutZ = -1;
        Square* squareList = new Square[0];
        Square* hoverSquare = 0;
        Square* pickedSquare = 0;
        Piece* pickedPiece = 0;
        float boardX = -1;
        float boardZ = -1;
        float boardRow = -1;
        float boardCol = -1;
        float boardSq = -1;
        float startTouchBoardX = -1;
        float startTouchBoardZ = -1;
        float startTouchBoardRow = -1;
        float startTouchBoardCol = -1;
        float startTouchBoardSq = -1;
        bool isTouchingBoard = false;

        bool OnEvent(const SEvent& event);

        void createBoardPlane();

        void createBoardBase();

        void createFloor();

        void addCamera(float flip);

        void addLight();

        void arrangePieces(std::string board_position);

        //purely virtual function

        virtual Square* createBoardContent(std::string board_position) = 0;
        //white pieces captured
        virtual std::list<Piece*> offBoardWhitePieces(std::string board_position) = 0;
        //black pieces captured
        virtual std::list<Piece*> offBoardBlackPieces(std::string board_position) = 0;
        //board configuration
        virtual BoardConfig configBoard(std::string variant) = 0;

        virtual std::string getPieceName() = 0;

        virtual bool isWhitePieceModel() = 0;

        virtual float getModelBottom(Piece* pce) = 0;

        virtual void createPieceModel(Piece* p) = 0;

        virtual bool isWhite() = 0;


};


#endif //avoid duplicate include compilation error
