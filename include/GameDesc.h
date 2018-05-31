
#ifndef GAMEDESC_H_INCLUDED
#define GAMEDESC_H_INCLUDED

#include <string>

 class GameDesc
{
    public:

        GameDesc() {}
        ~GameDesc() {}

        std::string game;
        std::string variant;
        std::string boardPosition;
        std::string userSide = ""; //possible values are  "w" and "b" and "s" and "" for white , black, spectator and empty respectively. note empty string also means the user is a spectator
        bool  flip = false; //if false if the user is white otherwise true - if false it means the white is directly close to the player
        bool isOffsetSelection = false;
        std::string boardTheme;
        std::string pieceTheme;

    protected:

    private:
};



#endif
