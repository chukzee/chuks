#include <iostream>
#include <string>
#include <Game3DFactory.h>
#include <GameDesc.h>
#include <games/Chess3D.h>
#include <games/Draughts3D.h>
#include <memory>


Game3DFactory::~Game3DFactory(){
    std::cout << "~Game3DFactory() called" << std::endl;
};

void Game3DFactory::create(GameDesc desc){

    std::string chess = "chess";
    std::string draughts = "draughts";


    //Game3D* game3D = 0;
    if(desc.game == chess){
        this->game3D = std::shared_ptr<Game3D>(new Chess3D(this->device, this->driver, this->smgr));
        this->game3D->load(desc);
    }else if(desc.game == draughts){
        this->game3D = std::shared_ptr<Game3D>(new Draughts3D(this->device, this->driver, this->smgr));
        this->game3D->load(desc);
    }

}

