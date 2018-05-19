
#ifndef XZ_H_INCLUDED
#define XZ_H_INCLUDED


class XZ{

    public:
    float x;
    float z;
    XZ(){};
    XZ(float x, float z){
        this->x = x;
        this->z = z;
    };
    ~XZ(){
    };
public:
    float getX(){return this->x;};
    float getZ(){return this->z;};
};



#endif
