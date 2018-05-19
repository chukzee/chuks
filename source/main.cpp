#include <iostream>

#include <irrlicht.h>
#include <Game3DFactory.h>
#include <GameDesc.h>


using namespace std;

using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;

class MainUI{

    public:

    void show(GameDesc gameDesc){

        IrrlichtDevice *device =
            createDevice(EDT_OPENGL, dimension2d<u32>(640, 480), 16,
                false, false, false, 0);

        /*
        Set the caption of the window to some nice text. Note that there is
        a 'L' in front of the string. The Irrlicht Engine uses wide character
        strings when displaying text.
        */
        device->setWindowCaption(L"GameBaba World");

        /*
        Get a pointer to the video driver, the SceneManager and the
        graphical user interface environment, so that
        we do not always have to write device->getVideoDriver(),
        device->getSceneManager() and device->getGUIEnvironment().
        */
        IVideoDriver* driver = device->getVideoDriver();
        ISceneManager* smgr = device->getSceneManager();
        IGUIEnvironment* guienv = device->getGUIEnvironment();

        Game3DFactory* factory = new Game3DFactory(driver, smgr, guienv);
        factory->create(gameDesc);
        this->runDevice(device, driver, smgr, guienv);

        //cout << factory << endl;//TESTING!

        //delete  factory;

        //cout << factory << endl;//TESTING!
    };

    void runDevice(IrrlichtDevice* device,
                   IVideoDriver* driver,
                   ISceneManager* smgr,
                   IGUIEnvironment* guienv){


        /*
        Ok, now we have set up the scene, lets draw everything:
        We run the device in a while() loop, until the device does not
        want to run any more. This would be when the user closed the window
        or pressed ALT+F4 in windows.
        */
        while(device->run())
        {
            /*
            Anything can be drawn between a beginScene() and an endScene()
            call. The beginScene clears the screen with a color and also the
            depth buffer if wanted. Then we let the Scene Manager and the
            GUI Environment draw their content. With the endScene() call
            everything is presented on the screen.
            */
            driver->beginScene(true, true, SColor(0,200,200,200));

            smgr->drawAll();
            guienv->drawAll();

            driver->endScene();
        }

        /*
        After we are finished, we have to delete the Irrlicht Device
        created before with createDevice(). In the Irrlicht Engine,
        you will have to delete all objects you created with a method or
        function which starts with 'create'. The object is simply deleted
        by calling ->drop().
        See the documentation at
        http://irrlicht.sourceforge.net//docu/classirr_1_1IUnknown.html#a3
        for more information.
        */
        device->drop();
    };

    /*
     Called by external program
    */
     char* readEx(){
         //NOT YETY IMPLEMENTED
         return "";
     };

    /*
     Called by external program
    */
    GameDesc readGameDesc(){
        //TODO
        //ROUGH IMPLEMENTATION
        GameDesc desc = GameDesc();
        //rougly fill in the field

        desc.game = "chess";
        desc.variant = "INTERNATIONAL_DRAUGHTS";//for draughts
        desc.boardPosition = "";
        desc.flip = false; //if false if the user is white otherwise true - if false it means the white is directly close to the player
        desc.boardTheme = "";
        desc.pieceTheme = "";

        return desc;
    };

};

int main(int argc, char** argv)
{
    MainUI* ui;
    GameDesc desc= ui->readGameDesc();//come back to decide on whether
    // this call should be asynchronous - if so the line below must only
    //be called upon completion
    ui->show(desc);

    return 0;
}

