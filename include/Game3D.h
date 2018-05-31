
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
#include <Task.h>
#include <MoveResult.h>


using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;


class Game3D : public IEventReceiver{

    private:
        const std::string PICKED_SQUARE_STYLE = "PICKED_SQUARE_STYLE";
        const std::string CAPTURED_SQUARE_STYLE = "CAPTURED_SQUARE_STYLE";
        const std::string HOVER_SQUARE_STYLE = "HOVER_SQUARE_STYLE";
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
        void boardXZ(s32 screen_x, s32 screen_y, bool is_start_touch = false);
        void movePiece(Piece* pce, int to, int capture = OFF_BOARD);
        void highlightSquare (int sq, std::string style);
        void pickPieceOnSquare (int sq);
        std::list<int> captureSquareList;
        void clearHighlightsLater(std::list<int> sq_list, int millsec);

    public:
        IrrlichtDevice* device;
        IVideoDriver* driver;
        ISceneManager* smgr;
        ISceneCollisionManager* colMgr;
        Game3D();
        Game3D(IrrlichtDevice* _device, IVideoDriver* _driver, ISceneManager* _smgr);
        ~Game3D();
        static const int OFF_BOARD = -1;
        const int OFF_SCENE = -1000000;
        int SQ_COUNT = -1;
        std::list<Task*> tasks;
        void init(GameDesc desc);
        void load(GameDesc desc);
        void onClickBoard(s32 screen_x, s32 screen_y, bool is_touch);
        void onHoverBoard(s32 screen_x, s32 screen_y, bool is_touch);
        void onTouchStartBoard(s32 screen_x, s32 screen_y);//mobile platform
        void onHoverBoardEnd(s32 screen_x, s32 screen_y);//mobile platform
        virtual MoveResult makeMove(std::string from, std::string to) = 0;

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

        float blackThrowOutX = OFF_SCENE;
        float whiteThrowOutX = OFF_SCENE;
        float blackThrowOutZ = OFF_SCENE;
        float whiteThrowOutZ = OFF_SCENE;

        Square* squareList = new Square[0];

        int hoverSquare = OFF_BOARD;
        int pickedSquare = OFF_BOARD;
        Piece* pickedPiece = 0;
        float boardRow = OFF_BOARD;
        float boardCol = OFF_BOARD;
        float boardSq = OFF_BOARD;

        float boardX = OFF_SCENE;
        float boardZ = OFF_SCENE;
        float startTouchBoardX = OFF_SCENE;
        float startTouchBoardZ = OFF_SCENE;
        float startTouchBoardRow = OFF_SCENE;
        float startTouchBoardCol = OFF_SCENE;
        float startTouchBoardSq = OFF_SCENE;
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

        virtual Piece* getInternalPiece(std::string sqn) = 0;


};


#endif //avoid duplicate include compilation error
