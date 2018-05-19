#include <string>
#include <Game3DFactory.h>
#include <GameDesc.h>
#include <games/Chess3D.h>
#include <games/Draughts3D.h>

void Game3DFactory::create(GameDesc desc){

    std::string chess = "chess";
    std::string draughts = "draughts";

    if(desc.game == chess){
       Chess3D(this->driver, this->smgr).load(desc);
    }else if(desc.game == draughts){
        Draughts3D(this->driver, this->smgr).load(desc);
    }

}

