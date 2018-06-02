#ifndef TASK_H_INCLUDED
#define TASK_H_INCLUDED

class Game3D;

#include <iostream>
#include <functional>

template <class T>

class Task{

public:
    ~Task(){
        std::cout << "Task destructor called" << std::endl;
    };
    T param;
    bool repeat;
    unsigned int interval;// in millisecond
    unsigned int time;
    std::function<void(T)> exec;
};

#endif // TASK_H_INCLUDED
