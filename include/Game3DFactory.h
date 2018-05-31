
#ifndef GAME3DFACTORY_H_INCLUDED
#define GAME3DFACTORY_H_INCLUDED

// forward declared dependencies
class GameDesc;
class Game3D;

// included dependencies
#include <irrlicht.h>
#include <memory>


using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;


class Game3DFactory{
private:
    std::shared_ptr<Game3D> game3D = 0;
    public:
    //static member of easy access
    IrrlichtDevice* device;
    IVideoDriver* driver;
    ISceneManager* smgr;
    IGUIEnvironment* guienv;

    Game3DFactory(IrrlichtDevice* _device,
                  IVideoDriver* _driver,
                   ISceneManager* _smgr,
                   IGUIEnvironment* _guienv){
                        this->device = _device;
                        this->driver = _driver;
                        this->smgr = _smgr;
                        this->guienv = _guienv;
                   };

    ~Game3DFactory();

    std::shared_ptr<Game3D> create(GameDesc desc);
};



#endif
