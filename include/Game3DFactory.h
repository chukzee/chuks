
#ifndef GAME3DFACTORY_H_INCLUDED
#define GAME3DFACTORY_H_INCLUDED

// forward declared dependencies
class GameDesc;


// included dependencies
#include <irrlicht.h>


using namespace irr;

using namespace core;
using namespace scene;
using namespace video;
using namespace io;
using namespace gui;


class Game3DFactory{
    public:
    //static member of easy access
    IVideoDriver* driver;
    ISceneManager* smgr;
    IGUIEnvironment* guienv;

    Game3DFactory(IVideoDriver* _driver,
                   ISceneManager* _smgr,
                   IGUIEnvironment* _guienv){
                        this->driver = _driver;
                        this->smgr = _smgr;
                        this->guienv = _guienv;
                   };

    void create(GameDesc desc);
};



#endif
