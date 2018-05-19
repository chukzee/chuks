
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
        bool  flip = false; //if false if the user is white otherwise true - if false it means the white is directly close to the player
        std::string boardTheme;
        std::string pieceTheme;

    protected:

    private:
};



#endif
